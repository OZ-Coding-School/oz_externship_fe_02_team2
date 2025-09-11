import type {
  RecruitmentDetail,
  RecruitmentItem,
  RecruitmentListQuery,
  RecruitmentListRes,
  RecruitmentStatus,
  SortKey,
  Tag,
} from './AdminRecruitments.types'

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

export const SAMPLE_TAGS: Tag[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `t${i + 1}`,
  name:
    TECHNOLOGIES[i % TECHNOLOGIES.length] +
    (i >= TECHNOLOGIES.length ? String(i) : ''),
}))

export async function listTags(queryText = ''): Promise<Tag[]> {
  const normalizedQuery = queryText.trim().toLowerCase()
  const filteredTags = normalizedQuery
    ? SAMPLE_TAGS.filter((tag) =>
        tag.name.toLowerCase().includes(normalizedQuery)
      )
    : SAMPLE_TAGS
  await new Promise((resolve) => setTimeout(resolve, 60))
  return filteredTags
}

/* === 날짜 유틸 === */
const padTwoDigits = (value: number) =>
  value < 10 ? `0${value}` : String(value)
const formatDate = (date: Date) =>
  `${date.getFullYear()}-${padTwoDigits(date.getMonth() + 1)}-${padTwoDigits(date.getDate())}`
const formatDateTime = (date: Date) =>
  `${formatDate(date)} ${padTwoDigits(date.getHours())}:${padTwoDigits(date.getMinutes())}`

const ONE_DAY_MS = 86_400_000
const ONE_HOUR_MS = 3_600_000
const NETWORK_DELAY_MS = 120

/* === 상태 → 한글 라벨 === */
export const statusToKo = (s: RecruitmentStatus): '모집중' | '마감' =>
  s === 'OPEN' ? '모집중' : '마감'

/* === 더미 데이터 생성 === */
const STATUS_DISTRIBUTION_CYCLE = 3
const MAX_TAGS_PER_ITEM = 5
const VIEW_COUNT_BASE = 120

function makeDetail(i: number): RecruitmentDetail {
  const createdAt = new Date(Date.now() - i * ONE_DAY_MS)
  const updatedAt = new Date(createdAt.getTime() + (i % 7) * ONE_HOUR_MS)

  // 상태 분포: 0=CLOSED, 1=OPEN,
  const statusSelector = i % STATUS_DISTRIBUTION_CYCLE
  const status: RecruitmentStatus = statusSelector === 0 ? 'CLOSED' : 'OPEN'

  // 상태별 마감일: OPEN은 미래, CLOSED는 과거 (가끔 null)
  const dayOffset = (i % 20) + 1
  const deadlineDate =
    status === 'CLOSED'
      ? new Date(Date.now() - dayOffset * ONE_DAY_MS)
      : new Date(Date.now() + dayOffset * ONE_DAY_MS)

  const tagCount = (i % MAX_TAGS_PER_ITEM) + 1
  const tags = Array.from({ length: tagCount }).map(
    (_, tagOffset) => SAMPLE_TAGS[(i + tagOffset) % SAMPLE_TAGS.length]
  )

  return {
    id: String(i + 1),
    title: `스터디 구인 ${i + 1}`,
    tags,
    deadline: i % 6 === 0 ? null : formatDate(deadlineDate),
    status,
    views_count: VIEW_COUNT_BASE + (((i + 3) * 37) % 900),
    bookmarks_count: 5 + (((i + 7) * 13) % VIEW_COUNT_BASE),
    created_at: formatDateTime(createdAt),
    updated_at: formatDateTime(updatedAt),
    content: `스터디 ${i + 1} 상세 본문입니다.\n주 ${1 + (i % 3)}회 모임, 온/오프 병행.`,
    author: { user_id: `u${i + 1}`, nickname: `작성자${i + 1}` },
  }
}

const ALL_RECRUITMENT_DETAILS: RecruitmentDetail[] = Array.from({
  length: 137,
}).map((_, i) => makeDetail(i))

/* === 정렬 === */
function sortRows(
  rows: RecruitmentDetail[],
  sortKey: SortKey
): RecruitmentDetail[] {
  const byCreatedAsc = (a: RecruitmentDetail, b: RecruitmentDetail) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()

  switch (sortKey) {
    case 'created_asc':
      return rows.slice().sort(byCreatedAsc)
    case 'created_desc':
      return rows.slice().sort((a, b) => -byCreatedAsc(a, b))
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
    q: queryText = '',
    status = 'ALL',
    tags = [],
    sort = 'created_desc',
    page = 1,
    size = 10,
  } = query

  let filteredRows = ALL_RECRUITMENT_DETAILS

  // 검색(제목)
  if (queryText.trim()) {
    const queryLower = queryText.toLowerCase()
    filteredRows = filteredRows.filter((row) =>
      row.title.toLowerCase().includes(queryLower)
    )
  }

  // 상태 필터
  if (status !== 'ALL') {
    filteredRows = filteredRows.filter((row) => row.status === status)
  }

  // 태그 ID AND 필터
  if (tags.length) {
    filteredRows = filteredRows.filter((row) =>
      tags.every((tagId) => row.tags.some((tag) => tag.id === tagId))
    )
  }

  // 정렬
  filteredRows = sortRows(filteredRows, sort)

  // 페이징 + 아이템 축약
  const total = filteredRows.length
  const start = (page - 1) * size
  const items: RecruitmentItem[] = filteredRows
    .slice(start, start + size)
    .map((detail) => ({
      id: detail.id,
      title: detail.title,
      tags: detail.tags,
      deadline: detail.deadline,
      status: detail.status,
      views_count: detail.views_count,
      bookmarks_count: detail.bookmarks_count,
      created_at: detail.created_at,
      updated_at: detail.updated_at,
    }))

  // 네트워크 지연 흉내(Optional)
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS))
  return { total, page, size, items }
}

/* === 상세 조회 === */
export async function getRecruitmentDetail(
  id: string
): Promise<RecruitmentDetail | null> {
  const found =
    ALL_RECRUITMENT_DETAILS.find((row) => row.id === String(id)) ?? null
  await new Promise((resolve) => setTimeout(resolve, 80))
  return found
}
