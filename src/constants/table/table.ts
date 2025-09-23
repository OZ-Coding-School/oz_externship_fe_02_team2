import type { TableQuery } from '@/types/table'

export const DEFAULT_QUERY: TableQuery = {
  q: '',
  status: undefined,
  role: undefined,
  sortBy: null,
  sortDir: undefined,
  page: 1,
  pageSize: 20,
  search: '',
}

export const URL_PARAM_KEYS = {
  q: 'q',
  status: 'status',
  role: 'role',
  sort: 'sort',
  page: 'page',
  size: 'size',
} as const

export const DEFAULT_DEBOUNCE_MS = 300
