import { useCallback, useEffect, useRef } from 'react'

export function useDebounceTimer(defaultMs: number) {
  const ref = useRef<number | null>(null)

  const cancel = useCallback(() => {
    if (ref.current != null) {
      clearTimeout(ref.current)
      ref.current = null
    }
  }, [])

  const schedule = useCallback(
    (fn: () => void, ms: number = defaultMs) => {
      cancel()
      ref.current = window.setTimeout(() => {
        ref.current = null
        fn()
      }, ms)
    },
    [cancel, defaultMs]
  )

  const pending = useCallback(() => ref.current != null, [])

  useEffect(() => () => cancel(), [cancel])

  return { schedule, cancel, pending }
}
