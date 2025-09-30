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
  coverImageUrl?: string
  title: string
  uuid?: string
  enrolled: number
  capacity: number
  period: { start: string; end: string }
  status: string
  createdAt: string // ISO
  updatedAt: string // ISO

  members: Member[]
  courses: Course[]
}
