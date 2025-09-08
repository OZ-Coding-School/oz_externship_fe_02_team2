import React, { useEffect, type RefObject } from 'react'
import { scrollChildIntoViewNearest } from './Dropdown.dom'

export function useOutsideClickAndEsc(
  open: boolean,
  rootRef: React.RefObject<HTMLElement | null>,
  onOutside: () => void,
  onEsc?: () => void
) {
  useEffect(() => {
    if (!open) return
    const rootEl = rootRef.current
    const onDown = (e: MouseEvent) => {
      if (!rootEl?.contains(e.target as Node)) onOutside()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOutside()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, rootRef, onOutside, onEsc])
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
  }, [open, ref])
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
  }, [open, activeIndex, containerRef])
}
