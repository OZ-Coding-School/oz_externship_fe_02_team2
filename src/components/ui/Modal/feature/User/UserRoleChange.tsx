import { useEffect, useState } from 'react'
import Modal from '../../Modal'
import { Button } from '../../../Button'
import { cn } from '@/lib'
import { PERMISSION_OPTIONS } from '@lib/userDisplayHelpers'

export type UserRole = 'ADMIN' | 'STAFF' | 'GENERAL'

type UserRoleProps = {
  open: boolean
  /** 현재 권한 */
  value: UserRole
  /** 권한 변경 확정 (비동기 가능) */
  onConfirm: (nextRole: UserRole) => Promise<void> | void
  /** 닫기 */
  onClose: () => void
  /** 저장 중 로딩 상태 */
  confirming?: boolean
}

const ROLE_SELECTED = {
  base: 'w-full justify-start rounded-2xl px-5 py-4',
  default:
    'text-primary-text bg-white shadow-[inset_0_0_0_1px_#e5e7eb] hover:bg-gray-50',
  selected: 'text-primary-blue bg-[#EFF6FF] shadow-[inset_0_0_0_1px_#93c5fd]',
} as const

export default function UserRoleChange({
  open,
  value,
  onConfirm,
  onClose,
  confirming = false,
}: UserRoleProps) {
  const [selected, setSelected] = useState<UserRole>(value)

  // 열릴 때마다 현재 값으로 세팅
  useEffect(() => {
    if (open) setSelected(value)
  }, [open, value])

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="w-[448px]"
      showCloseIcon={false}
    >
      <Modal.Header>
        <Modal.Title>권한 변경</Modal.Title>
      </Modal.Header>

      <Modal.Body className="py-0">
        <div className="space-y-3">
          {PERMISSION_OPTIONS.map(({ label, value: roleValue }) => {
            const isSelected = selected === roleValue
            return (
              <Button
                key={roleValue}
                btnStyle="secondary"
                btnSize="large"
                btnText={label}
                className={cn(
                  ROLE_SELECTED.base,
                  isSelected ? ROLE_SELECTED.selected : ROLE_SELECTED.default
                )}
                disabled={confirming}
                onClick={async () => {
                  setSelected(roleValue)
                  // onConfirm이 완료될 때까지 대기
                  await Promise.resolve(onConfirm(roleValue))
                  // onConfirm이 성공한 후에만 닫기
                  // onClose()는 여기서 호출하지 않음 (부모에서 처리)
                }}
              />
            )
          })}
        </div>
      </Modal.Body>

      <Modal.Footer align="end" className="mt-0">
        <div className="flex gap-2">
          <Button
            btnStyle="secondary"
            btnText="취소"
            onClick={onClose}
            disabled={confirming}
          />
        </div>
      </Modal.Footer>
    </Modal>
  )
}
