export type ClampArgs = { n: number; min: number; max: number }

export function clamp({ n, min, max }: ClampArgs) {
  return Math.max(min, Math.min(max, n))
}

export function range(start: number, end: number) {
  const out: number[] = []
  for (let i = start; i <= end; i++) out.push(i)
  return out
}

export function threeWindow(current: number, total: number) {
  if (total <= 3) return range(1, total)
  if (current <= 2) return [1, 2, 3]
  if (current >= total - 1) return [total - 2, total - 1, total]
  return [current - 1, current, current + 1]
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
