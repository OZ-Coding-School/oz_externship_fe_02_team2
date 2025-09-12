import { cn } from '@/lib'
import type { DesktopAsideProps } from '../Sidebar.types'
import { COMMON_NAV_STYLE, COMMON_PANEL_STYLE } from '../Sidebar.styles'
import Header from './Header'

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
      <Header
        title={title}
        onClick={onToggle}
        buttonLabel={expanded ? '사이드바 접기' : '사이드바 펼치기'}
        compact={!expanded}
      />
      <nav className={cn(COMMON_NAV_STYLE, expanded ? 'px-4' : 'px-2')}>
        {children}
      </nav>
    </aside>
  )
}
