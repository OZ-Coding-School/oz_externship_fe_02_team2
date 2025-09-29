import { useEffect } from 'react'
import { Button } from '../../../Button'
import Modal from '../../Modal'
import { useFormHandlers } from '@/hooks/useFormHandlers'
import { useToast } from '@/hooks'
import { deleteUser } from '@/api/modules/users'

type UserDeleteProps = {
  open: boolean
  userId: string
  /** 삭제 */
  deleteUser?: (userId: string) => Promise<void>
  /** 닫기 */
  onClose: () => void
  /** 삭제 성공 후 알림 */
  onDeleted?: () => void
  /** 삭제 성공 후, 삭제된 userId를 부모에 알려 테이블을 즉시 반영 */
  onDeletedWithId?: (userId: string) => void
}

export default function UserDelete({
  open,
  userId,
  deleteUser: customDeleteUser,
  onClose,
  onDeleted,
  onDeletedWithId,
}: UserDeleteProps) {
  const { triggerToast } = useToast()
  const descId = 'user-delete-desc'

  const { loading, error, handleDelete } = useFormHandlers<string>(userId, {
    onDelete: async (id) => {
      const run =
        customDeleteUser ??
        (async (uuid: string) => {
          await deleteUser(uuid, { mock: false })
        })
      await run(id)
    },
    /** 삭제 후처리 (리스트 리패치, 로깅 등) */
    onDeleted: () => {
      // 부모 테이블 즉시 반영
      onDeletedWithId?.(userId)
      onDeleted?.()
    },
    /** 모달 닫기 */
    onClose,
  })

  // [에러 토스트 위치]: 훅의 error가 갱신될 때 토스트를 띄우고 싶다면 여기서 처리
  useEffect(() => {
    if (error) {
      triggerToast('error', '삭제 실패', 'error')
    }
  }, [error, triggerToast])

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
