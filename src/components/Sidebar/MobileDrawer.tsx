import { cn } from '@/lib'
import type { MobileDrawerProps } from './Sidebar.types'
import SidebarHeader from './SidebarHeader'

export default function MobileDrawer({
  open,
  onClose,
  scope = 'container',
  children,
  title = '관리자 패널',
}: MobileDrawerProps) {
  const posOverlay =
    scope === 'container' ? 'absolute inset-0' : 'fixed inset-0'
  const posPanel =
    scope === 'container'
      ? 'absolute inset-y-0 left-0'
      : 'fixed inset-y-0 left-0'

  return (
    <>
      {/* 오버레이 */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        className={cn(
          'fixed inset-0 bg-gray-600/50 transition-opacity duration-200 md:hidden',
          posOverlay,
          open ? 'z-50 opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!open}
      />
      {/* 패널 */}
      <aside
        className={cn(
          'z-60 h-screen w-[80vw] max-w-64 overflow-hidden bg-white md:hidden',
          'shadow-[inset_-1px_0_0_0_#e5e7eb] transition-transform duration-200',
          posPanel,
          open ? 'z-60 translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarHeader
          title={title}
          onClick={onClose}
          buttonLabel="메뉴 닫기"
        />
        <nav className="mb-2 w-full px-4">{children}</nav>
      </aside>
    </>
  )
}
