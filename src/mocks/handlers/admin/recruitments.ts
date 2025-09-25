/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { http as mswHttp, HttpResponse, delay, passthrough } from 'msw'
import { BASE_PATH, like, paginate, sortByKey, toInt } from '@/mocks/utils'
import recruitmentsHandlers from '@/mocks/seeds/recruitment.seed'

const V1 = `${BASE_PATH}/v1`
const LEGACY = `${BASE_PATH}`

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
  tags: string[] // 목록 응답은 문자열 배열 유지
  close_at: string | null
  views_count: number
  bookmarks_count: number
  created_at: string
  updated_at: string | null
  status: 'OPEN' | 'CLOSED'
}

const isClosed = (iso: string | null) =>
  iso ? new Date(iso).getTime() < Date.now() : false

const normalizeTagParam = (tag: string): { id: string; name: string } => {
  const hit = TAG_POOL.find((t) => t.id === tag || t.name === tag)
  if (hit) return hit
  // seeds에 name만 들어있고 param이 id로 들어올 수도 있으므로 양쪽 다 시도
  return { id: tag, name: tag }
}

// seed -> 목록 아이템
function toListItem(seed: any): ListItem {
  const closeAtISO = seed.close_at
    ? new Date(seed.close_at).toISOString()
    : seed.deadline
      ? new Date(seed.deadline).toISOString()
      : null

  const closed = isClosed(closeAtISO)

  return {
    id: Number(seed.id),
    uuid: seed.uuid ?? String(seed.id),
    title: seed.title,
    img: seed.img ?? 'https://picsum.photos/seed/oz-recruit/640/360',
    expected_headcount: Number(seed.expected_headcount ?? 5),
    // seed.tags가 문자열/객체 혼재 가능 → 문자열(name) 배열로 통일
    tags: (seed.tags ?? []).map((t: any) => t.name ?? String(t)),
    close_at: closeAtISO,
    views_count: Number(seed.views_count ?? 0),
    bookmarks_count: Number(seed.bookmarks_count ?? 0),
    created_at: seed.created_at
      ? new Date(String(seed.created_at).replace(' ', 'T')).toISOString()
      : new Date().toISOString(),
    updated_at: seed.updated_at
      ? new Date(String(seed.updated_at).replace(' ', 'T')).toISOString()
      : null,
    status: closed ? 'CLOSED' : 'OPEN',
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

function listResponse(url: URL, opts?: { excludeClosed?: boolean }) {
  const page = toInt(url.searchParams.get('page'), 1)
  const size = toInt(url.searchParams.get('size'), 10)
  const q = (url.searchParams.get('search') || '').trim()
  const tagParam = (url.searchParams.get('tag') || '').trim()
  const ordering = url.searchParams.get('ordering')
  const status = (url.searchParams.get('status') || 'ALL').toUpperCase()
  const isClosedParam = url.searchParams.get('is_closed')

  let rows = recruitmentsHandlers.map(toListItem)

  // 공개 목록은 기본적으로 마감된 공고 제외 (스펙)
  if (opts?.excludeClosed) {
    rows = rows.filter((r) => r.status === 'OPEN')
  }

  if (q) rows = rows.filter((r) => like(r.title, q))

  if (tagParam) {
    const { id, name } = normalizeTagParam(tagParam)
    rows = rows.filter(
      (r) => r.tags.includes(name) || r.tags.includes(id) // id/name 모두 허용
    )
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

  // 태그 목록: 고정 태그 풀 반환
  ...pair('get', '/recruitments/tags', async ({ request }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(60)
    // id/name 보장 + 정렬(가독)
    const tags = TAG_POOL.map((t) => ({ id: t.id, name: t.name })).sort(
      (a, b) => a.name.localeCompare(b.name)
    )
    return HttpResponse.json(tags)
  }),
]

// ⛔️ 여기(핸들러 파일)에 axios/fetch 호출 함수 넣지 말 것
