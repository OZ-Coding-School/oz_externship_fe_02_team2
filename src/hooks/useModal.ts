import { useEffect, useLayoutEffect } from 'react'

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [active])
}

export function useEscClose(enabled: boolean, onClose: () => void) {
  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [enabled, onClose])
}

export function useFocusTrap(
  active: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
  initialFocus?: () => HTMLElement | null
) {
  useLayoutEffect(() => {
    if (!active) return
    const el = containerRef.current
    if (!el) return

    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ]
    const list = () =>
      Array.from(el.querySelectorAll<HTMLElement>(selectors.join(',')))

    const target = initialFocus?.() ?? list()[0] ?? el
    requestAnimationFrame(() => target?.focus())

    const handle = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const nodes = list()
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const activeEl = document.activeElement as HTMLElement | null
      if (e.shiftKey) {
        if (activeEl === first || !el.contains(activeEl)) {
          last.focus()
          e.preventDefault()
        }
      } else {
        if (activeEl === last) {
          first.focus()
          e.preventDefault()
        }
      }
    }
    el.addEventListener('keydown', handle)
    return () => el.removeEventListener('keydown', handle)
  }, [active, containerRef, initialFocus])
}
