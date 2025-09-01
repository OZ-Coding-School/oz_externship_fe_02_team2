import type { ButtonProps } from './Button.types'

export default function Button(props: ButtonProps) {
  const {
    btnStyle = 'primary',
    btnSize = 'medium',
    btnIcon,
    btnText,
    onClick,
  } = props

  return (
    <button type="button" onClick={onClick} className="">
      {btnIcon && <span>{btnIcon}</span>}
      {btnText && btnText}
    </button>
  )
}
