import type { FilterOption, TableQuery } from '@/types/table'

export const DEFAULT_QUERY: TableQuery = {
  q: '',
  status: undefined,
  role: undefined,
  sortBy: null,
  sortDir: undefined,
  page: 1,
  pageSize: 20,
  search: '',
}

export const URL_PARAM_KEYS = {
  q: 'q',
  status: 'status',
  role: 'role',
  sort: 'sort',
  page: 'page',
  size: 'size',
} as const

/** 탈퇴사유 옵션들 */
export const WITHDRAWAL_REASONS: FilterOption[] = [
  { label: '서비스 불만족', value: 'service_dissatisfaction' },
  { label: '개인정보 우려', value: 'privacy_concern' },
  { label: '사용 빈도 낮음', value: 'low_usage' },
  { label: '경쟁 서비스 이용', value: 'competitor_service' },
  { label: '기타', value: 'other' },
] as const

/** 기본 역할 옵션들 */
export const DEFAULT_ROLE_OPTIONS: FilterOption[] = [
  { label: '관리자', value: 'admin' },
  { label: '스태프', value: 'staff' },
  { label: '일반회원', value: 'general' },
] as const

/** 기본 상태 옵션들 */
export const DEFAULT_STATUS_OPTIONS: FilterOption[] = [
  { label: '활성', value: 'active' },
  { label: '비활성', value: 'inactive' },
  { label: '정지', value: 'suspended' },
  { label: '탈퇴요청', value: 'withdrawal_requested' },
] as const

export const DEFAULT_DEBOUNCE_MS = 300
