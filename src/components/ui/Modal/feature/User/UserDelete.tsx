import { useState } from 'react'
import { Button } from '../../../Button'
import Modal from '../../Modal'

type UserDeleteProps = {
  open: boolean
  userId: string
  /** 삭제 */
  deleteUser: (userId: string) => Promise<void>
  /** 닫기 */
  onClose: () => void
  /** 삭제 성공 후 알림 */
  onDeleted?: () => void
}

export default function UserDelete({
  open,
  userId,
  deleteUser,
  onClose,
  onDeleted,
}: UserDeleteProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const descId = 'user-delete-desc'

  const handleDelete = async () => {
    try {
      setLoading(true)
      setError(null)
      await deleteUser(userId)
      onDeleted?.()
      onClose()
    } catch (error) {
      setError(`${error}, 삭제 중 오류 발생!! 잠시 후 다시 시도해주세요.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="w-[448px]"
      showCloseIcon={false}
      describedById={descId}
    >
      <Modal.Header className="mt-2">
        <Modal.Title>회원 삭제 확인</Modal.Title>
      </Modal.Header>

      <Modal.Body className="py-0">
        <div id={descId} className="text-[16px] text-gray-600">
          삭제 시 해당 유저와 관련된 모든 데이터가 즉시 삭제되며 되돌릴 수
          없습니다.
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
            btnStyle="danger"
            btnText={loading ? '삭제 중…' : '삭제'}
            onClick={handleDelete}
            disabled={loading}
          />
        </div>
      </Modal.Footer>
    </Modal>
  )
}
