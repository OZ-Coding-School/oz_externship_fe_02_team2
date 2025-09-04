import { useEffect, useState } from 'react'

export default function useResponsivePageSize() {
  const get = () => {
    if (typeof window === 'undefined') return 5
    return window.matchMedia('(min-width: 1024px)').matches ? 10 : 5
  }
  const [size, setSize] = useState<number>(get)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia('(min-width: 1024px)')
    const listener = (e: MediaQueryListEvent) => setSize(e.matches ? 10 : 5)
    setSize(mql.matches ? 10 : 5)
    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [])
  return size
}
