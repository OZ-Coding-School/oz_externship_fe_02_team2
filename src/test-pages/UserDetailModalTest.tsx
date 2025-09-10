import { Button } from '@/components/ui/Button'
import MemberDetailModal, {
  type MemberDetail,
} from '@/components/ui/Modal/feature/UserDetail'
import { useState } from 'react'

export default function TestMemberDetailPage() {
  const [open, setOpen] = useState(false)

  // 더미 데이터
  const mockMember: MemberDetail = {
    id: 'U001',
    name: '홍길동',
    email: 'hong@example.com',
    gender: '남성',
    nickname: '길동이',
    birth: '1995-05-20',
    phone: '010-1234-5678',
    role: '관리자',
    status: '활성',
    joinedAt: '2024-03-15 15:30:00',
    avatarUrl: 'https://placehold.co/80x80?text=😀',
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Button
        btnStyle="primary"
        btnText="회원 상세 모달 열기"
        onClick={() => setOpen(true)}
      />

      <MemberDetailModal
        open={open}
        onClose={() => setOpen(false)}
        data={mockMember}
        onEdit={(m) => alert(`EDIT: ${JSON.stringify(m)}`)}
      />
    </div>
  )
}
