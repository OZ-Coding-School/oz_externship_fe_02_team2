export type WithdrawalDetail = {
  id: number
  name: string
  gender?: string
  nickname?: string
  email: string
  permission: string
  birth?: string
  status: string
  user_joined_at?: string // ISO
  profile_img_url?: string | null
  created_at: string // ISO
  reason?: string
  reasonDetail?: string
  due_date?: string // ISO
}
