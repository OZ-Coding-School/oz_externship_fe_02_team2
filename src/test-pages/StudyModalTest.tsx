import { Button } from '@/components/ui/Button'
import type { StudyGroupDetail } from '@/components/ui/Modal/feature/Study/Study.types'
import StudyGroupDetailModal from '@/components/ui/Modal/feature/Study/StudyGroupDetailModal'
import { useState } from 'react'

export default function TestStudyModalPage() {
  const [open, setOpen] = useState(true)
  const mockDetail: StudyGroupDetail = {
    id: 2,
    uuid: 'group-uuid-002',
    title: 'Spring Boot 실무 스터디',
    enrolled: 6,
    capacity: 10,
    period: { start: '2024-03-15T00:00:00Z', end: '2024-06-15T00:00:00Z' },
    status: '대기중',
    createdAt: '2024-01-25T14:20:00Z',
    updatedAt: '2024-02-02T09:30:00Z',
    coverImageUrl:
      'https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1200&auto=format&fit=crop',
    members: [
      { id: 'm1', name: 'SpringMaster', isLeader: true },
      { id: 'm2', name: 'APIDeveloper' },
      { id: 'm3', name: 'BackEndDev' },
      { id: 'm4', name: 'DBMaster' },
      { id: 'm5', name: '병원간 서연님' },
      { id: 'm6', name: '예비군간 민제님' },
      { id: 'm7', name: '집가고픈 명우님' },
      { id: 'm8', name: '필터정렬지옥 민창님' },
      { id: 'm9', name: '면접생각에 신난 여진님' },
    ],
    courses: [
      {
        id: 'c1',
        title: 'Spring Boot와 JPA 실무 완전 정복',
        teacher: '이정한',
        thumbnailUrl: 'https://placehold.co/160x90?text=JPA',
        externalUrl: 'https://example.com/course/1',
      },
    ],
  }

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <Button
          btnText="모달 열기"
          btnStyle="primary"
          onClick={() => setOpen(true)}
        />
      </div>
      <StudyGroupDetailModal
        open={open}
        onClose={() => setOpen(false)}
        data={mockDetail}
      />
    </>
  )
}
