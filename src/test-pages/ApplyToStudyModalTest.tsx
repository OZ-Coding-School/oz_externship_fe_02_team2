import { Button } from '@/components/ui/Button'
import type { ApplyToStudyDetail } from '@/components/ui/Modal/feature/ApplyToStudy/ApplyToStudy.types'
import ApplyToStudyModal from '@/components/ui/Modal/feature/ApplyToStudy/ApplyToStudyModal'
// 경로는 네가 만든 위치에 맞춰 조정
import { useState } from 'react'

export default function TestApplicationDetailPage() {
  const [open, setOpen] = useState(false)

  // 더미 데이터 (이미지와 문구는 샘플)
  const mockDetail: ApplyToStudyDetail = {
    applicationId: '#APP001',
    recruitment: {
      id: 1,
      uuid: 'post-uuid-1',
      title: 'React 마스터 스터디 모집',
      expectedHeadcount: 6,
      lectures: [
        { title: '모던 리액트 Deep Dive', instructorName: '김리액트' },
        { title: 'React 18 완벽 가이드', instructorName: '박프론트' },
      ],
      tags: [
        { id: 'react', name: 'React' },
        { id: 'js', name: 'JavaScript' },
        { id: 'fe', name: 'Frontend' },
        { id: 'project', name: '프로젝트' },
      ],
      deadlineDate: '2024-01-20',
    },
    applicant: {
      userId: 'U001',
      nickname: '코딩러버',
      email: 'coder@example.com',
      gender: 'MALE',
      profileImageUrl: 'https://placehold.co/80x80?text=😀',
    },
    selfIntroduction:
      '안녕하세요! 백엔드 3년차로 프론트엔드 기술을 배우고 싶어 지원합니다.',
    motivation:
      'React를 체계적으로 학습하고 풀스택 개발자로 성장하고 싶습니다.',
    goal: '6개월 내 React로 완성도 높은 프로젝트를 만드는 것이 목표입니다.',
    availableTimeDescription: '평일 저녁 7시~10시, 주말 오전',
    hasStudyExperience: true,
    studyExperienceDetails: '대학 시절 알고리즘/CS 스터디 다수 참여 경험',
    createdAt: '2024-01-15T14:30:00+09:00',
    updatedAt: '2024-01-16T09:15:00+09:00',
    status: 'APPROVED',
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Button
        btnStyle="primary"
        btnText="지원 내역 상세 모달 열기"
        onClick={() => setOpen(true)}
      />

      <ApplyToStudyModal
        open={open}
        onClose={() => setOpen(false)}
        data={mockDetail}
        loading={false}
        errorText={null}
      />
    </div>
  )
}
