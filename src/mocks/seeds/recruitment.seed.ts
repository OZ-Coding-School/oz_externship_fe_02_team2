/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { http as mswHttp, HttpResponse, delay, passthrough } from 'msw'
import { BASE_PATH, like, paginate, sortByKey, toInt } from '../utils'

// OpenAPI 기준 v1 베이스
const V1 = `${BASE_PATH}/v1`

/** =========================
 * Seed & In-Memory DB
 * ======================= */

// 태그 풀 (요청한 목록 그대로)
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

// 리스트 스펙(RecruitmentList)에 맞춘 로우 타입
type LectureLite = { title: string; instructor: string }
export type RecruitmentRow = {
  id: number
  uuid: string
  title: string
  img: string | null
  expected_headcount: number
  lectures: LectureLite[]
  tags: string[] // ← 목록 스펙: 문자열 배열
  close_at: string | null // ISO (null 허용)
  views_count: number
  bookmarks_count: number
  created_at: string
  updated_at: string
}

// 간단 유틸
const now = () => new Date()
const addDays = (d: number) => {
  const t = now()
  t.setDate(t.getDate() + d)
  return t.toISOString()
}
const uuid = (n: number) => `#${n}${n}${n}${n}`

// 더미 강의
const L: LectureLite[] = [
  { title: '리액트 마스터', instructor: '김교수' },
  { title: 'Django Web', instructor: '박교수' },
  { title: 'TypeScript 심화', instructor: 'Choi' },
]

// 시드 데이터 (OPEN/CLOSED 혼합; 공개 목록은 CLOSED 자동 제외)
const recruitmentSeeds: RecruitmentRow[] = [
  {
    id: 1,
    uuid: uuid(1),
    title: '주 2회 React 사이드 프로젝트',
    img: 'https://picsum.photos/seed/rc1/640/360',
    expected_headcount: 5,
    lectures: [L[0]],
    tags: ['react', 'ts', 'frontend'],
    close_at: addDays(14), // OPEN
    views_count: 1420,
    bookmarks_count: 120,
    created_at: addDays(-20),
    updated_at: addDays(-2),
  },
  {
    id: 2,
    uuid: uuid(2),
    title: '알고리즘 & 자료구조 스터디',
    img: 'https://picsum.photos/seed/rc2/640/360',
    expected_headcount: 8,
    lectures: [],
    tags: ['js', 'ai', 'ml'],
    close_at: addDays(-2), // CLOSED
    views_count: 3120,
    bookmarks_count: 260,
    created_at: addDays(-40),
    updated_at: addDays(-3),
  },
  {
    id: 3,
    uuid: uuid(3),
    title: 'Django 백엔드 실무 스터디',
    img: 'https://picsum.photos/seed/rc3/640/360',
    expected_headcount: 6,
    lectures: [L[1]],
    tags: ['python', 'django', 'backend'],
    close_at: addDays(7), // OPEN
    views_count: 980,
    bookmarks_count: 55,
    created_at: addDays(-8),
    updated_at: addDays(-1),
  },
  {
    id: 4,
    uuid: uuid(4),
    title: 'NextJS 풀스택 토이 프로젝트',
    img: 'https://picsum.photos/seed/rc4/640/360',
    expected_headcount: 4,
    lectures: [L[0], L[2]],
    tags: ['nextjs', 'fullstack', 'ts'],
    close_at: addDays(1), // OPEN 임박
    views_count: 510,
    bookmarks_count: 47,
    created_at: addDays(-5),
    updated_at: addDays(-1),
  },
  {
    id: 5,
    uuid: uuid(5),
    title: 'Spring Boot로 REST API 만들기',
    img: 'https://picsum.photos/seed/rc5/640/360',
    expected_headcount: 5,
    lectures: [],
    tags: ['spring', 'java', 'backend'],
    close_at: addDays(30), // OPEN
    views_count: 220,
    bookmarks_count: 19,
    created_at: addDays(-3),
    updated_at: addDays(-1),
  },
  {
    id: 6,
    uuid: uuid(6),
    title: 'DevOps with Docker & K8s',
    img: 'https://picsum.photos/seed/rc6/640/360',
    expected_headcount: 7,
    lectures: [],
    tags: ['docker', 'kubernetes', 'devops', 'aws'],
    close_at: addDays(-1), // CLOSED
    views_count: 1880,
    bookmarks_count: 210,
    created_at: addDays(-25),
    updated_at: addDays(-10),
  },
]

// 간단 in-memory DB
const recruitmentsDb = {
  rows: [] as RecruitmentRow[],
  init() {
    if (this.rows.length) return
    this.rows = recruitmentSeeds.map((r) => ({ ...r }))
  },
  add(row: RecruitmentRow) {
    this.rows.unshift(row)
  },
  findByUuid(uuid: string) {
    return this.rows.find((r) => r.uuid === uuid)
  },
  patch(uuid: string, patch: Partial<RecruitmentRow>) {
    const idx = this.rows.findIndex((r) => r.uuid === uuid)
    if (idx === -1) return null
    this.rows[idx] = {
      ...this.rows[idx],
      ...patch,
      updated_at: new Date().toISOString(),
    }
    return this.rows[idx]
  },
  remove(uuid: string) {
    const idx = this.rows.findIndex((r) => r.uuid === uuid)
    if (idx === -1) return false
    this.rows.splice(idx, 1)
    return true
  },
}

// MSW 시작 시 DB 초기화
recruitmentsDb.init()

/** =========================
 * Helpers
 * ======================= */
function isClosed(row: RecruitmentRow): boolean {
  return row.close_at ? new Date(row.close_at).getTime() < Date.now() : false
}

function mapOrdering(ordering?: string | null): {
  key?: keyof RecruitmentRow
  desc?: boolean
} {
  if (!ordering || ordering === '' || ordering === 'undefined')
    return { key: 'created_at', desc: true }
  const desc = ordering.startsWith('-')
  const raw = desc ? ordering.slice(1) : ordering
  const key = (
    ['views_count', 'bookmarks_count', 'created_at'] as (keyof RecruitmentRow)[]
  ).includes(raw as any)
    ? (raw as keyof RecruitmentRow)
    : 'created_at'
  return { key, desc }
}

function listResponse(url: URL, rows: RecruitmentRow[]) {
  const page = toInt(url.searchParams.get('page'), 1)
  const size = toInt(url.searchParams.get('size'), 10)
  const ordering = url.searchParams.get('ordering')
  const q = (url.searchParams.get('search') || '').trim()
  const tag = (url.searchParams.get('tag') || '').trim()

  let data = [...rows]

  // 검색(제목)
  if (q) data = data.filter((r) => like(r.title, q))
  // 태그 필터(name 또는 id 둘 다 허용)
  if (tag) {
    const tagName = TAG_POOL.find((t) => t.id === tag)?.name ?? tag
    data = data.filter((r) => r.tags.includes(tag) || r.tags.includes(tagName))
  }

  // 정렬
  const { key, desc } = mapOrdering(ordering)
  if (key)
    data = sortByKey(
      data as any[],
      key as string,
      desc ? 'desc' : 'asc'
    ) as RecruitmentRow[]

  // 페이지네이션 (OpenAPI: count/next/previous/results)
  const { items, total } = paginate<RecruitmentRow>(data, page, size)
  const mkLink = (p: number) => {
    const base = url.origin + url.pathname
    const sp = new URLSearchParams()
    sp.set('page', String(p))
    sp.set('size', String(size))
    if (ordering) sp.set('ordering', ordering)
    if (q) sp.set('search', q)
    if (tag) sp.set('tag', tag)
    return `${base}?${sp.toString()}`
  }

  return {
    count: total,
    next: page * size < total ? mkLink(page + 1) : null,
    previous: page > 1 ? mkLink(page - 1) : null,
    results: items,
  }
}

/** =========================
 * Handlers
 * ======================= */
export const recruitmentsHandlers = [
  // GET /api/v1/recruitments  (공개 목록) — CLOSED는 노출하지 않음
  mswHttp.get(`${V1}/recruitments`, async ({ request }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(120)

    const url = new URL(request.url)

    // 공개 목록: CLOSED 제외
    const openOnly = recruitmentsDb.rows.filter((r) => !isClosed(r))

    const body = listResponse(url, openOnly)
    console.log('[MSW] 구인공고 목록', Object.fromEntries(url.searchParams))
    return HttpResponse.json(body)
  }),

  // GET /api/v1/recruitments/me — is_closed=true/false 필터 지원
  mswHttp.get(`${V1}/recruitments/me`, async ({ request }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(120)

    const url = new URL(request.url)
    const isClosedParam = url.searchParams.get('is_closed')

    let rows = [...recruitmentsDb.rows]
    if (isClosedParam !== null) {
      const wantClosed = ['1', 'true', 'True'].includes(isClosedParam)
      rows = rows.filter((r) => (wantClosed ? isClosed(r) : !isClosed(r)))
    }

    const body = listResponse(url, rows)
    console.log('[MSW] 내 구인공고 목록', Object.fromEntries(url.searchParams))
    return HttpResponse.json(body)
  }),

  // GET /api/v1/recruitments/:uuid  (상세)
  mswHttp.get(`${V1}/recruitments/:uuid`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(90)

    const row = recruitmentsDb.findByUuid(params.uuid as string)
    if (!row) return HttpResponse.json({ errors: 'Not Found' }, { status: 404 })

    // 간단 상세(스펙의 RecruitmentDetail에 맞추려면 여기서 변환/보강)
    const detail = {
      id: row.id,
      uuid: row.uuid,
      author: { id: 1, nickname: 'admin' }, // 더미
      title: row.title,
      content: '상세 내용 더미입니다.',
      expected_headcount: row.expected_headcount,
      estimated_fee: 0,
      study_lectures: row.lectures.map((l) => ({
        title: l.title,
        url_link: 'https://example.com',
        instructor: l.instructor,
        thumbnail_img_url: null,
      })),
      tags: row.tags.map((t) => {
        const match = TAG_POOL.find((x) => x.id === t || x.name === t)
        return {
          id: match ? match.id : t,
          name: match ? match.name : String(t),
        }
      }),
      attachments: [],
      created_at: row.created_at,
      updated_at: row.updated_at,
      close_at: row.close_at,
      is_closed: isClosed(row),
      views_count: row.views_count,
      bookmark_count: row.bookmarks_count, // 상세는 단수명일 수 있어 매핑
    }

    return HttpResponse.json(detail)
  }),

  // PATCH /api/v1/recruitments/:uuid  (일부 수정)
  mswHttp.patch(`${V1}/recruitments/:uuid`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(120)

    try {
      const body = (await request.json()) as Partial<RecruitmentRow>
      const updated = recruitmentsDb.patch(params.uuid as string, body)
      if (!updated)
        return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
      console.log('[MSW] 구인공고 수정 완료:', updated.uuid)
      return HttpResponse.json(updated)
    } catch (e) {
      return HttpResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      )
    }
  }),

  // DELETE /api/v1/recruitments/:uuid  (삭제)
  mswHttp.delete(`${V1}/recruitments/:uuid`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(100)

    const ok = recruitmentsDb.remove(params.uuid as string)
    if (!ok) return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    console.log('[MSW] 구인공고 삭제:', params.uuid)
    return new HttpResponse(null, { status: 204 })
  }),

  // POST /api/v1/recruitments  (신규 생성) — 필요 시 사용
  mswHttp.post(`${V1}/recruitments`, async ({ request }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(150)

    try {
      const body = (await request.json()) as Partial<RecruitmentRow>
      if (!body.title) {
        return HttpResponse.json(
          { message: 'title is required' },
          { status: 400 }
        )
      }
      const nextId = Math.max(0, ...recruitmentsDb.rows.map((r) => r.id)) + 1
      const row: RecruitmentRow = {
        id: nextId,
        uuid: uuid(nextId),
        title: body.title,
        img: body.img ?? null,
        expected_headcount: body.expected_headcount ?? 5,
        lectures: (body.lectures ?? []).slice(0, 3) as LectureLite[],
        tags: (body.tags ?? []).map(String),
        close_at: body.close_at ?? addDays(14),
        views_count: body.views_count ?? 0,
        bookmarks_count: body.bookmarks_count ?? 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      recruitmentsDb.add(row)
      console.log('[MSW] 구인공고 생성:', row.title)
      return HttpResponse.json(row, { status: 201 })
    } catch (e) {
      return HttpResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      )
    }
  }),

  // GET /api/v1/recruitments/tags
  mswHttp.get(`${V1}/recruitments/tags`, async ({ request }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(60)

    // DB에 없는 태그까지 포함해서 반환 (정규 풀)
    const used = new Set<string>()
    recruitmentsDb.rows.forEach((r) => r.tags.forEach((t) => used.add(t)))
    const normalized = Array.from(used).map((t, i) => {
      const match = TAG_POOL.find((x) => x.id === t || x.name === t)
      return {
        id: String(match?.id ?? t ?? i + 1),
        name: String(match?.name ?? t),
      }
    })

    // 풀 + 사용중 태그를 합쳐 중복 제거
    const m = new Map<string, string>()
    TAG_POOL.forEach((t) => m.set(String(t.id), t.name))
    normalized.forEach((t) => m.set(String(t.id), t.name))

    const tags = Array.from(m.entries()).map(([id, name]) => ({ id, name }))
    return HttpResponse.json(tags)
  }),
]

export default recruitmentsHandlers
