import type { ButtonSize, ButtonStyle } from '@/components/ui/Button'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  btnStyle?: ButtonStyle
  btnSize?: ButtonSize
  btnIcon?: ReactNode
  btnText?: string
  iconOnly?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
}
