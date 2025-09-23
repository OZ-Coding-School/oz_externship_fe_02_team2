import { useToast } from '@/hooks'
import Modal from '../../Modal'
import { Button } from '@/components/ui/Button'

type WithdrawalRestoreProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  loading?: boolean
  error?: string | null
}

export default function WithdrawalRestore({
  open,
  onClose,
  onConfirm,
  loading,
  error,
}: WithdrawalRestoreProps) {
  const descId = 'user-restore-desc'
  const { triggerToast } = useToast()

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="none"
      className="w-[448px]"
      showCloseIcon={false}
      describedById={descId}
    >
      <Modal.Header className="mt-2">
        <Modal.Title>회원 복구 확인</Modal.Title>
      </Modal.Header>

      <Modal.Body className="py-0">
        <div id={descId} className="text-[16px] text-gray-600">
          해당 유저의 탈퇴요청은 삭제되며 해당 유저는 즉시 이용가능한 상태로
          복구됩니다.
        </div>
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </Modal.Body>

      <Modal.Footer align="end" className="mb-1">
        <div className="flex gap-3">
          <Button
            btnStyle="secondary"
            btnText="취소"
            onClick={onClose}
            disabled={loading}
          />
          <Button
            btnStyle="success"
            btnText={loading ? '복구 중…' : '복구'}
            onClick={() => {
              void onConfirm()
              triggerToast('success', '복구', '정상 처리되었습니다.')
            }}
            disabled={loading}
          />
        </div>
      </Modal.Footer>
    </Modal>
  )
}
