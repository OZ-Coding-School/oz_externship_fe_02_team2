import { Button } from '@/components/ui/Button'
import type { WithdrawalDetail } from '@/components/ui/Modal/feature/Withdrawal/Withdrawal.types'
import WithdrawalModal from '@/components/ui/Modal/feature/Withdrawal/WithdrawalDetail'
import { useState } from 'react'

export default function TestWithdrawalDetailPage() {
  const [open, setOpen] = useState(false)

  // 더미 데이터
  const dummyWithdrawal: WithdrawalDetail = {
    id: 'u-001',
    avatarUrl: 'https://placehold.co/80x80?text=👤',
    name: '박사용',
    nickname: 'user002',
    role: '일반회원',
    gender: '여성',
    status: '탈퇴요청',
    email: 'user2@example.com',
    joinedAt: '2023-04-18T20:45:00+09:00',
    withdrawalRequestId: 'W001',
    requestedAt: '2024-01-16T01:30:00+09:00',
    scheduledDeletionAt: '2024-02-16T01:30:00+09:00',
    reason: '서비스 불만족',
    reasonDetail: '기능이 부족하고 사용하기 불편함',
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Button
        btnStyle="primary"
        btnText="회원 탈퇴 상세 모달 열기"
        onClick={() => setOpen(true)}
      />

      <WithdrawalModal
        open={open}
        onClose={() => setOpen(false)}
        data={dummyWithdrawal}
      />
    </div>
  )
}
