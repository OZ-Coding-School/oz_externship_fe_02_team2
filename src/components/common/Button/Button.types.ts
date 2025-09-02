import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonStyle =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'cancel' // wireframe의 닫기/취소 버튼용

export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  btnStyle?: ButtonStyle
  btnSize?: ButtonSize
  btnIcon?: ReactNode
  btnText?: string
  isIconOnly?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
}
