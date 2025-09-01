import getButtonClass from './Button.styles'
import type { ButtonProps } from './Button.types'

export default function Button(props: ButtonProps) {
  const {
    btnStyle = 'primary',
    btnSize = 'medium',
    btnIcon,
    btnText,
    onClick,
    disabled,
  } = props

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={getButtonClass(btnStyle, btnSize)}
    >
      {btnIcon && <span>{btnIcon}</span>}
      {btnText && btnText}
    </button>
  )
}
