import { formatDateTime } from '@/lib/datetime'
import Field from '../../fields/Field'
import Modal from '../../Modal'
import type { WithdrawalDetail } from './Withdrawal.types'
import { memo } from 'react'

type Props = {
  form: WithdrawalDetail
}

function WithdrawalUserViewBase({ form }: Props) {
  return (
    <>
      {/* Header */}
      <Modal.Header className="pb-2">
        <Modal.Title>회원 정보</Modal.Title>
      </Modal.Header>

      {/* Body */}
      <Modal.Body className="pt-0 pb-3">
        <div className="space-y-8">
          {/* 상단 프로필 */}
          <div className="mb-5 flex items-center gap-4">
            <img
              src={form.profile_img_url || 'https://placehold.co/80x80?text=👤'}
              alt={`${form.name ?? ''} 프로필 이미지`}
              className="size-20 rounded-full object-cover"
            />
            <div>
              <h4 className="text-lg font-semibold">{form.name ?? '-'}</h4>
              <div className="text-gray-500">{form.email ?? '-'}</div>
            </div>
          </div>

          {/* 그리드 정보 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              label="이름"
              value={form.name ?? ''}
              editing={false}
              onChange={() => {}}
            />
            <Field
              label="성별"
              value={form.gender ?? '미기입'}
              editing={false}
              onChange={() => {}}
            />
            <Field
              label="닉네임"
              value={form.nickname ?? ''}
              editing={false}
              onChange={() => {}}
            />
            <Field
              label="이메일"
              value={form.email ?? ''}
              editing={false}
              onChange={() => {}}
            />
            <Field
              label="권한"
              value={form.permission ?? ''}
              editing={false}
              onChange={() => {}}
            />
            <Field
              label="상태"
              value={form.status ?? ''}
              editing={false}
              onChange={() => {}}
            />
            <Field
              label="회원가입 일시"
              value={formatDateTime(form.user_joined_at)}
              editing={false}
              onChange={() => {}}
            />
          </div>
        </div>
      </Modal.Body>
    </>
  )
}

const WithdrawalUserView = memo(WithdrawalUserViewBase)
export default WithdrawalUserView
