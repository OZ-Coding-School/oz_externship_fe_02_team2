export type RecruitmentStatus = 'OPEN' | 'CLOSED'
export type RecruitmentStatusFilter = 'ALL' | RecruitmentStatus

export interface Tag {
  id: string
  name: string
}

export interface RecruitmentItem {
  id: string
  title: string
  tags: Tag[] // 목록 표기용
  deadline?: string | null // YYYY-MM-DD
  status: RecruitmentStatus
  views_count: number
  bookmarks_count: number
  created_at: string // YYYY-MM-DD HH:MM
  updated_at: string // YYYY-MM-DD HH:MM
}

export interface RecruitmentListRes {
  total: number // 전체 개수
  page: number
  size: number
  items: RecruitmentItem[]
}

export interface RecruitmentDetail extends RecruitmentItem {
  content?: string // 상세 모달 본문
  author?: { user_id: string; nickname: string; image_url?: string }
}

export type SortKey =
  | 'created_desc' // 최신순(기본)
  | 'created_asc' // 오래된 순
  | 'views_desc' // 조회수 순
  | 'bookmarks_desc' // 북마크 순

// 목록 api 쿼리 타입
export interface RecruitmentListQuery {
  q?: string
  status?: RecruitmentStatusFilter
  tags?: string[] // 태그 id 배열
  sort?: SortKey
  page?: number
  size?: number
}

/**
 * 필터바에서 부모(테이블)로 올리는 값의 형태
 * - queryText: 제목 검색어
 * - status   : 상태 필터(ALL | OPEN | CLOSED)
 * - sortKey  : 정렬 키
 */
export type AdminRecruitmentsFiltersProps = {
  value: {
    queryText: string
    status: RecruitmentStatusFilter
    sortKey: SortKey
  }
  /**
   * 부분 업데이트를 허용하는 onChange
   * - 검색어만 바꾸거나, 정렬만 바꾸는 등 일부만 전달해도 된다.
   * - 부모에서 기존 값과 병합 처리
   */
  onChange: (nextValue: {
    queryText?: string
    status?: RecruitmentStatusFilter
    sortKey?: SortKey
  }) => void
}
