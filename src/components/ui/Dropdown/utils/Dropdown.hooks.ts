import { useEffect } from 'react'
import { scrollChildIntoViewNearest } from './Dropdown.dom'

export function useOutsideClickAndEsc(
  open: boolean,
  rootEl: HTMLElement | null,
  onOutside: () => void,
  onEsc?: () => void
) {
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!rootEl?.contains(e.target as Node)) onOutside()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEsc ? onEsc() : onOutside()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, rootEl, onOutside, onEsc])
}

export function useAutoFocusWhenOpen<T extends HTMLElement>(
  open: boolean,
  el: T | null
) {
  useEffect(() => {
    if (open) setTimeout(() => el?.focus(), 0)
  }, [open, el])
}

export function useKeepActiveVisible(
  open: boolean,
  listEl: HTMLElement | null,
  activeIndex: number
) {
  useEffect(() => {
    if (!open || activeIndex < 0) return
    scrollChildIntoViewNearest(listEl, activeIndex)
  }, [open, activeIndex, listEl])
}
