import { getButtonClass, getIconOnlyButtonClass } from './Button.styles'
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
      className={
        iconOnly
          ? getIconOnlyButtonClass(btnStyle, btnSize)
          : getButtonClass(btnStyle, btnSize)
      }
    >
      {btnIcon && <span>{btnIcon}</span>}
      {btnText && btnText}
    </button>
  )
}
