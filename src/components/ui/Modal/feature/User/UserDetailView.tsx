import { useState } from 'react'
import Field from '../../fields/Field'
import type { UserDetail } from './User.types'
import ProfileCrop from '@/components/ui/Modal/parts/ProfileCrop'
export default function UserDetailView({
  m,
  editing,
  onChange,
}: {
  m: UserDetail
  editing: boolean
  onChange: (field: keyof UserDetail, value: string) => void
}) {
  const [cropOpen, setCropOpen] = useState(false)

  const avatar = m.avatarUrl || 'https://placehold.co/80x80?text=👤'

  return (
    <div className="space-y-8">
      {/* 상단 프로필 영역 */}
      <div className="flex items-center gap-4">
        {editing ? (
          <button
            type="button"
            onClick={() => setCropOpen(true)}
            aria-label="프로필 이미지 변경"
            title="프로필 이미지 변경"
            className="group focus-visible:ring-primary-500 relative size-20 overflow-hidden rounded-full ring-1 ring-gray-200 transition outline-none hover:opacity-95 focus-visible:ring-2"
          >
            {/* 실제 아바타 */}
            <img
              src={avatar}
              alt={`${m.name} 프로필 이미지`}
              className="h-full w-full object-cover"
              draggable={false}
            />

            {/* 하이라이트 링 (hover/focus 시만 진하게) */}
            <span
              aria-hidden
              className="group-hover:ring-primary-500/70 group-focus-visible:ring-primary-500/80 pointer-events-none absolute inset-0 rounded-full ring-2 ring-transparent transition"
            />

            {/* 글로우 (부드러운 빛 번짐) */}
            <span
              aria-hidden
              className="bg-primary-400/30 pointer-events-none absolute -inset-1 rounded-full opacity-0 blur-md transition-opacity group-hover:opacity-60 group-focus-visible:opacity-70"
            />

            {/* 덮개 오버레이: '변경' + 연필 아이콘 (hover/focus에서만) */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden items-center justify-center rounded-full bg-black/35 text-xs font-medium text-white group-hover:flex group-focus-visible:flex"
            >
              변경
              <svg
                viewBox="0 0 24 24"
                className="ml-1 size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
            </span>

            {/* (옵션) 오른쪽 아래 '수정' 배지 — 항상 보이게 하고 싶으면 남겨둠 */}
            {/* <span className="pointer-events-none absolute -right-0.5 -bottom-0.5 rounded-full bg-primary-500 text-white text-[10px] leading-none px-1.5 py-1 shadow">
      수정
    </span> */}
          </button>
        ) : (
          <img
            src={avatar}
            alt={`${m.name} 프로필 이미지`}
            className="size-20 rounded-full object-cover"
            draggable={false}
          />
        )}

        <div>
          <h4>{m.name}</h4>
          <div className="text-gray-500">{m.email}</div>
        </div>
      </div>

      {/* 크롭 모달 */}
      <ProfileCrop
        open={cropOpen}
        initialSrc={m.avatarUrl || 'https://placehold.co/300x300?text=👤'}
        onClose={() => setCropOpen(false)}
        onConfirm={({ previewURL /*, blob*/ }) => {
          // 즉시 부모 상태에 반영 (서버 없이 미리보기 URL 사용)
          onChange('avatarUrl', previewURL)
          setCropOpen(false)

          // TODO: API 연결 시 여기서 blob 업로드 후, 서버가 준 최종 URL로 다시 onChange 호출
          // const fd = new FormData()
          // fd.append('file', blob, 'avatar.png')
          // const { url } = await api.user.updateAvatar(m.id, fd)
          // onChange('avatarUrl', url)
        }}
        // react-image-crop 버전 ProfileCrop props
        aspect={1}
        size={300}
      />

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
