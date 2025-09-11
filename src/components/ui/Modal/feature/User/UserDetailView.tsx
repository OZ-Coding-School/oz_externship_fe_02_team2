import Field from '../../fields/Field'
import type { UserDetail } from './User.types'

export default function UserDetailView({
  m,
  editing,
  onChange,
}: {
  m: UserDetail
  editing: boolean
  onChange: (field: keyof UserDetail, value: string) => void
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
