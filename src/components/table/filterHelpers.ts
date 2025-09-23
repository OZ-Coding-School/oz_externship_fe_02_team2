import type { TableQuery } from '@/types/table'
export function countActiveFilters(q: TableQuery) {
  let c = 0
  if ((q.q ?? '').trim()) c++
  if (q.status) c++
  if (q.role) c++
  return c
}
