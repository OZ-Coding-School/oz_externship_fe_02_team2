import type { ToastProps } from '@/types'
import {
  TOAST_DEFAULT_CONTENT,
  TOAST_DEFAULT_TITLE,
  TOAST_ICON,
  TOAST_STYLES,
} from './Toast.styles'

export function Toast(props: ToastProps) {
  const {
    type,
    title = TOAST_DEFAULT_TITLE[type],
    content = TOAST_DEFAULT_CONTENT[type],
  } = props
  const icon = TOAST_ICON[type]
  const styles = TOAST_STYLES[type]

  return (
    <div>
      <img src={icon} alt={`${TOAST_DEFAULT_TITLE} 아이콘`} />
      <div>
        <h6>{title}</h6>
        <p>{content}</p>
      </div>
    </div>
  )
}
