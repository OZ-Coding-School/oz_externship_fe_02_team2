// 서버 응답 스키마 (스네이크 케이스)
export type ServerUserList = {
  uuid: string
  email: string
  nickname: string
  name: string
  birthday: string // YYYY-MM-DD
  permission: 'ADMIN' | 'STAFF' | 'GENERAL' | null
  permission_display: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN'
  created_at: string
  withdrawals_request_date: string | null
}

export type ServerUserDetail = {
  uuid: string
  name: string
  gender: string
  nickname: string
  birthday: string // YYYY-MM-DD
  phone_number: string | null
  email: string
  permission: 'ADMIN' | 'STAFF' | 'GENERAL' | null
  status: 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN'
  created_at: string
  profile_img_url: string | null
}

// 클라이언트 모델 (카멜 케이스)
export type UserDetail = {
  uuid: string
  email: string
  nickname: string
  name: string
  birthday: string
  permission: 'ADMIN' | 'STAFF' | 'GENERAL' | null
  permissionDisplay?: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN'
  createdAt: string
  withdrawalsRequestDate?: string | null
  // 상세 조회용 추가 필드
  gender?: string
  phoneNumber?: string | null
  profileImgUrl?: string | null
}

// 생성/수정용 요청 타입
export type UserCreateRequest = {
  email: string
  nickname: string
  name: string
  birthday: string // YYYY-MM-DD
}

export type UserUpdateRequest = {
  name?: string
  gender?: string
  nickname?: string
  phone_number?: string | null
  status?: 'active' | 'inactive' // 소문자로 전송
  profile_img_url?: string | null
}

// 권한 수정용
export type UserPermissionUpdateRequest = {
  permission: 'ADMIN' | 'STAFF' | 'GENERAL'
}

// 페이지네이션 파라미터
export type UsersParams = {
  page?: number
  page_size?: number
  ordering?: string // 예: '-created_at', 'name'
  search?: string // 검색어
  permission?: 'ADMIN' | 'STAFF' | 'GENERAL'
  status?: 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN'
  sortBy?: string
  sortOrder?: string
}

// DRF 페이지 응답
export type DjangoPageResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// 클라이언트용 페이지 응답
export type PageResponse<T> = {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}
