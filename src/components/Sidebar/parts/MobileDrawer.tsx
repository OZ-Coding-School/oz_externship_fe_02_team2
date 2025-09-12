import { cn } from '@/lib'
import type { MobileDrawerProps } from '../Sidebar.types'
import SidebarHeader from './SidebarHeader'
import { COMMON_NAV_STYLE, COMMON_PANEL_STYLE } from '../Sidebar.styles'

export default function MobileDrawer({
  open,
  onClose,
  scope = 'container',
  children,
  title = '관리자 패널',
}: MobileDrawerProps) {
  const positionByScope = scope === 'container' ? 'absolute' : 'fixed'

  return (
    <>
      {/* 오버레이 */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        className={cn(
          'fixed inset-0 inset-y-0 left-0 z-50 bg-gray-600/50 transition-opacity duration-200 md:hidden',
          positionByScope,
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!open}
      />
      {/* 패널 */}
      <aside
        className={cn(
          COMMON_PANEL_STYLE,
          'inset-y-0 left-0 w-[80vw] max-w-64 transition-transform duration-200 md:hidden',
          positionByScope,
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarHeader
          title={title}
          onClick={onClose}
          buttonLabel="메뉴 닫기"
        />
        <nav className={cn(COMMON_NAV_STYLE, 'px-4')}>{children}</nav>
      </aside>
    </>
  )
}
