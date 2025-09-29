// ────────────────────────────────────────────────────────────────────────────
// 회원 탈퇴 관리 타입 정의
// 최신 API 스키마 기준
// ────────────────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────────────────
// 권한 Enum
// ────────────────────────────────────────────────────────────────────────────
//export type PermissionType = 'ADMIN' | 'STAFF' | 'GENERAL'
export type PermissionType = string

// ────────────────────────────────────────────────────────────────────────────
// 탈퇴 사유 Enum
// ────────────────────────────────────────────────────────────────────────────
export type WithdrawalReasonType =
  | 'NO_LONGER_NEEDED' // 서비스 불필요
  | 'LACK_OF_INTEREST' // 관심 감소
  | 'TOO_DIFFICULT' // 사용 어려움
  | 'FOUND_BETTER_SERVICE' // 더 나은 서비스 발견
  | 'PRIVACY_CONCERNS' // 개인정보 우려
  | 'POOR_SERVICE_QUALITY' // 서비스 품질 불만
  | 'TECHNICAL_ISSUES' // 기술적 문제
  | 'LACK_OF_CONTENT' // 콘텐츠 부족
  | 'OTHER' // 기타

// ────────────────────────────────────────────────────────────────────────────
// 회원 상태 Enum
// ────────────────────────────────────────────────────────────────────────────
export type UserStatusType = string

// ────────────────────────────────────────────────────────────────────────────
// 서버 응답 타입 (스네이크 케이스)
// ────────────────────────────────────────────────────────────────────────────

/**
 * 탈퇴 요청 목록 아이템 (서버 응답)
 */
export type ServerWithdrawalListItem = {
  id: number
  email: string
  name: string
  permission: PermissionType
  birthday: string // YYYY-MM-DD
  reason: WithdrawalReasonType
  created_at: string // ISO 8601
}

/**
 * 탈퇴 요청 상세 정보 (서버 응답)
 */
export type ServerWithdrawalDetail = {
  id: number
  name: string
  gender: string
  nickname: string
  email: string
  permission: PermissionType
  birthday: string // YYYY-MM-DD
  status: UserStatusType
  user_joined_at: string // ISO 8601
  profile_img_url: string | null
  created_at: string // ISO 8601
  reason: WithdrawalReasonType
  reason_detail: string | null
  due_date: string // YYYY-MM-DD
}

// ────────────────────────────────────────────────────────────────────────────
// 클라이언트 타입 (카멜 케이스)
// ────────────────────────────────────────────────────────────────────────────

/**
 * 탈퇴 요청 목록 아이템 (클라이언트)
 */
export type WithdrawalListItem = {
  id: number
  email: string
  name: string
  permission: PermissionType
  birthday: string // YYYY-MM-DD
  reason: WithdrawalReasonType
  createdAt: string // ISO 8601
}

/**
 * 탈퇴 요청 상세 정보 (클라이언트)
 */
export type WithdrawalDetail = {
  id: number
  name: string
  gender: string
  nickname: string
  email: string
  permission: string // 번역 가능하도록 string으로 변경
  birthday: string // YYYY-MM-DD
  status: string // 유연한 상태 처리를 위해 string으로 변경
  userJoinedAt: string // ISO 8601
  profileImgUrl: string | null
  createdAt: string // ISO 8601
  reason: string // 번역 가능하도록 string으로 변경
  reasonDetail: string | null
  dueDate: string // YYYY-MM-DD
}

/**
 * 테이블 행 표시용 타입
 */
export type WithdrawalRow = {
  id: number
  name: string
  email: string
  permission: string // 번역된 문자열 (예: "관리자")
  birthday: string // YYYY-MM-DD
  reason: string // 번역된 문자열 (예: "서비스 불필요")
  createdAt: string // YYYY-MM-DD
}

// ────────────────────────────────────────────────────────────────────────────
// API 요청/응답 타입
// ────────────────────────────────────────────────────────────────────────────

/**
 * 탈퇴 목록 조회 파라미터
 */
export type WithdrawalsQueryParams = {
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

/**
 * Django REST Framework 페이지네이션 응답
 */
export type DjangoPageResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

/**
 * 클라이언트 페이지네이션 응답
 */
export type PageResponse<T> = {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

/**
 * 탈퇴 회원 복구 응답
 */
export type RestoreWithdrawalResponse = {
  success: boolean
  message: string
}
