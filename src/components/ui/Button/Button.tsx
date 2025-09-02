import { cn } from '@lib/utils'
import {
  buttonSizes,
  buttonStyles,
  commonStyles,
  iconOnlyButtonSizes,
  iconOnlyButtonStyles,
} from './Button.styles'
import type { ButtonProps } from './Button.types'

export default function Button(props: ButtonProps) {
  const {
    btnStyle = 'primary',
    btnSize = 'medium',
    btnIcon,
    btnText,
    iconOnly,
    onClick,
    disabled,
  } = props

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        commonStyles,
        iconOnly ? iconOnlyButtonStyles[btnStyle] : buttonStyles[btnStyle],
        iconOnly ? iconOnlyButtonSizes[btnSize] : buttonSizes[btnSize]
      )}
    >
      {btnIcon && btnIcon}
      {btnText && btnText}
    </button>
  )
}
