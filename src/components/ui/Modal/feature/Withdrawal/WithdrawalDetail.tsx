import Modal from '../../Modal'
import { Button } from '../../../Button'
import { useFormHandlers } from '@/hooks/useFormHandlers'
import type { WithdrawalDetail } from './Withdrawal.types'
import { useEffect } from 'react'
import Skeleton from '@/components/ui/Skeleton'
import Field from '../../fields/Field'
import { formatDateTime } from '@/lib/datetime'

type WithdrawalProps = {
  open: boolean
  data?: WithdrawalDetail | null
  loading?: boolean
  errorText?: string | null
  onClose: () => void
  onRequestRestore?: (detail: WithdrawalDetail) => void
}

export default function WithdrawalModal({
  open,
  data,
  loading,
  errorText,
  onClose,
  onRequestRestore,
}: WithdrawalProps) {
  const { form, resetForm, restoring, handleRestore } =
    useFormHandlers<WithdrawalDetail>(
      (data as WithdrawalDetail) || ({} as WithdrawalDetail),
      { onRestore: onRequestRestore }
    )

  // 외부 data 변경 시 동기화
  useEffect(() => {
    if (data) resetForm(data)
  }, [data, resetForm])

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="none"
      className="w-[768px]"
      maxHeightClass=""
    >
      {/* Header */}
      <Modal.Header>
        <Modal.Title id="withdrawal-title">회원 탈퇴 상세 정보</Modal.Title>
      </Modal.Header>
      <div className="border-b border-gray-200" />

      {/* Body 1 */}
      <Modal.Header>
        <Modal.Title>회원 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0 pb-3">
        {loading && <Skeleton />}

        {!loading && errorText && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorText}
          </div>
        )}

        {!loading && !errorText && form && (
          <div className="space-y-8">
            {/* 상단 프로필 */}
            <div className="flex items-center gap-4">
              <img
                src={form.avatarUrl || 'https://placehold.co/80x80?text=👤'}
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
              {/* 회원 정보 */}

              {/* Field: 읽기전용 */}
              <Field
                label="이름"
                value={form.name}
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
                label="권한"
                value={form.role ?? ''}
                editing={false}
                onChange={() => {}}
              />
              <Field
                label="성별"
                value={form.gender ?? '미기입'}
                editing={false}
                onChange={() => {}}
              />
              {/* 상태는 커스텀 렌더 → 아래처럼 배지와 함께 별도 표현 */}
              <Field
                label="상태"
                value={form.status ?? ''}
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
                label="회원가입 일시"
                value={formatDateTime(form.joinedAt)}
                editing={false}
                onChange={() => {}}
              />
            </div>
          </div>
        )}
      </Modal.Body>

      {/* Body 1 */}
      {/* 탈퇴 정보 */}
      <Modal.Header className="pb-2">
        <Modal.Title>탈퇴 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="탈퇴요청 고유 ID"
            value={form.withdrawalRequestId ?? ''}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="탈퇴요청 일시"
            value={formatDateTime(form.requestedAt)}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="삭제 예정 일시"
            value={formatDateTime(form.scheduledDeletionAt)}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="탈퇴사유"
            value={form.reason ?? ''}
            editing={false}
            onChange={() => {}}
          />
        </div>
      </Modal.Body>

      <Modal.Body className="pt-0">
        {/* 상세사유는 멀티라인 표시 */}
        <Field
          label="탈퇴 상세 사유"
          value={form.reasonDetail || '-'}
          editing={false}
          onChange={() => {}}
        />
      </Modal.Body>

      <div className="border-b border-gray-200" />
      {/* Footer */}
      <Modal.Footer align="end" className="bg-gray-50">
        <Modal.Actions>
          <Button btnStyle="secondary" btnText="닫기" onClick={onClose} />
          <Button
            btnStyle="success"
            btnText={restoring ? '복구 중...' : '회원 복구하기'}
            onClick={handleRestore}
            disabled={!form || restoring}
            aria-disabled={!form || restoring}
          />
        </Modal.Actions>
      </Modal.Footer>
    </Modal>
  )
}
