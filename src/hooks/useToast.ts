import { useToastStore } from '@/store'
import type { ToastProps } from '@/types'

const TIMEOUT = 3000

export function useToast() {
  const { addToast, removeToast } = useToastStore()

  const triggerToast = (
    type: ToastProps['type'],
    title: ToastProps['title'],
    content: ToastProps['content']
  ) => {
    const uniqueId = Date.now() * 10000 + Math.floor(Math.random() * 10000)
    const newToast = { id: uniqueId, type, title, content }

    addToast(newToast)

    setTimeout(() => {
      removeToast(newToast.id)
    }, TIMEOUT)
  }

  return { triggerToast }
}
