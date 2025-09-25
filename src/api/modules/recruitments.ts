/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { http as mswHttp, HttpResponse, delay, passthrough } from 'msw'
import { recruitmentSeeds } from '@/mocks/seeds/recruitment.seed'
import { BASE_PATH, like, paginate, sortByKey, toInt } from '@/mocks/utils'

/**
 * 관리자 "스터디 구인 공고 관리" 전용 MSW 핸들러
 * - 목록(/api/recruitments, /api/v1/recruitments)
 * - 태그(/api/recruitments/tags, /api/v1/recruitments/tags)
 * - x-bypass-mock 헤더면 passthrough
 */
const V1 = `${BASE_PATH}/v1`
const LEGACY = `${BASE_PATH}`

export type RecruitmentListItem = {
  id: number
  uuid: string
  title: string
  img: string | null // null 허용
  expected_headcount: number
  lectures: { title: string; instructor: string }[]
  tags: string[] // 목록은 문자열 배열이 스펙
  close_at: string | null // null 허용
  views_count: number
  bookmarks_count: number
  created_at?: string // 목록에도 존재(스웨거/핸들러)
  updated_at?: string | null // 목록에도 존재(스웨거/핸들러)
  status?: 'OPEN' | 'CLOSED' //  핸들러에서 추가, 실서버 없으면 프런트에서 계산
}

// seed -> 목록 아이템
function toListItem(seed: any): RecruitmentListItem {
  return {
    id: Number(seed.id),
    uuid: seed.uuid ?? String(seed.id),
    title: seed.title,
    img: 'https://picsum.photos/seed/oz-recruit/640/360',
    expected_headcount: Number(seed.expected_headcount ?? 5),
    tags: (seed.tags ?? []).map((t: any) => t.name ?? String(t)),
    close_at: seed.deadline ? new Date(seed.deadline).toISOString() : null,
    views_count: Number(seed.views_count ?? 0),
    bookmarks_count: Number(seed.bookmarks_count ?? 0),
    created_at: seed.created_at
      ? new Date(String(seed.created_at).replace(' ', 'T')).toISOString()
      : new Date().toISOString(),
    updated_at: seed.updated_at
      ? new Date(String(seed.updated_at).replace(' ', 'T')).toISOString()
      : new Date().toISOString(),
  }
}

function mapOrdering(ordering?: string | null): {
  key?: string
  desc?: boolean
} {
  if (!ordering || ordering === '' || ordering === 'undefined') {
    return { key: 'created_at', desc: true } // 기본: 최신순
  }
  const desc = ordering.startsWith('-')
  const key = desc ? ordering.slice(1) : ordering
  return { key, desc }
}

function listResponse(url: URL) {
  const page = toInt(url.searchParams.get('page'), 1)
  const size = toInt(url.searchParams.get('size'), 10)
  const q = (url.searchParams.get('search') || '').trim()
  const tag = (url.searchParams.get('tag') || '').trim()
  const ordering = url.searchParams.get('ordering')
  // ✅ 상태 필터(와이어프레임): 'ALL' | 'OPEN' | 'CLOSED'
  const status = (url.searchParams.get('status') || 'ALL').toUpperCase()
  // 백엔드 호환: is_closed=true/false 도 지원
  const isClosedParam = url.searchParams.get('is_closed')

  let rows = recruitmentSeeds.map(toListItem)

  // 검색/태그
  if (q) rows = rows.filter((r) => like(r.title, q))
  if (tag) rows = rows.filter((r) => r.tags.includes(tag))

  // 상태 필터
  const now = Date.now()
  if (status === 'OPEN' || status === 'CLOSED') {
    rows = rows.filter((r) => {
      const closed = r.close_at ? new Date(r.close_at).getTime() < now : false
      return status === 'OPEN' ? !closed : closed
    })
  }
  if (isClosedParam !== null) {
    const wantClosed = ['1', 'true', 'True'].includes(isClosedParam)
    rows = rows.filter((r) => {
      const closed = r.close_at ? new Date(r.close_at).getTime() < now : false
      return wantClosed ? closed : !closed
    })
  }

  // 정렬 (-views_count / -bookmarks_count / -created_at / created_at)
  const { key, desc } = mapOrdering(ordering)
  if (key) rows = sortByKey(rows, key, desc ? 'desc' : 'asc')

  // 페이지네이션
  const { items, total } = paginate(rows, page, size)
  const mkLink = (p: number) => {
    const base = url.origin + url.pathname
    const sp = new URLSearchParams()
    sp.set('page', String(p))
    sp.set('size', String(size))
    if (ordering) sp.set('ordering', ordering)
    if (q) sp.set('search', q)
    if (tag) sp.set('tag', tag)
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
  // 목록
  ...pair('get', '/recruitments', async ({ request }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(120)
    const url = new URL(request.url)
    const body = listResponse(url)
    console.log('[MSW] 구인공고 목록', Object.fromEntries(url.searchParams))
    return HttpResponse.json(body)
  }),

  // 태그 목록
  ...pair('get', '/recruitments/tags', async ({ request }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(60)
    const m = new Map<string, string>()
    recruitmentSeeds.forEach((r: any) => {
      ;(r.tags ?? []).forEach((t: any) => {
        const id = String(t.id ?? t.name)
        const name = t.name ?? String(t)
        m.set(id, name)
      })
    })
    const tags = Array.from(m.entries()).map(([id, name], i) => ({
      id: id || String(i + 1),
      name,
    }))
    return HttpResponse.json(tags)
  }),
]
