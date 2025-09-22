import type { TableQuery } from '@/types/table'
import { DEFAULT_QUERY, URL_PARAM_KEYS } from '@/constants/table/table'

export function parseSearchParamsToQuery(
  searchParams: URLSearchParams,
  initial: Partial<TableQuery> = {}
): TableQuery {
  if (!searchParams) return { ...DEFAULT_QUERY, ...initial }
  const urlQuery: Partial<TableQuery> = {}

  const q = searchParams.get(URL_PARAM_KEYS.q)
  if (q) urlQuery.q = q

  const status = searchParams.get(URL_PARAM_KEYS.status)
  if (status && status !== 'all') urlQuery.status = status

  const role = searchParams.get(URL_PARAM_KEYS.role)
  if (role && role !== 'all') urlQuery.role = role

  const sort = searchParams.get(URL_PARAM_KEYS.sort)
  if (sort) {
    const [sortBy, sortDir] = sort.split('.')
    if (sortBy) urlQuery.sortBy = sortBy
    if (sortDir) urlQuery.sortDir = sortDir === 'desc' ? 'desc' : 'asc'
  }

  const page = searchParams.get(URL_PARAM_KEYS.page)
  if (page) {
    const n = parseInt(page, 10)
    if (!isNaN(n) && n > 0) urlQuery.page = n
  }

  const size = searchParams.get(URL_PARAM_KEYS.size)
  if (size) {
    const s = parseInt(size, 10)
    if (!isNaN(s) && s > 0) urlQuery.pageSize = s
  }

  return { ...DEFAULT_QUERY, ...initial, ...urlQuery }
}

export function buildSearchParamsFromQuery(
  prev: URLSearchParams,
  q: TableQuery
): URLSearchParams {
  const params = new URLSearchParams(prev)
  Object.values(URL_PARAM_KEYS).forEach((k) => params.delete(k))

  const qTrim = (q.q ?? '').trim()
  if (qTrim) params.set(URL_PARAM_KEYS.q, qTrim)
  if (q.status) params.set(URL_PARAM_KEYS.status, q.status)
  if (q.role) params.set(URL_PARAM_KEYS.role, q.role)
  if (q.sortBy && q.sortDir)
    params.set(URL_PARAM_KEYS.sort, `${q.sortBy}.${q.sortDir}`)
  if (q.page > DEFAULT_QUERY.page)
    params.set(URL_PARAM_KEYS.page, String(q.page))
  if (q.pageSize !== DEFAULT_QUERY.pageSize)
    params.set(URL_PARAM_KEYS.size, String(q.pageSize))
  return params
}
