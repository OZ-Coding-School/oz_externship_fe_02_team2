export type RecruitmentItem = {
  id: string
  uuid: string
  title: string
  tags: (string | { id: string; name: string })[]
  close_at: string | null // ← 신스펙
  deadline?: string | null // ← 구스펙 호환(옵션)
  status: 'OPEN' | 'CLOSED'
  views_count: number
  bookmarks_count: number
  created_at?: string
  updated_at?: string | null
}

// 백엔드 응답(DTO) — 예상 필드명 예시 (DRF commonly snake_case)
export interface RecruitmentDetailDTO {
  id: number
  uuid: string
  title: string
  content: string

  expected_headcount: number
  estimated_fee: number // null 가능하면 number | null
  close_at: string // ISO string
  is_closed: boolean

  views_count: number
  bookmark_count: number

  created_at: string
  updated_at: string | null

  tags: Array<{ id: number; name: string }> // 또는 string[] 인 경우도 있음
  attachments: Array<{
    id: number
    file_name: string
    file_url: string
  }>
}

// UI에서 쓰는 도메인 타입 (지금 컴포넌트가 기대하는 형태)
export interface RecruitmentDetailData {
  id: number
  uuid: string
  title: string
  content: string

  expectedHeadcount: number
  estimatedFee: number // null 가능하면 number | null
  closeAt: string
  isClosed: boolean

  viewsCount: number
  bookmarkCount: number

  createdAt: string
  updatedAt: string | null

  tags: Array<{ id: number; name: string }>
  attachments: Array<{
    id: number
    fileName: string
    fileUrl: string
  }>
}

// ────────────────────────────────────────────────────────────────────────────
// 공통 타입
// ────────────────────────────────────────────────────────────────────────────

export interface Tag {
  id: number
  name: string
}

export interface Author {
  id: number
  nickname: string
}

export interface Lecture {
  title: string
  urlLink: string
  instructor: string
  thumbnailImgUrl: string | null
  originalPrice: number
  discountPrice: number
}

export interface Attachment {
  id: number
  fileName: string
  fileUrl: string
}

export interface Application {
  applicantNickname: string
  applicantEmail: string
  appliedAt: string
  status: 'PENDING' | 'CANCELED' | 'ACCEPTED' | 'REJECTED'
}

// ────────────────────────────────────────────────────────────────────────────
// 서버 응답 타입 (snake_case)
// ────────────────────────────────────────────────────────────────────────────

export interface ServerAdminRecruitment {
  id: number
  uuid: string
  title: string
  tags: Tag[]
  close_at: string
  status: string
  views_count: number
  bookmark_count: number
  created_at: string
  updated_at: string | null
}

// ────────────────────────────────────────────────────────────────────────────
// 클라이언트 타입 (camelCase)
// ────────────────────────────────────────────────────────────────────────────

export interface AdminRecruitment {
  id: number
  uuid: string
  title: string
  tags: Tag[]
  closeAt: string
  status: string
  viewsCount: number
  bookmarkCount: number
  createdAt: string
  updatedAt: string | null
}

/** 구인공고 로우 타입 */
export type RecruitmentRow = {
  id: string
  uuid: string
  title: string
  tags: { id: number; name: string }[]
  close_at: string | null
  deadline: string | null
  status: 'OPEN' | 'CLOSED'
  views_count: number
  bookmarks_count: number
  created_at: string
  updated_at: string | null
}

export type RecruitmentsTableProps = {
  rows: RecruitmentRow[]
  loading: boolean
  total?: number
  totalPages?: number
  onRequest?: (params: {
    page: number
    pageSize: number
    sort?: { id: string; desc: boolean } | null
  }) => void
  onRowClick?: (row: RecruitmentRow) => void
}

// ────────────────────────────────────────────────────────────────────────────
// 상세 정보 타입
// ────────────────────────────────────────────────────────────────────────────

export interface RecruitmentDetailData {
  lectures: any
  id: number
  uuid: string
  title: string
  content: string
  author: Author
  expectedHeadcount: number
  estimatedFee: number
  studyLectures: Lecture[]
  tags: Tag[]
  attachments: Attachment[]
  closeAt: string
  isClosed: boolean
  viewsCount: number
  bookmarkCount: number
  createdAt: string
  updatedAt: string | null
  applications: Application[]
}

// ────────────────────────────────────────────────────────────────────────────
// 페이지네이션 타입
// ────────────────────────────────────────────────────────────────────────────

export interface DjangoPageResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface PageResponse<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// ────────────────────────────────────────────────────────────────────────────
// API 요청 파라미터
// ────────────────────────────────────────────────────────────────────────────

export interface AdminRecruitmentsParams {
  page?: number
  // 서버 스타일
  page_size?: number
  ordering?: string
  search?: string
  // 클라/레거시 스타일도 허용
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  q?: string

  permission?: string
  reason?: string
}
