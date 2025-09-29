/* eslint-disable @typescript-eslint/no-explicit-any */

export type SortKey =
  | 'created_desc'
  | 'created_asc'
  | 'views_desc'
  | 'bookmarks_desc'
export type StatusFilter = 'ALL' | 'OPEN' | 'CLOSED'

export type RecruitmentListItem = {
  id: number
  uuid: string
  title: string
  img: string | null
  expected_headcount: number
  lectures: { title: string; instructor: string }[]
  tags: string[]
  close_at: string | null
  views_count: number
  bookmarks_count: number
  created_at?: string
  updated_at?: string | null
  status?: 'OPEN' | 'CLOSED'
}

export type RecruitmentListRes = {
  total: number
  page: number
  pageSize: number
  totalPages: number
  items: RecruitmentListItem[]
  next?: string | null
  previous?: string | null
}

export type GetRecruitmentsParams = {
  page: number
  pageSize: number
  search?: string
  tag?: string
  sortKey?: SortKey
  /** 서버가 지원하므로(핸들러 기준) 넘기면 서버 필터를 사용합니다. 기본은 'ALL' */
  status?: StatusFilter
  /** 백엔드 호환 플래그: true/false 로 닫힘여부 강제 */
  isClosed?: boolean
}

const ORDER_MAP: Record<SortKey, string> = {
  created_desc: '-created_at',
  created_asc: 'created_at',
  views_desc: '-views_count',
  bookmarks_desc: '-bookmarks_count',
}

type FetchOpts = {
  /** 실서버 통과시키고 싶을 때 */
  bypassMock?: boolean
}

const API_BASE = '/api/v1'

export async function getRecruitments(
  {
    page,
    pageSize,
    search,
    tag,
    sortKey = 'created_desc',
    status = 'ALL',
    isClosed,
  }: GetRecruitmentsParams,
  opts?: FetchOpts
): Promise<RecruitmentListRes> {
  const qs = new URLSearchParams()
  qs.set('page', String(page))
  qs.set('size', String(pageSize))

  if (search) qs.set('search', search)
  if (tag) qs.set('tag', tag)
  if (sortKey) qs.set('ordering', ORDER_MAP[sortKey])
  if (status && status !== 'ALL') qs.set('status', status) // MSW 핸들러가 처리함
  if (typeof isClosed === 'boolean')
    qs.set('is_closed', isClosed ? 'true' : 'false')

  const headers: Record<string, string> = {}
  if (opts?.bypassMock) headers['x-bypass-mock'] = '1'

  const res = await fetch(`${API_BASE}/recruitments?${qs.toString()}`, {
    headers,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Recruitments fetch failed (${res.status}) ${text}`)
  }

  // MSW/백엔드 응답: { count, next, previous, results }
  const data: any = await res.json()
  const total = Number(data?.count ?? 0)
  const items: RecruitmentListItem[] = Array.isArray(data?.results)
    ? data.results
    : []
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return {
    total,
    page,
    pageSize,
    totalPages,
    items,
    next: data?.next ?? null,
    previous: data?.previous ?? null,
  }
}

export type RecruitmentTag = { id: string; name: string }

export async function getRecruitmentTags(
  opts?: FetchOpts
): Promise<RecruitmentTag[]> {
  const headers: Record<string, string> = {}
  if (opts?.bypassMock) headers['x-bypass-mock'] = '1'

  const res = await fetch(`${API_BASE}/recruitments/tags`, { headers })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Recruitment tags fetch failed (${res.status}) ${text}`)
  }
  const data: any[] = await res.json()
  return (Array.isArray(data) ? data : []).map((t) => ({
    id: String(t.id ?? ''),
    name: String(t.name ?? ''),
  }))
}
