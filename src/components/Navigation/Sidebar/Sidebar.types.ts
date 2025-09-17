import type { ReactNode } from 'react'

export type SidebarProps = {
  mobileDrawerOpen?: boolean
  onMobileDrawerOpenChange?: (open: boolean) => void
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
  children?: ReactNode // 아코디언 메뉴
  title?: string
}

export type SidebarNavProps = {
  expanded: boolean
  active: string
  setActive: (k: string) => void
  rail?: boolean
}
