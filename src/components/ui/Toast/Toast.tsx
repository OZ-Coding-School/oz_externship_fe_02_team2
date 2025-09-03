import type { ToastProps } from '@/types'
import {
  TOAST_COMMON_STYLES,
  TOAST_DEFAULT_CONTENT,
  TOAST_DEFAULT_TITLE,
  TOAST_ICON,
  TOAST_STYLES,
} from './Toast.styles'
import { cn } from '@/lib'

export function Toast(props: ToastProps) {
  const {
    type,
    title = TOAST_DEFAULT_TITLE[type],
    content = TOAST_DEFAULT_CONTENT[type],
  } = props
  const icon = TOAST_ICON[type]
  const iconAlt = `${TOAST_DEFAULT_TITLE[type]} 아이콘`
  const styles = TOAST_STYLES[type]

  return (
    <div className={cn(TOAST_COMMON_STYLES, styles.border, styles.bg)}>
      <img src={icon} alt={iconAlt} />
      <div>
        <h6 className={styles.title}>{title}</h6>
        <p className={styles.content}>{content}</p>
      </div>
    </div>
  )
}
