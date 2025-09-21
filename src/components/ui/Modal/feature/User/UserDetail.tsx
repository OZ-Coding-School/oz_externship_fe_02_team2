import Modal from '../../Modal'
import { Button } from '../../../Button'
import { useEffect, useState } from 'react'
import UserRoleChange, { type UserRole } from './UserRoleChange'
import UserDelete from './UserDelete'
import type { UserDetail } from './User.types'
import UserDetailView from './UserDetailView'
import { useToast } from '@/hooks'
import { updateUser } from '@/api/modules/users'
import { useUserFormHandlers } from './useUserFormHandlers'

interface UserDetailModalProps {
  open: boolean
  onClose: () => void
  data: UserDetail
  onEdit?: (updatedUser: UserDetail) => void
  onDeleted?: () => void
  onDeletedWithId?: (userId: string) => void
}

/** 실제 모달 — 상단 우측 닫기 버튼 포함 */
export default function UserDetailModal({
  open,
  onClose,
  data,
  onEdit,
  onDeletedWithId,
}: UserDetailModalProps) {
  const { triggerToast } = useToast()
  const {
    form,
    setForm,
    editing,
    setEditing,
    loading,
    error,
    handleChange,
    handleSave,
    handleCancel,
    resetForm,
    handleDelete,
  } = useUserFormHandlers(data, {
    onServerUpdated: (latest) => {
      // 모달 내부 동기화
      setForm(latest)
      // 부모 테이블 즉시 반영
      onEdit?.(latest)
    },
  })

  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [roleChanging, setRoleChanging] = useState(false)

  // data prop이 바뀔 때 form 동기화
  useEffect(() => {
    resetForm(data)
  }, [data, resetForm])

  // 권한 변경 처리
  const handleRoleChange = async (nextRole: UserRole) => {
    setRoleChanging(true)
    try {
      // 실제 API 호출을 통한 권한 변경
      const updatedUser = await updateUser(
        form.id,
        { role: nextRole },
        { mock: true }
      )

      // 로컬 상태 업데이트
      setForm(updatedUser)

      // 부모 컴포넌트에 변경사항 알림
      onEdit?.(updatedUser)

      // 성공 토스트
      triggerToast(
        'success',
        '권한 변경 완료',
        `권한이 ${nextRole}로 변경되었습니다.`
      )
      setRoleModalOpen(false)
    } catch (error) {
      console.error('권한 변경 실패:', error)
      triggerToast(
        'error',
        '권한 변경 실패',
        '권한 변경 중 오류가 발생했습니다'
      )
    } finally {
      setRoleChanging(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        handleCancel()
        onClose()
      }}
      size="default"
    >
      {/* Header */}
      <Modal.Header>
        <Modal.Title id="user-title">회원 상세 정보</Modal.Title>
      </Modal.Header>
      <div className="border-b border-gray-200" />

      {/* Body */}
      <Modal.Body>
        <UserDetailView m={form} editing={editing} onChange={handleChange} />
        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
            <p className="body-sm text-red-600">{error}</p>
          </div>
        )}
      </Modal.Body>

      <div className="border-b border-gray-200" />
      {/* Footer */}
      <Modal.Footer className="bg-gray-50 py-5">
        <div className="flex w-full justify-between">
          <Button
            btnStyle="success"
            btnText={roleChanging ? '권한 변경 중...' : '권한 변경하기'}
            onClick={() => setRoleModalOpen(true)}
            disabled={loading || roleChanging || editing}
          />

          <UserRoleChange
            open={roleModalOpen}
            value={(form.role as UserRole) || '일반회원'}
            onClose={() => setRoleModalOpen(false)}
            onConfirm={handleRoleChange}
            confirming={roleChanging}
          />
          <div className="flex gap-3">
            {editing ? (
              <>
                <Button
                  btnStyle="primary"
                  btnText={loading ? '저장 중...' : '저장하기'}
                  onClick={handleSave}
                  disabled={loading}
                />
                <Button
                  btnStyle="secondary"
                  btnText="취소"
                  onClick={handleCancel}
                  disabled={loading}
                />
              </>
            ) : (
              <>
                <Button
                  btnStyle="primary"
                  btnText="수정하기"
                  onClick={() => {
                    setEditing(true)
                  }}
                  disabled={loading || roleChanging}
                />
                <Button
                  btnStyle="danger"
                  btnText="삭제하기"
                  onClick={() => setDeleteOpen(true)}
                  disabled={loading || roleChanging}
                />
              </>
            )}
          </div>
        </div>
      </Modal.Footer>

      <UserDelete
        open={deleteOpen}
        userId={form.id}
        deleteUser={async () => {
          await handleDelete()
        }}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => {
          onClose()
        }}
        onDeletedWithId={onDeletedWithId}
      />
    </Modal>
  )
}
