import { Input } from '../../input/Input'
import Modal from '../Modal'
import { Button } from '../../Button'
import { useState } from 'react'
import { formatPhoneKR, validatePhoneKR } from '@/lib/phone'
// 너희 공용 컴포넌트 경로로 변경하세요.

/** 도메인 타입 예시 — 실제 필드/라벨 명칭에 맞게 수정 가능 */
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
          <div className="text-xl font-semibold">{m.name}</div>
          <div className="text-gray-500">{m.email}</div>
        </div>
      </div>

      {/* 그리드 정보 폼 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DetailField
          label="회원 ID"
          value={m.id}
          editing={editing}
          editable={false}
          onChange={(v) => onChange('id', v)}
        />
        <DetailField
          label="이메일"
          value={m.email}
          editing={editing}
          editable={false}
          onChange={(v) => onChange('email', v)}
        />
        <DetailField
          label="이름"
          value={m.name}
          editing={editing}
          editable
          onChange={(v) => onChange('name', v)}
        />
        <DetailField
          label="성별"
          value={m.gender}
          editing={editing}
          editable
          type="select"
          options={['남성', '여성']}
          onChange={(v) => onChange('gender', v)}
        />
        <DetailField
          label="닉네임"
          value={m.nickname}
          editing={editing}
          editable
          onChange={(v) => onChange('nickname', v)}
        />
        <DetailField
          label="생년월일"
          value={m.birth}
          editing={editing}
          editable={false}
          onChange={(v) => onChange('birth', v)}
        />
        <PhoneField
          label="연락처"
          value={m.phone}
          editing={editing}
          editable
          onChange={(v) => onChange('phone', v)}
        />
        <DetailField
          label="권한"
          value={m.role}
          editing={editing}
          editable={false}
          onChange={(v) => onChange('role', v)}
        />
        <DetailField
          label="상태"
          value={m.status}
          editing={editing}
          editable
          type="select"
          options={['활성', '비활성', '정지', '탈퇴요청']}
          onChange={(v) => onChange('status', v)}
        />
        <DetailField
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

/** 라벨/값 쌍 공용 셀 */
function DetailField({
  label,
  value,
  editing,
  editable = false,
  type = 'text',
  options,
  onChange,
}: {
  label: string
  value?: string | null
  editing: boolean
  editable?: boolean
  type?: 'text' | 'select'
  options?: string[]
  onChange: (val: string) => void
}) {
  const canEdit = editing && editable

  if (canEdit && type === 'select' && options) {
    const selectId = `${label.replace(/\s+/g, '-')}-select`

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={selectId} className="text-sm text-gray-600">
          {label}
        </label>
        <select
          id={selectId}
          className="ring-primary-200 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return canEdit ? (
    <Input
      label={label}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    />
  ) : (
    <Input
      label={label}
      defaultValue={value ?? '-'}
      onChange={() => {}}
      readOnly
      disabled
    />
  )
}

function PhoneField({
  label = '연락처',
  value,
  editing,
  editable = false,
  onChange,
}: {
  label?: string
  value?: string | null
  editing: boolean
  editable: boolean
  onChange: (val: string) => void
}) {
  const canEdit = editing && editable

  const val = value ?? ''
  const error =
    editing && val
      ? validatePhoneKR(val)
        ? ''
        : '올바른 전화번호 형식이 아닙니다'
      : ''
  return canEdit ? (
    <Input
      label={label}
      value={val}
      onChange={(e) => {
        const next = formatPhoneKR(e.target.value)
        onChange(next)
      }}
      type="tel"
      inputMode="numeric"
      pattern="[0-9\-]*"
      maxLength={13} // 예: 010-1234-5678
      error={error}
    />
  ) : (
    <Input
      label={label}
      defaultValue={val || '-'}
      onChange={() => {}}
      readOnly
      disabled
      type="tel"
    />
  )
}

/** 실제 모달 — 상단 우측 닫기 버튼 포함 */
export default function MemberDetailModal({
  open,
  onClose,
  data,
  onEdit,
  onDelete,
  onChangeRole,
}: {
  open: boolean
  onClose: () => void
  data: MemberDetail
  onEdit?: (m: MemberDetail) => void
  onDelete?: (m: MemberDetail) => void
  onChangeRole?: (m: MemberDetail) => void
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<MemberDetail>(data)

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

      {/* Footer */}
      <Modal.Footer>
        <div className="flex w-full justify-between">
          <Button
            btnStyle="success"
            btnText="권한 변경하기"
            onClick={() => onChangeRole?.(data)}
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
                  onClick={() => onDelete?.(data)}
                />
              </>
            )}
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  )
}
