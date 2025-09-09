import { cn } from '@/lib'
import type { DesktopAsideProps } from './Sidebar.types'
import SidebarHeader from './SidebarHeader'
import { COMMON_PANEL_STYLE } from './Sidebar.styles'

export default function DesktopAside({
  expanded,
  onToggle,
  children,
  title = '관리자 패널',
}: DesktopAsideProps) {
  return (
    <aside
      className={cn(
        COMMON_PANEL_STYLE,
        'hidden transition-[width] duration-200 md:block',
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
