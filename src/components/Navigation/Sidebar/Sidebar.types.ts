import type { ReactNode } from 'react'
import type { NavKey } from './nav/nav.types'

export type SidebarProps = {
  mobileDrawerOpen?: boolean
  onMobileDrawerOpenChange?: (open: boolean) => void
  scope?: 'viewport' | 'container' // viewport가 전체 화면, container는 테스트 페이지 위해 컨테이너 안에서만
}

export type SidebarHeaderProps = {
  title: string
  onClick: () => void
  buttonLabel: string
  compact?: boolean
}

export type DesktopAsideProps = {
  expanded: boolean
  onToggle: () => void
  children?: ReactNode // 아코디언 메뉴
  title?: string
}

export type MobileDrawerProps = {
  open: boolean
  onClose: () => void
  scope?: 'container' | 'viewport'
  children?: ReactNode // 아코디언 메뉴
  title?: string
}

export type SidebarNavProps = {
  expanded: boolean
  active: NavKey | null
  setActive: (k: NavKey) => void
  rail?: boolean
}
