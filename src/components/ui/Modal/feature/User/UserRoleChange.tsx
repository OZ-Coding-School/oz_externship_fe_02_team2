import { useEffect, useState } from 'react'
import Modal from '../../Modal'
import { Button } from '../../../Button'
import { cn } from '@/lib'

export type UserRole = '관리자' | '스태프' | '일반회원'

type UserRoleProps = {
  open: boolean
  /** 현재 권한 */
  value: UserRole
  /** 해당 롤 누를 시, 선택 권한 전달 */
  onConfirm: (nextRole: UserRole) => void
  /** 닫기 */
  onClose: () => void
  /** 저장 중 로딩 상태 ( 쓸 일 거의 없을 거 같음 ) */
  confirming?: boolean
}

const ROLE_OPTIONS: UserRole[] = ['관리자', '스태프', '일반회원']
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
          {ROLE_OPTIONS.map((role) => {
            const isSelected = selected === role
            return (
              <Button
                key={role}
                btnStyle="secondary"
                btnSize="large"
                btnText={role}
                className={cn(
                  ROLE_SELECTED.base,
                  isSelected ? ROLE_SELECTED.selected : ROLE_SELECTED.default
                )}
                disabled={confirming}
                onClick={() => {
                  setSelected(role)
                  onConfirm(role)
                  onClose()
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
