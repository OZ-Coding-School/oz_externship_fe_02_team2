export type UserDetail = {
  id: string
  name: string
  email: string
  gender?: '남성' | '여성' | '기타'
  nickname?: string
  birth?: string // yyyy-mm-dd
  phone?: string
  role?: string
  status: string
  joinedAt?: string // ISO or display string
  avatarUrl?: string
}
