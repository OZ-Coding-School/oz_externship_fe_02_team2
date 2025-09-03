import type { ToastStyle } from '@/components/ui/Toast/Toast.types'

export interface ToastProps {
  id: number | string
  type: ToastStyle
  title: string
  content: string
}
