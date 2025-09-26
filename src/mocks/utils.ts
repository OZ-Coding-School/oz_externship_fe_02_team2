export type SortOrder = 'asc' | 'desc'

export function toInt(v: string | null, fallback: number): number {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}

export function like(text: string, q: string): boolean {
  return text.toLowerCase().includes(q.toLowerCase())
}

export function sortByKey<T extends Record<string, unknown>>(
  rows: T[],
  key: string | undefined,
  order: SortOrder
): T[] {
  if (!key) return rows
  const sorted = [...rows].sort((a, b) => {
    const av = a[key]
    const bv = b[key]
    if (av === bv) return 0
    if (av == null) return -1
    if (bv == null) return 1
    if (typeof av === 'number' && typeof bv === 'number') return av - bv
    return String(av).localeCompare(String(bv))
  })
  return order === 'desc' ? sorted.reverse() : sorted
}

export type Paginated<T> = {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  sortBy?: string
  sortOrder?: SortOrder
}

export function paginate<T>(
  rows: T[],
  page: number,
  pageSize: number
): Paginated<T> {
  const total = rows.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const items = rows.slice(start, start + pageSize)
  return { items, page, pageSize, total, totalPages }
}

export const BASE_PATH = '/api/v1'
export const ADMIN = `${BASE_PATH}/admin`
