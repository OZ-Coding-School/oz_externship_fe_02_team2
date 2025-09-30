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

// ────────────────────────────────────────────────────────────────────────────
// 공통 타입
// ────────────────────────────────────────────────────────────────────────────

export interface Tag {
  id: number
  name: string
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
}
