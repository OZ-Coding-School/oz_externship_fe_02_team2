import Modal from '../../Modal'
import { Button } from '../../../Button'
import { useFormHandlers } from '@/hooks/useFormHandlers'
import type { WithdrawalDetail } from './Withdrawal.types'
import { useEffect, useState } from 'react'
import WithdrawalDetailView from './WithdrawalDetailView'
import WithdrawalRestore from './WithdrawalRestore'

type WithdrawalProps = {
  open: boolean
  data?: WithdrawalDetail | null
  loading?: boolean
  errorText?: string | null
  onClose: () => void
  onRequestRestore?: (detail: WithdrawalDetail) => void
}

export default function WithdrawalModal({
  open,
  data,
  loading,
  errorText,
  onClose,
  onRequestRestore,
}: WithdrawalProps) {
  const { form, resetForm, restoring, handleRestore } =
    useFormHandlers<WithdrawalDetail>(
      (data as WithdrawalDetail) || ({} as WithdrawalDetail),
      { onRestore: onRequestRestore }
    )

  const [restoreOpen, setRestoreOpen] = useState<boolean>(false)

  // 외부 data 변경 시 동기화
  useEffect(() => {
    if (data) resetForm(data)
  }, [data, resetForm])

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="none"
      className="w-[768px]"
      maxHeightClass=""
    >
      {/* Section 1 */}
      {/* Header 1 */}
      <Modal.Header>
        <Modal.Title id="withdrawal-title">회원 탈퇴 상세 정보</Modal.Title>
      </Modal.Header>
      <div className="border-b border-gray-200" />

      {/* Body: 상세 뷰 조립 */}
      <Modal.Body className="max-h-[65vh] p-0">
        <WithdrawalDetailView
          form={form}
          loading={loading}
          errorText={errorText}
        />
      </Modal.Body>

      <div className="border-b border-gray-200" />
      {/* Footer */}
      <Modal.Footer align="end" className="bg-gray-50">
        <Modal.Actions>
          <Button btnStyle="secondary" btnText="닫기" onClick={onClose} />
          <Button
            btnStyle="success"
            btnText={restoring ? '복구 중...' : '회원 복구하기'}
            onClick={() => setRestoreOpen(true)}
            disabled={!form || restoring}
            aria-disabled={!form || restoring}
          />
        </Modal.Actions>
      </Modal.Footer>

      <WithdrawalRestore
        open={restoreOpen}
        onClose={() => setRestoreOpen(false)}
        loading={restoring}
        error={errorText /* 혹은 훅의 error를 노출한다면 error */}
        onConfirm={async () => {
          await handleRestore()
          setRestoreOpen(false)
          onClose() // 복구 후 닫기(필요시)
        }}
      />
    </Modal>
  )
}
