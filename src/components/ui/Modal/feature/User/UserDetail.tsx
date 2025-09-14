import Modal from '../../Modal'
import { Button } from '../../../Button'
import { useEffect, useState } from 'react'
import UserRoleChange, { type UserRole } from './UserRoleChange'
import UserDelete from './UserDelete'
import type { UserDetail } from './User.types'
import UserDetailView from './UserDetailView'
import { useFormHandlers } from '@/hooks/useFormHandlers'

/** 도메인 타입 — 실제 필드/라벨 명칭에 맞게 수정 가능 */

/** 실제 모달 — 상단 우측 닫기 버튼 포함 */
export default function UserDetailModal({
  open,
  onClose,
  data,
  onEdit,
}: {
  open: boolean
  onClose: () => void
  data: UserDetail
  onEdit?: (m: UserDetail) => void
}) {
  const {
    form,
    setForm,
    editing,
    setEditing,
    handleChange,
    handleSave,
    handleCancel,
    resetForm,
  } = useFormHandlers<UserDetail>(data, { onEdit })

  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // 실제 삭제 함수 (추후 API 연동)
  //const deleteUser = async (userId: string) => {
  const deleteUser = async () => {
    // TODO: 서버 API 호출로 교체
    // await api.delete(`/users/${userId}`)
    await new Promise((r) => setTimeout(r, 500)) // 데모용
  }
  // data prop이 바뀔 때 form 동기화
  useEffect(() => {
    resetForm(data)
  }, [data, resetForm])

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
      </Modal.Body>

      <div className="border-b border-gray-200" />
      {/* Footer */}
      <Modal.Footer className="bg-gray-50 py-5">
        <div className="flex w-full justify-between">
          <Button
            btnStyle="success"
            btnText="권한 변경하기"
            onClick={() => setRoleModalOpen(true)}
          />

          <UserRoleChange
            open={roleModalOpen}
            value={(form.role as UserRole) || '일반회원'}
            onClose={() => setRoleModalOpen(false)}
            onConfirm={(nextRole) => {
              setForm((prev) => ({ ...prev, role: nextRole }))
            }}
          />
          <div className="flex gap-3">
            {editing ? (
              <>
                <Button
                  btnStyle="primary"
                  btnText="저장하기"
                  onClick={handleSave}
                />
                <Button
                  btnStyle="secondary"
                  btnText="취소"
                  onClick={handleCancel}
                />
              </>
            ) : (
              <>
                <Button
                  btnStyle="primary"
                  btnText="수정하기"
                  onClick={() => setEditing(true)}
                />
                <Button
                  btnStyle="danger"
                  btnText="삭제하기"
                  onClick={() => setDeleteOpen(true)}
                />
              </>
            )}
          </div>
        </div>
      </Modal.Footer>

      <UserDelete
        open={deleteOpen}
        userId={form.id}
        deleteUser={deleteUser}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => {
          // 삭제 성공 후, 토스트 띄우고 목록으로 복귀
          onClose()
        }}
      />
    </Modal>
  )
}
