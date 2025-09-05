import { cn } from '@/lib/cn'
import {
  BUTTON_COMMON_STYLES,
  BUTTON_SIZES,
  BUTTON_STYLES,
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
    className,
    onClick,
    disabled,
  } = props

  return (
    <button
      type="button"
      aria-label={`${btnStyle} button`}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        BUTTON_COMMON_STYLES,
        iconOnly ? ICON_ONLY_BUTTON_STYLES[btnStyle] : BUTTON_STYLES[btnStyle],
        iconOnly ? ICON_ONLY_BUTTON_SIZES[btnSize] : BUTTON_SIZES[btnSize],
        className
      )}
    >
      {btnIcon && btnIcon}
      {btnText && btnText}
    </button>
  )
}
