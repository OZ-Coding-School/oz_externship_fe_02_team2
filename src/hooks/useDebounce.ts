import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handleTimeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handleTimeout)
    }
  }, [value, delay])

  return debouncedValue
}
