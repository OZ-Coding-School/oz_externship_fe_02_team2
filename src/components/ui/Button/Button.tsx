import { cn } from '@lib/utils'
import {
  BUTTON_SIZES,
  BUTTON_STYLES,
  COMMON_STYLES,
  ICON_ONLY_BUTTON_SIZES,
  ICON_ONLY_BUTTON_STYLES,
} from './Button.styles'
import type { ButtonProps } from '@/types/button'

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
        COMMON_STYLES,
        iconOnly ? ICON_ONLY_BUTTON_STYLES[btnStyle] : BUTTON_STYLES[btnStyle],
        iconOnly ? ICON_ONLY_BUTTON_SIZES[btnSize] : BUTTON_SIZES[btnSize]
      )}
    >
      {btnIcon && btnIcon}
      {btnText && btnText}
    </button>
  )
}
