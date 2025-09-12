import type { ReactNode } from 'react'

export type AccordionItem = {
  defaultIcon: string
  activeIcon: string
  label: string
  onClick?: () => void
  active?: boolean
}

export type AccordionProps = {
  icon: string
  label: string
  rail?: boolean // 사이드바 확장 여부 (≥md) true -> 접힘, false -> 확장
  items?: AccordionItem[]
  children?: ReactNode
}

export type AccordionContentProps = {
  iconOnly: boolean
  icon: string
  label: string
  labelClassName?: string
}
