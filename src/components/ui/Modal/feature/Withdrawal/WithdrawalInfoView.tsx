import Field from '../../fields/Field'
import Modal from '../../Modal'
import type { WithdrawalDetail } from './Withdrawal.types'
import { formatDateTime } from '@/lib/datetime'
import { memo } from 'react'

type Props = {
  form: WithdrawalDetail
}

function WithdrawalInfoViewBase({ form }: Props) {
  return (
    <>
      {/* Header */}
      <Modal.Header className="pb-2">
        <Modal.Title>탈퇴 정보</Modal.Title>
      </Modal.Header>

      {/* Body: 기본 필드 */}
      <Modal.Body className="pt-0 pb-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="탈퇴요청 고유 ID"
            value={form.withdrawalRequestId ?? ''}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="탈퇴요청 일시"
            value={formatDateTime(form.requestedAt)}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="삭제 예정 일시"
            value={formatDateTime(form.scheduledDeletionAt)}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="탈퇴사유"
            value={form.reason ?? ''}
            editing={false}
            onChange={() => {}}
          />
        </div>
      </Modal.Body>
      {/* Body: 상세 사유 */}
      <div className="px-6 pt-0 pb-6">
        <Field
          label="탈퇴 상세 사유"
          value={form.reasonDetail || '-'}
          editing={false}
          onChange={() => {}}
        />
      </div>

      <div className="border-b border-gray-200" />
    </>
  )
}

const WithdrawalInfoView = memo(WithdrawalInfoViewBase)
export default WithdrawalInfoView
