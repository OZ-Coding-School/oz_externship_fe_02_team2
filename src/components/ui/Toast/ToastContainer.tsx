import { useDebounce } from '@/hooks'
import { useToastStore } from '@/store'
import type { ToastProps } from '@/types'
import { useEffect, useState } from 'react'
import { Toast } from './Toast'

export function ToastContainer() {
  const [renderedToasts, setRenderedToasts] = useState<ToastProps[]>([])
  const { toasts } = useToastStore()
  const debouncedToasts = useDebounce(toasts, 200)

  useEffect(() => {
    setRenderedToasts(debouncedToasts)
  }, [debouncedToasts])

  return (
    <div className="fixed inset-x-0 top-8 z-100 flex flex-col items-center gap-y-3">
      {renderedToasts.map(({ id, type, title, content }) => (
        <Toast key={id} id={id} type={type} title={title} content={content} />
      ))}
    </div>
  )
}
