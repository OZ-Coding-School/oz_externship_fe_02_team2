import Modal from '../../Modal'
import Field from '../../fields/Field'
import { formatDateTime } from '@/lib/datetime'

import { memo } from 'react'
import type { ApplyToStudyDetail } from './ApplyToStudy.types'
import Badge from '@/components/ui/Badge/Badge'

function ApplicationInfoViewBase({ form }: { form: ApplyToStudyDetail }) {
  // Badge는 variant를 직접 주는 게 타입 충돌 없음
  const STATUS_BADGE: Record<
    string,
    { label: string; variant: 'success' | 'danger' | 'secondary' | 'warning' }
  > = {
    APPROVED: { label: '승인', variant: 'success' },
    REJECTED: { label: '거절', variant: 'danger' },
    PENDING: { label: '대기중', variant: 'secondary' },
    REVIEWING: { label: '검토중', variant: 'warning' },
    UNDER_REVIEW: { label: '검토중', variant: 'warning' }, // 백엔드 키워드 예비
  }
  const sb = STATUS_BADGE[form.status] ?? {
    label: String(form.status),
    variant: 'secondary' as const,
  }
  return (
    <>
      <Modal.Header className="pb-2">
        <Modal.Title>지원 내역 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0 pb-3">
        <div className="grid grid-cols-1 gap-4">
          <Field
            label="지원 내역 ID"
            value={form.applicationId}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="자기소개"
            value={form.selfIntroduction ?? '-'}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="지원 동기"
            value={form.motivation ?? '-'}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="스터디 목표"
            value={form.goal ?? '-'}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="가능한 시간대"
            value={form.availableTimeDescription ?? '-'}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="스터디 경험 유무"
            value={form.hasStudyExperience ? '있음' : '없음'}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="구체적인 스터디 경험"
            value={form.studyExperienceDetails ?? '-'}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="지원일시"
            value={formatDateTime(form.createdAt)}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="수정일시"
            value={formatDateTime(form.updatedAt)}
            editing={false}
            onChange={() => {}}
          />
          <div>
            <div className="body-sm mb-1 font-medium text-gray-700">
              지원 상태
            </div>
            <Badge
              variant={sb.variant}
              size="lg"
              aria-label={`지원 상태: ${sb.label}`}
            >
              {sb.label}
            </Badge>
          </div>
        </div>
      </Modal.Body>
    </>
  )
}

export default memo(ApplicationInfoViewBase)
