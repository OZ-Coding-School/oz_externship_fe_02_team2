import { Button } from '@/components/ui/Button'
import type { WithdrawalDetail } from '@type/Withdrawal.types'
import WithdrawalModal from '@/components/ui/Modal/feature/Withdrawal/WithdrawalDetail'
import { useState } from 'react'

export default function TestWithdrawalDetailPage() {
  const [open, setOpen] = useState(false)

  // 더미 데이터
  const dummyWithdrawal: WithdrawalDetail = {
    id: 1,
    profileImgUrl: 'https://placehold.co/80x80?text=👤',
    name: '박사용',
    nickname: 'user002',
    permission: '일반회원',
    gender: '여성',
    status: '탈퇴요청',
    email: 'user2@example.com',
    userJoinedAt: '2023-04-18T20:45:00+09:00',
    createdAt: '2024-01-16T01:30:00+09:00',
    dueDate: '2024-02-16T01:30:00+09:00',
    reason: '서비스 불만족',
    reasonDetail: '기능이 부족하고 사용하기 불편함',
    birthday: '',
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
