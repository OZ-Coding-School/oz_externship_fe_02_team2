import type { ReactNode } from 'react'
import { Button } from '../ui/Button'
import Burger from '@assets/icons/hamburger.svg'

type ActionbarProps = {
  title?: string
  onMenuClick: () => void
  rightSlot?: ReactNode
}

export default function Actionbar({
  title = '관리자 페이지',
  onMenuClick,
  rightSlot,
}: ActionbarProps) {
  return (
    <div className="fixed inset-x-0 top-0 z-40 h-14 border-b border-gray-400 bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur md:hidden">
      {/* pt-[env(safe-area-inset-top)]: iOS 노치(상단 영역) 회피용 패딩 */}
      <div className="flex h-full items-center gap-2 px-3">
        <Button
          btnSize="small"
          btnIcon={<img src={Burger} alt="메뉴 열기" />}
          className="hover:animate-spin-once bg-transparent p-0 hover:bg-transparent"
          onClick={onMenuClick}
          iconOnly
          aria-label="메뉴 열기"
        />
        <h3>{title}</h3>
        <div>{rightSlot}</div>
      </div>
    </div>
  )
}
