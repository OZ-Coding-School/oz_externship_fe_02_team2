export type StudyStatus = '대기중' | '진행중' | '종료'

export type Member = {
  id: string
  name: string
  isLeader?: boolean
}

export type Course = {
  id: string
  title: string
  teacher?: string
  thumbnailUrl?: string
  externalUrl?: string
}

export type StudyGroupDetail = {
  id: number
  uuid: string
  name: string
  currentMembers: number
  capacity: number
  startDate: string // ISO
  endDate: string // ISO
  status: StudyStatus
  createdAt: string // ISO
  updatedAt: string // ISO
  coverImageUrl?: string
  members: Member[]
  courses: Course[]
}
