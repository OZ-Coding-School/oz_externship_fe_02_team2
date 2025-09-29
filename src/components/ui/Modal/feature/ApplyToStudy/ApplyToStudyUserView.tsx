import Modal from '../../Modal'
import Field from '../../fields/Field'
import { memo } from 'react'
import type { ApplicationDetail } from './ApplyToStudy.types'

function ApplicationApplicantViewBase({ form }: { form: ApplicationDetail }) {
  const u = form.applicant
  return (
    <>
      <Modal.Header className="pb-2">
        <Modal.Title>지원자 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0 pb-3">
        <div className="mb-5 flex items-center gap-4">
          <img
            src={u.profileImageUrl || 'https://placehold.co/80x80?text=👤'}
            alt={`${u.nickname ?? ''} 프로필 이미지`}
            className="size-20 rounded-full object-cover"
          />
          <div>
            <h4 className="text-lg font-semibold">{u.nickname ?? '-'}</h4>
            <div className="text-gray-500">{u.email ?? '-'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Field
            label="성별"
            value={u.gender ?? '미기입'}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="유저 ID"
            value={u.userId}
            editing={false}
            onChange={() => {}}
          />
        </div>
      </Modal.Body>
    </>
  )
}
export default memo(ApplicationApplicantViewBase)
