export type UserRow = {
  /** 회원 관리 */
  memberId: string
  email: string
  nickname?: string
  name: string
  birth?: string
  role?: string
  status?: string
  joinedAt?: string
  withdrawnAt?: string | null
}

export type CourseRow = {
  /** 강의 관리 */
  id: number
  thumbnail?: string
  title: string
  instructor: string
  platform: 'Udemy' | 'Inflearn' | 'Fastcampus' | 'ETC'
  openedAt: string // 생성일시
  completedAt?: string // 수정일시
  link?: string
}

export type StudyGroupRow = {
  /** 스터디 그룹 관리 */
  id: number
  coverImageUrl?: string
  title: string
  enrolled: number
  capacity: number
  period: { start: string; end: string }
  status: string
  createdAt: string
  updatedAt: string
}

export type WithdrawalRow = {
  /** 회원 탈퇴 관리 */
  id: number // 탈퇴 요청 ID
  email: string // 이메일
  name: string // 이름
  permission: string // 권한
  birthday?: string | null // 생년월일 yyyy-mm-dd
  reason: string // 탈퇴사유
  created_at: string // 탈퇴 일시
  profileImgUrl?: string | null
}
