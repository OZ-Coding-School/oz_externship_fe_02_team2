import { useCallback, useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { EnhancedTableQuery, Maybe, TableQuery } from '@/types/table'
import { useDebounce } from '@/hooks/useDebounce'

export interface UseTableFiltersOptions {
  initialQuery?: Partial<EnhancedTableQuery>
  syncUrl?: boolean
  debounceMs?: number
  onQueryChange?: (query: TableQuery) => void
}

const DEFAULT_QUERY: TableQuery = {
  page: 1,
  pageSize: 10,
  search: '',
  status: undefined,
  role: undefined,
  sortBy: null,
  sortDir: 'asc',
}

function shallowEqualQuery(a: TableQuery, b: TableQuery): boolean {
  return (
    a.page === b.page &&
    a.pageSize === b.pageSize &&
    a.search === b.search &&
    a.status === b.status &&
    a.role === b.role &&
    a.sortBy === b.sortBy &&
    a.sortDir === b.sortDir
  )
}

export function useTableFilters(options: UseTableFiltersOptions = {}) {
  const {
    initialQuery = {},
    syncUrl = false,
    debounceMs = 300,
    onQueryChange,
  } = options

  const [searchParams, setSearchParams] = useSearchParams()

  // URL에서 초기값 복원(옵션일 때만)
  const initial: TableQuery = useMemo(() => {
    if (!syncUrl) return { ...DEFAULT_QUERY, ...initialQuery }
    return {
      ...DEFAULT_QUERY,
      ...initialQuery,
      page:
        Number(searchParams.get('page')) ||
        initialQuery.page ||
        DEFAULT_QUERY.page,
      pageSize:
        Number(searchParams.get('pageSize')) ||
        initialQuery.pageSize ||
        DEFAULT_QUERY.pageSize,
      search:
        searchParams.get('q') || initialQuery.search || DEFAULT_QUERY.search,
      status:
        (searchParams.get('status') as Maybe<string>) ?? initialQuery.status,
      role: (searchParams.get('role') as Maybe<string>) ?? initialQuery.role,
      sortBy:
        (searchParams.get('sortBy') as TableQuery['sortBy']) ??
        initialQuery.sortBy ??
        DEFAULT_QUERY.sortBy,
      sortDir:
        (searchParams.get('sortDir') as 'asc' | 'desc') ||
        initialQuery.sortDir ||
        DEFAULT_QUERY.sortDir,
    }
  }, [syncUrl, searchParams, initialQuery])

  const [query, setQuery] = useState<TableQuery>(initial)

  // 마지막으로 onQueryChange에 전달한 쿼리(중복 호출 방지)
  const lastSentRef = useRef<TableQuery>(initial)

  // 검색어만 디바운스: 항상 string이 되도록 보정
  const debouncedSearch = useDebounce(query.search ?? '', debounceMs)

  // URL 동기화
  const updateUrl = useCallback(
    (newQuery: TableQuery) => {
      if (!syncUrl) return

      // 안전한 기본값으로 정규화
      const page: number = newQuery.page ?? DEFAULT_QUERY.page
      const pageSize = newQuery.pageSize ?? DEFAULT_QUERY.pageSize
      const search = newQuery.search ?? DEFAULT_QUERY.search
      const status: Maybe<string> = newQuery.status ?? undefined
      const role: Maybe<string> = newQuery.role ?? undefined
      const sortBy: TableQuery['sortBy'] =
        newQuery.sortBy ?? DEFAULT_QUERY.sortBy
      const sortDir = String(newQuery.sortDir ?? DEFAULT_QUERY.sortDir)

      const params = new URLSearchParams()
      if (page > 1) params.set('page', String(page))
      if (pageSize !== DEFAULT_QUERY.pageSize)
        params.set('pageSize', String(pageSize))
      if (search) params.set('q', search)
      if (status) params.set('status', status)
      if (role) params.set('role', role)
      if (sortBy) params.set('sortBy', sortBy)
      if (sortDir !== DEFAULT_QUERY.sortDir) params.set('sortDir', sortDir)

      setSearchParams(params, { replace: true })
    },
    [syncUrl, setSearchParams]
  )

  // 외부로 변경 전파 (중복 방지)
  const callOnChange = useCallback(
    (next: TableQuery) => {
      if (!onQueryChange) return
      if (!shallowEqualQuery(next, lastSentRef.current)) {
        onQueryChange(next)
        lastSentRef.current = next
      }
    },
    [onQueryChange]
  )

  // 공통 업데이트 함수
  const updateQuery = useCallback(
    (newQuery: TableQuery, immediate = false) => {
      setQuery(newQuery)
      updateUrl(newQuery)

      if (immediate) {
        // 필터/페이지/정렬/Enter/blur → 즉시 반영
        callOnChange(newQuery)
      }
      // 타이핑 중 검색은 아래 debounced effect에서 반영
    },
    [updateUrl, callOnChange]
  )

  // 개별 setter
  const setSearch = useCallback(
    (search: string, immediate = false) => {
      const next: TableQuery = { ...query, search, page: 1 }
      updateQuery(next, immediate)
    },
    [query, updateQuery]
  )

  const setStatus = useCallback(
    (status: Maybe<string>) => {
      const next: TableQuery = { ...query, status, page: 1 }
      updateQuery(next, true)
    },
    [query, updateQuery]
  )

  const setRole = useCallback(
    (role: Maybe<string>) => {
      const next: TableQuery = { ...query, role, page: 1 }
      updateQuery(next, true)
    },
    [query, updateQuery]
  )

  const setPage = useCallback(
    (page: number) => {
      const next: TableQuery = { ...query, page }
      updateQuery(next, true)
    },
    [query, updateQuery]
  )

  const setPageSize = useCallback(
    (pageSize: number) => {
      const next: TableQuery = { ...query, pageSize, page: 1 }
      updateQuery(next, true)
    },
    [query, updateQuery]
  )

  const setSort = useCallback(
    (sortBy: string | null, sortDir: 'asc' | 'desc' = 'asc') => {
      const next: TableQuery = { ...query, sortBy, sortDir, page: 1 }
      updateQuery(next, true)
    },
    [query, updateQuery]
  )

  const reset = useCallback(() => {
    const next: TableQuery = { ...DEFAULT_QUERY, ...initialQuery }
    updateQuery(next, true)
  }, [initialQuery, updateQuery])

  // 디바운스된 검색어 반영해서 onQueryChange 호출
  useEffect(() => {
    if (!onQueryChange) return
    const debouncedQuery: TableQuery = { ...query, search: debouncedSearch }
    callOnChange(debouncedQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  // 초기 1회 호출 (URL 동기화가 아닌 경우만)
  useEffect(() => {
    if (!syncUrl && onQueryChange) {
      callOnChange(query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    query,
    setSearch,
    setStatus,
    setRole,
    setPage,
    setPageSize,
    setSort,
    reset,
    onQueryChange: {
      setSearch,
      setStatus,
      setRole,
      reset,
    },
  }
}
