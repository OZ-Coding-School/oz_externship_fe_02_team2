import { cn } from '@/lib'
import type { DesktopAsideProps } from './Sidebar.types'
import SidebarHeader from './SidebarHeader'

export default function DesktopAside({
  expanded,
  onToggle,
  children,
  title = '관리자 패널',
}: DesktopAsideProps) {
  return (
    <aside
      className={cn(
        'z-60 hidden h-screen overflow-hidden bg-white md:block',
        'shadow-[inset_-1px_0_0_0_#e5e7eb] transition-[width] duration-200',
        expanded ? 'w-64' : 'w-18'
      )}
    >
      <SidebarHeader
        title={title}
        onClick={onToggle}
        buttonLabel={expanded ? '사이드바 접기' : '사이드바 펼치기'}
        compact={!expanded}
      />
      <nav className={cn('mb-2 w-full', expanded ? 'px-4' : 'px-2')}>
        {children}
      </nav>
    </aside>
  )
}
