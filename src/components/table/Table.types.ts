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
  id: number | string
  cover?: string
  title: string
  capacity: number
  enrolled: number
  period: { start: string; end: string }
  status: '대기중' | '진행중' | '종료됨'
  createdAt: string
  updatedAt: string
}

export type WithdrawalRow = {
  /** 회원 탈퇴 관리 */
  wid: string
  email: string
  name: string
  role: '일반회원' | '관리자' | '스태프'
  birth?: string
  reason?: string
  withdrawnAt: string
}
