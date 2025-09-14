export type WithdrawalDetail = {
  id: string
  name: string
  email: string
  gender?: '남성' | '여성' | '기타' | '미기입' | string
  nickname?: string
  role: '일반회원' | '관리자' | '스태프' | string
  status: '활성' | '비활성' | '탈퇴요청' | '삭제예정' | string
  joinedAt?: string // ISO
  withdrawalRequestId: string
  requestedAt: string // ISO
  scheduledDeletionAt?: string // ISO
  reason?: string
  reasonDetail?: string
  avatarUrl?: string
}
