import { useEffect } from 'react'
import { Button } from '../../../Button'
import Modal from '../../Modal'
import { useFormHandlers } from '@/hooks/useFormHandlers'

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
  const descId = 'user-delete-desc'

  const { loading, error, setError, handleDelete } = useFormHandlers<string>(
    userId,
    {
      onDelete: async (id) => {
        await deleteUser(id)
        // [성공 토스트 위치 1/2]: API 삭제 자체가 성공했을 때
        // TODO: toast.success('회원이 삭제되었습니다.')
      },
      /** 삭제 후처리 (리스트 리패치, 로깅 등) */
      onDeleted: () => {
        onDeleted?.()
        // [성공 토스트 위치 2/2]: 후처리까지 끝났을 때
        // TODO: toast.success('삭제가 완료되었습니다.')
      },
      /** 모달 닫기 */
      onClose,
    }
  )

  // ❗ [에러 토스트 위치]: 훅의 error가 갱신될 때 토스트를 띄우고 싶다면 여기서 처리
  useEffect(() => {
    if (error) {
      // TODO: toast.error(error)
    }
  }, [error])

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
            onClick={async () => {
              // 기존 handleDelete는 내부에서 로딩/에러/후처리/닫기까지 수행
              try {
                await handleDelete()
              } catch (e) {
                // 예외적으로 여기서도 캐치가 필요하면 메시지 커스터마이징 가능
                setError(`${e}, 삭제 중 오류 발생!! 잠시 후 다시 시도해주세요.`)
                // ❗ [에러 토스트 위치(대안)]: 버튼 클릭 컨텍스트에서 바로 토스트
                // TODO: toast.error('삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
              }
            }}
            disabled={loading}
          />
        </div>
      </Modal.Footer>
    </Modal>
  )
}
