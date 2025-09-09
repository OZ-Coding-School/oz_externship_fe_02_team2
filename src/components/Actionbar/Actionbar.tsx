import { Button } from '@components/ui/Button'
import Burger from '@assets/icons/hamburger.svg'
import type { ActionbarProps } from './Actionbar.types'

export default function Actionbar({
  title = '관리자 페이지',
  onMenuClick,
  rightSlot,
}: ActionbarProps) {
  return (
    <div className="sticky top-0 z-40 h-14 overflow-hidden border-b border-gray-200 bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur select-none md:hidden">
      {/* pt-[env(safe-area-inset-top)]: iOS 노치(상단 영역) 회피용 패딩 */}
      <div className="flex h-full items-center gap-4 px-4">
        <Button
          btnSize="small"
          btnIcon={<img src={Burger} alt="메뉴 열기" />}
          className="hover:animate-spin-once bg-transparent p-0 hover:bg-transparent"
          onClick={onMenuClick}
          iconOnly
          aria-label="메뉴 열기"
        />
        <h3 className="truncate">{title}</h3>
        <div className="ml-auto">{rightSlot}</div>
      </div>
    </div>
  )
}
