import type { ToastStyle } from '@/components/ui/Toast/Toast.types'

export interface ToastProps {
  id: number
  type: ToastStyle
  title: string
  content: string
}

export interface ToastStore {
  toasts: ToastProps[]
  addToast: (newToast: ToastProps) => void
  removeToast: (id: number) => void
}
