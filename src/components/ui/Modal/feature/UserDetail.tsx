import Modal from '../Modal'
import { Button } from '../../Button'
import { useState } from 'react'
import Field from '../fields/Field'
import UserRoleChange, { type UserRole } from './UserRoleChange'
import UserDelete from './UserDelete'

/** 도메인 타입 — 실제 필드/라벨 명칭에 맞게 수정 가능 */
export type MemberDetail = {
  id: string
  name: string
  email: string
  gender?: '남성' | '여성' | '기타'
  nickname?: string
  birth?: string // yyyy-mm-dd
  phone?: string
  role?: string
  status?: '활성' | '비활성'
  joinedAt?: string // ISO or display string
  avatarUrl?: string
}

/** 바디에 들어갈 “내용”만 분리 — 모달 외부에서도 단독 재사용 가능 */
function MemberDetailView({
  m,
  editing,
  onChange,
}: {
  m: MemberDetail
  editing: boolean
  onChange: (field: keyof MemberDetail, value: string) => void
}) {
  return (
    <div className="space-y-8">
      {/* 상단 프로필 영역 */}
      <div className="flex items-center gap-4">
        <img
          src={m.avatarUrl || 'https://placehold.co/80x80?text=👤'}
          alt={`${m.name} 프로필 이미지`}
          className="size-20 rounded-full object-cover"
        />
        <div>
          <h4>{m.name}</h4>
          <div className="text-gray-500">{m.email}</div>
        </div>
      </div>

      {/* 그리드 정보 폼 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="회원 ID"
          value={m.id}
          editing={editing}
          editable={false}
          onChange={(v) => onChange('id', v)}
        />
        <Field
          label="이메일"
          value={m.email}
          editing={editing}
          editable={false}
          onChange={(v) => onChange('email', v)}
        />
        <Field
          label="이름"
          value={m.name}
          editing={editing}
          editable
          onChange={(v) => onChange('name', v)}
        />
        <Field
          label="성별"
          value={m.gender}
          editing={editing}
          editable
          kind="select"
          options={['남성', '여성']}
          onChange={(v) => onChange('gender', v)}
        />
        <Field
          label="닉네임"
          value={m.nickname}
          editing={editing}
          editable
          onChange={(v) => onChange('nickname', v)}
        />
        <Field
          label="생년월일"
          value={m.birth}
          editing={editing}
          editable={false}
          onChange={(v) => onChange('birth', v)}
        />
        <Field
          label="연락처"
          value={m.phone}
          editing={editing}
          editable={false}
          onChange={(v) => onChange('phone', v)}
        />
        <Field
          label="권한"
          value={m.role}
          editing={editing}
          editable={false}
          onChange={(v) => onChange('role', v)}
        />
        <Field
          label="상태"
          value={m.status}
          editing={editing}
          editable
          kind="select"
          options={['활성', '비활성', '정지', '탈퇴요청']}
          onChange={(v) => onChange('status', v)}
        />
        <Field
          label="회원가입 일시"
          value={m.joinedAt}
          editing={editing}
          editable={false}
          onChange={(v) => onChange('joinedAt', v)}
        />
      </div>
    </div>
  )
}

/** 실제 모달 — 상단 우측 닫기 버튼 포함 */
export default function MemberDetailModal({
  open,
  onClose,
  data,
  onEdit,
}: {
  open: boolean
  onClose: () => void
  data: MemberDetail
  onEdit?: (m: MemberDetail) => void
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<MemberDetail>(data)
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // 실제 삭제 함수 (추후 API 연동)
  const deleteUser = async (userId: string) => {
    // TODO: 서버 API 호출로 교체
    // await api.delete(`/users/${userId}`)
    await new Promise((r) => setTimeout(r, 500)) // 데모용
  }

  const handleChange = (field: keyof MemberDetail, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onEdit?.(form)
    setEditing(false)
  }

  const handleCancel = () => {
    setForm(data)
    setEditing(false)
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
        <Modal.Title>회원 상세 정보</Modal.Title>
      </Modal.Header>
      <div className="border-b border-gray-200" />
      {/* Body */}
      <Modal.Body>
        <MemberDetailView m={form} editing={editing} onChange={handleChange} />
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
