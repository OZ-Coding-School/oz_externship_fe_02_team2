// 사용자 관리 UI 표시용 헬퍼 함수들

/**
 * 상태 enum → 한글 번역
 */
export function translateGender(gender: string | null | undefined): string {
  const genderMap: Record<string, string> = {
    MALE: '남성',
    FEMALE: '여성',
    OTHER: '기타',
  }
  return gender ? (genderMap[gender] ?? gender) : '알 수 없음'
}

export function translateStatus(status: string | null | undefined): string {
  const statusMap: Record<string, string> = {
    ACTIVE: '활성',
    INACTIVE: '비활성',
    WITHDRAWN: '탈퇴요청',
  }
  return status ? (statusMap[status] ?? status) : '알 수 없음'
}

/**
 * 권한 enum → 한글 번역
 */
export function translatePermission(
  permission: string | null | undefined
): string {
  const permissionMap: Record<string, string> = {
    ADMIN: '관리자',
    STAFF: '스태프',
    GENERAL: '일반회원',
  }
  return permission ? (permissionMap[permission] ?? permission) : '알 수 없음'
}

/**
 * 한글 상태 → enum 변환
 */
export function parseStatus(
  korean: string
): 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN' {
  const reverseMap: Record<string, 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN'> = {
    활성: 'ACTIVE',
    비활성: 'INACTIVE',
    탈퇴요청: 'WITHDRAWN',
  }
  return reverseMap[korean] ?? 'ACTIVE'
}

/**
 * 한글 권한 → enum 변환
 */
export function parsePermission(korean: string): 'ADMIN' | 'STAFF' | 'GENERAL' {
  const reverseMap: Record<string, 'ADMIN' | 'STAFF' | 'GENERAL'> = {
    관리자: 'ADMIN',
    스태프: 'STAFF',
    일반회원: 'GENERAL',
  }
  return reverseMap[korean] ?? 'GENERAL'
}

/**
 * 상태 선택 옵션 (한글 라벨, enum 값)
 */
export const STATUS_OPTIONS = [
  { label: '활성', value: 'ACTIVE' },
  { label: '비활성', value: 'INACTIVE' },
  { label: '탈퇴요청', value: 'WITHDRAWN' },
] as const

/**
 * 권한 선택 옵션 (한글 라벨, enum 값)
 */
export const PERMISSION_OPTIONS = [
  { label: '관리자', value: 'ADMIN' },
  { label: '스태프', value: 'STAFF' },
  { label: '일반회원', value: 'GENERAL' },
] as const
