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
      const path = (e.composedPath?.() ?? []) as EventTarget[]
      const isInside =
        (rootEl &&
          (path.includes(rootEl) || rootEl.contains(e.target as Node))) ??
        false
      if (!isInside) onOutside()
      if (!rootEl?.contains(e.target as Node)) (onEsc ?? onOutside)()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') (onEsc ?? onOutside)()
    }
    const opts: AddEventListenerOptions = { capture: true }
    document.addEventListener('pointerdown', onDown, opts)
    document.addEventListener('keydown', onKey, opts)
    return () => {
      document.removeEventListener('pointerdown', onDown, opts)
      document.removeEventListener('keydown', onKey, opts)
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
