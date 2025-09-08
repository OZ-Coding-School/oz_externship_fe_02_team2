import { useEffect, type RefObject } from 'react'

export function useOutsideClickAndEsc(
  open: boolean,
  rootRef: RefObject<HTMLElement | null>,
  onOutside: () => void,
  onEsc?: () => void
) {
  useEffect(() => {
    if (!open) return
    const rootEl = rootRef.current
    const onDown = (e: PointerEvent) => {
      if (!rootEl?.contains(e.target as Node)) (onEsc ?? onOutside)()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') (onEsc ?? onOutside)()
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onOutside, onEsc])
}

export function useAutoFocusWhenOpen(
  open: boolean,
  ref: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!open) return
    const el = ref.current
    if (!el) return
    queueMicrotask(() => el.focus({ preventScroll: true }))
  }, [open])
}

export function useKeepActiveVisible(
  open: boolean,
  containerRef: RefObject<HTMLElement | null>,
  activeIndex?: number
) {
  useEffect(() => {
    if (!open || activeIndex == null || activeIndex < 0) return
    const container = containerRef.current
    if (!container) return
    const el = container.children[activeIndex] as HTMLElement | undefined
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollIntoView({ block: 'nearest' })
    })
  }, [open, activeIndex])
}
