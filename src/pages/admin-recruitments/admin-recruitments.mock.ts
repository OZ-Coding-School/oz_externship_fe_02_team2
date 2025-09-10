import type {
  RecruitmentDetail,
  RecruitmentItem,
  RecruitmentListQuery,
  RecruitmentListRes,
  RecruitmentStatus,
  SortKey,
  Tag,
} from './admin-recruitments.types'

/* === 샘플 태그 === */
const TECHNOLOGIES = [
  'React',
  'Vue.js',
  'Angular',
  'JavaScript',
  'TypeScript',
  'Spring Boot',
  'Node.js',
  'Express',
  'NextJs',
  'Java',
  'Python',
  'Django',
  'FastAPI',
  'Flask',
  'PHP',
  'Docker',
  'Kubernetes',
  'AWS',
  'GCP',
  'Frontend',
  'Backend',
  'Full Stack',
  'DevOps',
] as const

const TAGS: Tag[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `t${i + 1}`,
  name:
    TECHNOLOGIES[i % TECHNOLOGIES.length] +
    (i >= TECHNOLOGIES.length ? String(i) : ''),
}))

/* === 날짜 유틸 === */
const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n))
const fmtDate = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
const fmtDateTime = (d: Date) =>
  `${fmtDate(d)} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`

/* === 상태 → 한글 라벨 === */
export const statusToKo = (
  s: RecruitmentStatus
): '대기중' | '모집중' | '종료됨' =>
  s === 'OPEN' ? '모집중' : s === 'PENDING' ? '대기중' : '종료됨'

/* === 더미 데이터 생성 === */
function makeDetail(i: number): RecruitmentDetail {
  const createdAt = new Date(Date.now() - i * 86_400_000)
  const updatedAt = new Date(createdAt.getTime() + (i % 7) * 3_600_000)

  // 상태 분포: 0=CLOSED, 1=OPEN, 2=PENDING
  const mod = i % 3
  const status: RecruitmentStatus =
    mod === 0 ? 'CLOSED' : mod === 1 ? 'OPEN' : 'PENDING'

  // 상태별 마감일: OPEN/PENDING은 미래, CLOSED는 과거 (가끔 null)
  const base = (i % 20) + 1
  const deadlineDate =
    status === 'CLOSED'
      ? new Date(Date.now() - base * 86_400_000)
      : new Date(Date.now() + base * 86_400_000)

  const tagCount = (i % 5) + 1
  const tags = Array.from({ length: tagCount }).map(
    (_, k) => TAGS[(i + k) % TAGS.length]
  )

  return {
    id: String(i + 1),
    title: `스터디 구인 ${i + 1}`,
    tags,
    deadline: i % 6 === 0 ? null : fmtDate(deadlineDate),
    status,
    views_count: 120 + (((i + 3) * 37) % 900),
    bookmarks_count: 5 + (((i + 7) * 13) % 120),
    created_at: fmtDateTime(createdAt),
    updated_at: fmtDateTime(updatedAt),
    content: `스터디 ${i + 1} 상세 본문입니다.\n주 ${1 + (i % 3)}회 모임, 온/오프 병행.`,
    author: { user_id: `u${i + 1}`, nickname: `작성자${i + 1}` },
  }
}

const ALL: RecruitmentDetail[] = Array.from({ length: 137 }).map((_, i) =>
  makeDetail(i)
)

/* === 정렬 === */
function sortRows(
  rows: RecruitmentDetail[],
  key: SortKey
): RecruitmentDetail[] {
  const byCreated = (a: RecruitmentDetail, b: RecruitmentDetail) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()

  switch (key) {
    case 'created_asc':
      return rows.slice().sort(byCreated)
    case 'created_desc':
      return rows.slice().sort((a, b) => -byCreated(a, b))
    case 'views_desc':
      return rows.slice().sort((a, b) => b.views_count - a.views_count)
    case 'bookmarks_desc':
      return rows.slice().sort((a, b) => b.bookmarks_count - a.bookmarks_count)
    default:
      return rows
  }
}

/* === 목록 조회(필터·정렬·페이징) === */
export async function listRecruitments(
  query: RecruitmentListQuery = {}
): Promise<RecruitmentListRes> {
  const {
    q = '',
    status = 'ALL',
    tags = [],
    sort = 'created_desc',
    page = 1,
    size = 10,
  } = query

  let rows = ALL

  // 검색(제목)
  if (q.trim()) {
    const qq = q.toLowerCase()
    rows = rows.filter((r) => r.title.toLowerCase().includes(qq))
  }

  // 상태 필터
  if (status !== 'ALL') {
    rows = rows.filter((r) => r.status === status)
  }

  // 태그 ID AND 필터
  if (tags.length) {
    rows = rows.filter((r) =>
      tags.every((tid) => r.tags.some((t) => t.id === tid))
    )
  }

  // 정렬
  rows = sortRows(rows, sort)

  // 페이징 + 아이템 축약
  const total = rows.length
  const start = Math.max(0, (Math.max(1, page) - 1) * Math.max(1, size))
  const items: RecruitmentItem[] = rows.slice(start, start + size).map((d) => ({
    id: d.id,
    title: d.title,
    tags: d.tags,
    deadline: d.deadline,
    status: d.status,
    views_count: d.views_count,
    bookmarks_count: d.bookmarks_count,
    created_at: d.created_at,
    updated_at: d.updated_at,
  }))

  // 네트워크 지연 흉내(Optional)
  await new Promise((r) => setTimeout(r, 120))
  return { total, page, size, items }
}

/* === 상세 조회 === */
export async function getRecruitmentDetail(
  id: string
): Promise<RecruitmentDetail | null> {
  const found = ALL.find((r) => r.id === String(id)) ?? null
  await new Promise((r) => setTimeout(r, 80))
  return found
}
