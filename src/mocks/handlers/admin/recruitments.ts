import { http as mswHttp, HttpResponse, delay, passthrough } from 'msw'
import { like, paginate, toInt } from '../../utils'
import { recruitmentSeeds } from '@/mocks/seeds/recruitment.seed'

// ---------------------------------------------------------------------------
// 설정/유틸
// ---------------------------------------------------------------------------
const API = '*/api/v1' // 오리진/베이스경로 무시하고 매칭
const BYPASS_HEADER = 'x-bypass-mock'

type SeedItem = (typeof recruitmentSeeds)[number]

type ListItem = {
  id: number
  uuid: string
  title: string
  img: string
  expected_headcount: number
  lectures: { title: string; instructor: string }[]
  tags: string[]
  close_at: string // ISO
  views_count: number
  bookmarks_count: number
}

type DetailItem = {
  id: number
  uuid: string
  author: { id: number; nickname: string }
  title: string
  content: string
  expected_headcount: number
  estimated_fee: number
  study_lectures: {
    title: string
    url_link: string
    instructor: string
    thumbnail_img_url: string | null
  }[]
  tags: { id: number; name: string }
  attachments: { id: number; file_name: string; file_url: string }[]
  created_at: string
  updated_at: string | null
  close_at: string
  is_closed: boolean
  views_count: number
  bookmark_count: number
}

// 메모리 DB
const db = {
  items: [] as DetailItem[],
  init() {
    if (this.items.length) return
    this.items = recruitmentSeeds.map(seedToDetail)
  },
  findByUUID(uuid: string) {
    return this.items.find((i) => i.uuid === uuid) ?? null
  },
  removeByUUID(uuid: string) {
    const idx = this.items.findIndex((i) => i.uuid === uuid)
    if (idx < 0) return false
    this.items.splice(idx, 1)
    return true
  },
}

function seedToDetail(s: SeedItem): DetailItem {
  const idNum = Number(s.id) || Math.floor(Math.random() * 100000) + 1
  const uuid = toUUIDfromId(idNum)
  const createdISO = toISODateTime(s.created_at)
  const updatedISO = toISODateTime(s.updated_at)
  const closeISO = s.deadline
    ? toISODateTime(s.deadline + ' 23:59')
    : addDaysISO(createdISO, 14)
  const authorId = (idNum % 7) + 1
  const tagNames = s.tags.map((t) => t.name)
  return {
    id: idNum,
    uuid,
    author: { id: authorId, nickname: `user${authorId}` },
    title: s.title,
    content:
      '이 공고는 MSW 목 데이터입니다. 실제 서버 스펙(OpenAPI)에 맞춘 필드만 포함하며, 에디터/이미지/첨부는 샘플로 구성되어 있습니다.',
    expected_headcount: clamp(ri(3, 7), 1, 10),
    estimated_fee: ri(0, 500000),
    study_lectures: [
      {
        title: '리액트 핵심',
        url_link: 'https://example.org/lecture/react',
        instructor: '강사A',
        thumbnail_img_url: null,
      },
      {
        title: '타입스크립트 실전',
        url_link: 'https://example.org/lecture/ts',
        instructor: '강사B',
        thumbnail_img_url: null,
      },
    ],
    tags: { id: idNum, name: tagNames[0] ?? '기타' },
    attachments: ri(0, 1)
      ? [
          {
            id: 1,
            file_name: 'plan.pdf',
            file_url: 'https://files.example.org/plan.pdf',
          },
        ]
      : [],
    created_at: createdISO,
    updated_at: updatedISO,
    close_at: closeISO,
    is_closed: s.status === 'CLOSED',
    views_count: s.views_count,
    bookmark_count: s.bookmarks_count,
  }
}

function detailToList(i: DetailItem): ListItem {
  return {
    id: i.id,
    uuid: i.uuid,
    title: i.title,
    img: `https://picsum.photos/seed/${i.uuid}/640/360`,
    expected_headcount: i.expected_headcount,
    lectures: i.study_lectures.map((l) => ({
      title: l.title,
      instructor: l.instructor,
    })),
    tags: [i.tags.name],
    close_at: i.close_at,
    views_count: i.views_count,
    bookmarks_count: i.bookmark_count,
  }
}

function toUUIDfromId(id: number) {
  const s = String(id).padStart(12, '0')
  return `00000000-0000-0000-0000-${s}`
}

function toISODateTime(s: string | null | undefined) {
  if (!s) return new Date().toISOString()
  // 'YYYY-MM-DD hh:mm' → ISO
  if (/^\d{4}-\d{2}-\d{2}( |T)\d{2}:\d{2}$/.test(s)) {
    return s.replace(' ', 'T') + ':00Z'
  }
  // 'YYYY-MM-DD' → ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return `${s}T00:00:00Z`
  }
  // 이미 ISO거나 기타 → Date 파싱
  const t = new Date(s)
  return isNaN(t.getTime()) ? new Date().toISOString() : t.toISOString()
}

function addDaysISO(iso: string, days: number) {
  const d = new Date(iso)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString()
}

function ri(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function applyOrdering(
  list: DetailItem[],
  ordering?: string | null
): DetailItem[] {
  const key = ordering || '-created_at' // 기본 최신순
  const desc = key.startsWith('-')
  const field = desc ? key.slice(1) : key

  const getVal = (it: DetailItem) => {
    switch (field) {
      case 'views_count':
        return it.views_count
      case 'bookmarks_count':
        return it.bookmark_count
      case 'created_at':
        return it.created_at
      default:
        return it.created_at
    }
  }

  return [...list].sort((a, b) => {
    const va = getVal(a)
    const vb = getVal(b)
    // 날짜/문자 비교는 문자열 비교로도 충분(ISO 보장)
    if (va < vb) return desc ? 1 : -1
    if (va > vb) return desc ? -1 : 1
    return 0
  })
}

// ---------------------------------------------------------------------------
// 핸들러
// ---------------------------------------------------------------------------
db.init()

export const recruitmentHandlers = [
  // 목록: GET /api/v1/recruitments
  mswHttp.get(`${API}/recruitments`, async ({ request }) => {
    if (request.headers.get(BYPASS_HEADER)) return passthrough()

    await delay(120 + Math.random() * 120)

    const url = new URL(request.url)
    const page = toInt(url.searchParams.get('page'), 1)
    const size = toInt(url.searchParams.get('size'), 10)
    const search = (url.searchParams.get('search') || '').trim().toLowerCase()
    const tag = (url.searchParams.get('tag') || '').trim().toLowerCase()
    const ordering = url.searchParams.get('ordering') // '-views_count' | '-bookmarks_count' | '-created_at' ...

    // 기본 정책: 마감된 공고는 목록에 노출하지 않음
    let rows = db.items.filter((it) => !it.is_closed)

    if (search) {
      rows = rows.filter((r) => like(r.title, search))
    }
    if (tag) {
      rows = rows.filter(
        (r) =>
          r.tags.name.toLowerCase() === tag ||
          r.tags.name.toLowerCase().includes(tag)
      )
    }

    rows = applyOrdering(rows, ordering)

    const pageData = paginate<ListItem>(rows.map(detailToList), page, size)

    const body = {
      count: rows.length,
      next: null,
      previous: null,
      results: pageData.items,
    }

    console.log(`[MSW] Recruitments list: ${rows.length} rows / page ${page}`)
    return HttpResponse.json(body)
  }),

  // 상세: GET /api/v1/recruitments/{uuid}
  mswHttp.get(
    `${API}/recruitments/:recruitment_uuid`,
    async ({ request, params }) => {
      if (request.headers.get(BYPASS_HEADER)) return passthrough()
      await delay(80 + Math.random() * 80)

      const item = db.findByUUID(String(params.recruitment_uuid))
      if (!item) {
        return HttpResponse.json({ errors: 'Not Found' }, { status: 404 })
      }
      return HttpResponse.json(item)
    }
  ),

  // 수정(PATCH): /api/v1/recruitments/{uuid}
  mswHttp.patch(
    `${API}/recruitments/:recruitment_uuid`,
    async ({ request, params }) => {
      if (request.headers.get(BYPASS_HEADER)) return passthrough()
      await delay(120)

      const idx = db.items.findIndex(
        (i) => i.uuid === String(params.recruitment_uuid)
      )
      if (idx < 0)
        return HttpResponse.json({ errors: 'Not Found' }, { status: 404 })

      try {
        const patch = await request.json()
        const next = { ...db.items[idx], ...normalizePatch(patch) }
        db.items[idx] = next
        return HttpResponse.json(next)
      } catch {
        return HttpResponse.json(
          { message: 'Invalid request data' },
          { status: 400 }
        )
      }
    }
  ),

  // 삭제(DELETE): /api/v1/recruitments/{uuid}
  mswHttp.delete(
    `${API}/recruitments/:recruitment_uuid`,
    async ({ request, params }) => {
      if (request.headers.get(BYPASS_HEADER)) return passthrough()
      await delay(100)

      const ok = db.removeByUUID(String(params.recruitment_uuid))
      if (!ok)
        return HttpResponse.json({ errors: 'Not Found' }, { status: 404 })
      return new HttpResponse(null, { status: 204 })
    }
  ),

  // 내가 올린 목록: GET /api/v1/recruitments/me
  mswHttp.get(`${API}/recruitments/me`, async ({ request }) => {
    if (request.headers.get(BYPASS_HEADER)) return passthrough()
    await delay(120)

    const url = new URL(request.url)
    const page = toInt(url.searchParams.get('page'), 1)
    const size = toInt(url.searchParams.get('size'), 10)
    const ordering = url.searchParams.get('ordering')
    const isClosedParam = url.searchParams.get('is_closed') // 'true' | 'false' | null

    // 샘플: author.id === 1 인 공고를 "내 공고"로 가정
    let rows = db.items.filter((i) => i.author.id === 1)

    if (isClosedParam != null) {
      const flag = String(isClosedParam) === 'true'
      rows = rows.filter((i) => i.is_closed === flag)
    }

    rows = applyOrdering(rows, ordering)
    const pageData = paginate<ListItem>(rows.map(detailToList), page, size)

    const body = {
      count: rows.length,
      next: null,
      previous: null,
      results: pageData.items,
    }
    return HttpResponse.json(body)
  }),

  // 태그 목록: GET /api/v1/recruitments/tags
  mswHttp.get(`${API}/recruitments/tags`, async ({ request }) => {
    if (request.headers.get(BYPASS_HEADER)) return passthrough()
    await delay(60)

    // seeds에서 유니크 태그 추출
    const tagNames = Array.from(new Set(db.items.map((i) => i.tags.name)))
    const list = tagNames.map((name, i) => ({ id: i + 1, name }))
    return HttpResponse.json(list)
  }),

  // 태그 생성: POST /api/v1/recruitments/tags
  mswHttp.post(`${API}/recruitments/tags`, async ({ request }) => {
    if (request.headers.get(BYPASS_HEADER)) return passthrough()
    await delay(80)

    let name = ''

    // 1) JSON 바디 시도
    try {
      const json = await request.json().catch(() => null)
      if (
        json &&
        typeof json === 'object' &&
        'name' in (json as Record<string, unknown>)
      ) {
        const v = (json as Record<string, unknown>)['name']
        if (typeof v === 'string') name = v
      }
    } catch {
      /* noop */
    }

    // 2) x-www-form-urlencoded 대응
    if (
      !name &&
      request.headers
        .get('content-type')
        ?.includes('application/x-www-form-urlencoded')
    ) {
      const text = await request.text()
      const params = new URLSearchParams(text)
      name = params.get('name') ?? ''
    }

    // 3) multipart/form-data 대응
    if (
      !name &&
      request.headers.get('content-type')?.includes('multipart/form-data')
    ) {
      const form = await request.formData()
      const v = form.get('name')
      if (typeof v === 'string') name = v
    }

    name = name.trim()
    if (!name)
      return HttpResponse.json({ message: 'name is required' }, { status: 400 })

    const newTag = { id: db.items.length + 1000, name }
    return HttpResponse.json(newTag)
  }),

  // 이미지 업로드(프리서인드 흉내): POST /api/v1/recruitments/images
  mswHttp.post(`${API}/recruitments/images`, async ({ request }) => {
    if (request.headers.get(BYPASS_HEADER)) return passthrough()
    await delay(120)
    const image_url = `https://images.example.org/${Date.now()}.jpg`
    return HttpResponse.json({ image_url })
  }),

  // 첨부 업로드(프리서인드 흉내): POST /api/v1/recruitments/attachments
  mswHttp.post(`${API}/recruitments/attachments`, async ({ request }) => {
    if (request.headers.get(BYPASS_HEADER)) return passthrough()
    await delay(120)
    const file_url = `https://files.example.org/${Date.now()}-file.bin`
    return HttpResponse.json({ file_url })
  }),

  // 지원자 목록/생성 (간단 스텁): /api/v1/recruitments/{uuid}/applications
  mswHttp.get(
    `${API}/recruitments/:recruitment_uuid/applications`,
    async ({ request, params }) => {
      if (request.headers.get(BYPASS_HEADER)) return passthrough()
      await delay(100)
      // 프론트에서 스키마 정의 전까지 최소 응답
      return HttpResponse.json({
        results: [],
        recruitment_uuid: params.recruitment_uuid,
      })
    }
  ),
  mswHttp.post(
    `${API}/recruitments/:recruitment_uuid/applications`,
    async ({ request, params }) => {
      if (request.headers.get(BYPASS_HEADER)) return passthrough()
      await delay(120)
      return HttpResponse.json({
        ok: true,
        recruitment_uuid: params.recruitment_uuid,
      })
    }
  ),
]

// PATCH 들어온 필드 정규화(간단)
function normalizePatch(patch: any) {
  const out: Partial<DetailItem> = {}
  if (typeof patch?.title === 'string') out.title = patch.title
  if (typeof patch?.content === 'string') out.content = patch.content
  if (typeof patch?.estimated_fee === 'number')
    out.estimated_fee = patch.estimated_fee
  if (typeof patch?.expected_headcount === 'number')
    out.expected_headcount = clamp(patch.expected_headcount, 1, 10)
  if (typeof patch?.is_closed === 'boolean') out.is_closed = patch.is_closed
  if (typeof patch?.close_at === 'string')
    out.close_at = toISODateTime(patch.close_at)
  if (Array.isArray(patch?.tags) && patch.tags.length > 0) {
    const first = patch.tags[0]
    const name =
      typeof first === 'string'
        ? first
        : first && typeof first === 'object' && 'name' in first
          ? (first as Record<string, unknown>)['name']
          : undefined
    if (typeof name === 'string' && name.trim()) {
      out.tags = { id: Math.floor(Math.random() * 10000), name: name.trim() }
    }
  }
  out.updated_at = new Date().toISOString()
  return out
}
