import Modal from '../../Modal'
import Field from '../../fields/Field'
import { formatDateTime } from '@/lib/datetime'

import { memo } from 'react'
import type { ApplicationDetail } from './ApplyToStudy.types'

function ApplicationInfoViewBase({ form }: { form: ApplicationDetail }) {
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
          <Field
            label="지원 상태"
            value={mapStatus(form.status)}
            editing={false}
            onChange={() => {}}
          />
        </div>
      </Modal.Body>
    </>
  )
}
function mapStatus(s: ApplicationDetail['status']) {
  switch (s) {
    case 'APPROVED':
      return '승인'
    case 'PENDING':
      return '대기'
    case 'REJECTED':
      return '거절'
    case 'INREVIEW':
      return '검토 중'
    default:
      return s
  }
}
export default memo(ApplicationInfoViewBase)
