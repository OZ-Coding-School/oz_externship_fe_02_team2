import { useEffect, useState } from 'react'

export type ClampArgs = { n: number; min: number; max: number }

export function clamp({ n, min, max }: ClampArgs) {
  return Math.max(min, Math.min(max, n))
}

export function range(start: number, end: number) {
  const out: number[] = []
  for (let i = start; i <= end; i++) out.push(i)
  return out
}

export function visiblePageRange(
  current: number,
  total: number,
  blockSize: number
) {
  if (total <= blockSize) return range(1, total)
  const half = Math.floor(blockSize / 2)
  const start = clamp({ n: current - half, min: 1, max: total - blockSize + 1 })
  const end = start + blockSize - 1
  return range(start, end)
}

export function normalizeWindow(page: number, total: number, win: number[]) {
  const cleaned = Array.from(new Set(win))
    .map((n) => clamp({ n, min: 1, max: total }))
    .filter((n) => Number.isFinite(n))

  if (cleaned.length) return cleaned

  if (total <= 0) return []
  const start = clamp({ n: page - 1, min: 1, max: Math.max(1, total - 2) })
  const end = Math.min(total, start + 2)
  const out: number[] = []
  for (let i = start; i <= end; i++) out.push(i)
  return out
}

export const toInt = (v: unknown, fb = 1) => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.floor(n) : fb
}

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
    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [])
  return size
}
