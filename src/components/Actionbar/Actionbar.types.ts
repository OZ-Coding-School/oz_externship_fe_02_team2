import type { ReactNode } from 'react'

export type ActionbarProps = {
  title?: string
  onMenuClick: () => void
  rightSlot?: ReactNode
}
