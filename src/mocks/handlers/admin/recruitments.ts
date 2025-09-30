import { http as mswHttp, HttpResponse, delay, passthrough } from 'msw'
import { BASE_PATH, like, paginate, sortByKey, toInt } from '@/mocks/utils'
import {
  recruitmentsDb,
  type RecruitmentRow,
} from '@/mocks/seeds/recruitment.seed'

const V1 = `${BASE_PATH}/v1`
const LEGACY = `${BASE_PATH}`

// 한 번만 초기화
recruitmentsDb.init()

/** 고정 태그 풀 (id/name 매핑용) */
const TAG_POOL: { id: string; name: string }[] = [
  { id: 'react', name: 'React' },
  { id: 'vue', name: 'Vue.js' },
  { id: 'angular', name: 'Angular' },
  { id: 'js', name: 'JavaScript' },
  { id: 'ts', name: 'TypeScript' },
  { id: 'spring', name: 'Spring Boot' },
  { id: 'node.js', name: 'Node.js' },
  { id: 'express', name: 'Express' },
  { id: 'nextjs', name: 'NextJS' },
  { id: 'java', name: 'Java' },
  { id: 'python', name: 'Python' },
  { id: 'django', name: 'Django' },
  { id: 'fast', name: 'FastAPI' },
  { id: 'flask', name: 'Flask' },
  { id: 'php', name: 'PHP' },
  { id: 'docker', name: 'Docker' },
  { id: 'kubernetes', name: 'Kubernetes' },
  { id: 'aws', name: 'AWS' },
  { id: 'azure', name: 'Azure' },
  { id: 'gcp', name: 'GCP' },
  { id: 'frontend', name: 'Frontend' },
  { id: 'backend', name: 'Backend' },
  { id: 'fullstack', name: 'Fullstack' },
  { id: 'devops', name: 'DevOps' },
  { id: 'ai', name: 'AI' },
  { id: 'ml', name: 'ML' },
]

type ListItem = {
  id: number
  uuid: string
  title: string
  img: string | null
  expected_headcount: number
  tags: string[] // 목록 응답은 문자열 배열 유지(표시는 name)
  close_at: string | null
  views_count: number
  bookmarks_count: number
  created_at: string
  updated_at: string | null
  status: 'OPEN' | 'CLOSED'
}

const isClosed = (iso: string | null) =>
  iso ? new Date(iso).getTime() < Date.now() : false

// DB row -> 목록 아이템(태그를 name 문자열로 통일)
function rowToListItem(row: RecruitmentRow): ListItem {
  const closeAtISO = row.close_at ? new Date(row.close_at).toISOString() : null
  const tagsAsNames = (row.tags ?? []).map((t) => {
    const hit = TAG_POOL.find((x) => x.id === t || x.name === t)
    return hit ? hit.name : String(t)
  })
  return {
    id: Number(row.id),
    uuid: row.uuid,
    title: row.title,
    img: row.img ?? 'https://picsum.photos/seed/oz-recruit/640/360',
    expected_headcount: Number(row.expected_headcount ?? 5),
    tags: tagsAsNames,
    close_at: closeAtISO,
    views_count: Number(row.views_count ?? 0),
    bookmarks_count: Number(row.bookmarks_count ?? 0),
    created_at: row.created_at,
    updated_at: row.updated_at ?? null,
    status: isClosed(closeAtISO) ? 'CLOSED' : 'OPEN',
  }
}

function mapOrdering(ordering?: string | null): {
  key?: string
  desc?: boolean
} {
  if (!ordering || ordering === '' || ordering === 'undefined') {
    return { key: 'created_at', desc: true }
  }
  const desc = ordering.startsWith('-')
  const key = desc ? ordering.slice(1) : ordering
  return { key, desc }
}

function listResponse(url: URL, opts?: { excludeClosed?: boolean }) {
  const page = toInt(url.searchParams.get('page'), 1)
  const size = toInt(url.searchParams.get('size'), 10)
  const q = (url.searchParams.get('search') || '').trim()
  const tagParam = (url.searchParams.get('tag') || '').trim()
  const ordering = url.searchParams.get('ordering')
  const status = (url.searchParams.get('status') || 'ALL').toUpperCase()
  const isClosedParam = url.searchParams.get('is_closed')

  // ✅ 항상 DB에서 가져오기
  let rows = recruitmentsDb.rows.map(rowToListItem)

  if (opts?.excludeClosed) rows = rows.filter((r) => r.status === 'OPEN')
  if (q) rows = rows.filter((r) => like(r.title, q))

  if (tagParam) {
    const hit = TAG_POOL.find((t) => t.id === tagParam || t.name === tagParam)
    const name = hit ? hit.name : tagParam
    const id = hit ? hit.id : tagParam
    rows = rows.filter((r) => r.tags.includes(name) || r.tags.includes(id))
  }

  if (status === 'OPEN') rows = rows.filter((r) => r.status === 'OPEN')
  if (status === 'CLOSED') rows = rows.filter((r) => r.status === 'CLOSED')

  if (isClosedParam !== null) {
    const wantClosed = ['1', 'true', 'True'].includes(isClosedParam)
    rows = rows.filter((r) =>
      wantClosed ? r.status === 'CLOSED' : r.status === 'OPEN'
    )
  }

  const { key, desc } = mapOrdering(ordering)
  if (key) rows = sortByKey(rows, key, desc ? 'desc' : 'asc')

  const { items, total } = paginate(rows, page, size)
  const mkLink = (p: number) => {
    const base = url.origin + url.pathname
    const sp = new URLSearchParams()
    sp.set('page', String(p))
    sp.set('size', String(size))
    if (ordering) sp.set('ordering', ordering)
    if (q) sp.set('search', q)
    if (tagParam) sp.set('tag', tagParam)
    if (status && status !== 'ALL') sp.set('status', status)
    return `${base}?${sp.toString()}`
  }

  return {
    count: total,
    next: page * size < total ? mkLink(page + 1) : null,
    previous: page > 1 ? mkLink(page - 1) : null,
    results: items,
  }
}

function pair(
  method: 'get' | 'post',
  path: string,
  handler: Parameters<typeof mswHttp.get>[1]
) {
  const h1 = (mswHttp as any)[method](`${LEGACY}${path}`, handler)
  const h2 = (mswHttp as any)[method](`${V1}${path}`, handler)
  return [h1, h2]
}

export const recruitmentHandlers = [
  // 목록 (공개): CLOSED 자동 제외
  ...pair('get', '/recruitments', async ({ request }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(120)
    const url = new URL(request.url)
    const body = listResponse(url, { excludeClosed: true })
    console.log('[MSW] 구인공고 목록', Object.fromEntries(url.searchParams))
    return HttpResponse.json(body)
  }),

  // 태그 목록
  ...pair('get', '/recruitments/tags', async ({ request }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(60)
    const tags = TAG_POOL.map((t) => ({ id: t.id, name: t.name })).sort(
      (a, b) => a.name.localeCompare(b.name)
    )
    return HttpResponse.json(tags)
  }),
]
