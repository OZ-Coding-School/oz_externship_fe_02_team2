import { useCallback, useEffect, useState, useRef } from 'react'
import type { TableQuery, UseTableQueryOptions } from '@/types/table'
import { useSearchParams } from 'react-router'

const DEFAULT_QUERY: TableQuery = {
  q: '',
  status: null,
  role: null,
  sortBy: null,
  sortDir: null,
  page: 1,
  pageSize: 20,
}

export function useTableQuery(options: UseTableQueryOptions = {}) {
  const {
    initialQuery = {},
    onQueryChange,
    syncUrl = true,
    debounceMs = 300,
  } = options
  const [searchParams, setSearchParams] = useSearchParams()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // URL에서 초기 상태 복원
  const getInitialQueryFromUrl = useCallback((): TableQuery => {
    if (!syncUrl || !searchParams) return { ...DEFAULT_QUERY, ...initialQuery }

    const urlQuery: Partial<TableQuery> = {}

    const q = searchParams.get('q')
    if (q) urlQuery.q = q

    const status = searchParams.get('status')
    if (status && status !== 'all') urlQuery.status = status

    const role = searchParams.get('role')
    if (role && role !== 'all') urlQuery.role = role

    const sort = searchParams.get('sort')
    if (sort) {
      const [sortBy, sortDir] = sort.split('.')
      urlQuery.sortBy = sortBy
      urlQuery.sortDir = sortDir === 'desc' ? 'desc' : 'asc'
    }

    const page = searchParams.get('page')
    if (page) {
      const pageNum = parseInt(page, 10)
      if (!isNaN(pageNum) && pageNum > 0) {
        urlQuery.page = pageNum
      }
    }

    const size = searchParams.get('size')
    if (size) {
      const s = parseInt(size, 10)
      if (!isNaN(s) && s > 0) urlQuery.pageSize = s
    }

    return { ...DEFAULT_QUERY, ...initialQuery, ...urlQuery }
  }, [searchParams, syncUrl, initialQuery])

  const [query, setQuery] = useState<TableQuery>(getInitialQueryFromUrl)

  // URL 동기화
  const updateUrl = useCallback(
    (newQuery: TableQuery) => {
      if (!syncUrl) return

      const params = new URLSearchParams(searchParams)
      ;['q', 'status', 'role', 'sort', 'page', 'size'].forEach((k) =>
        params.delete(k)
      )

      if (newQuery.q) params.set('q', newQuery.q)
      if (newQuery.status) params.set('status', newQuery.status)
      if (newQuery.role) params.set('role', newQuery.role)
      if (newQuery.sortBy && newQuery.sortDir) {
        params.set('sort', `${newQuery.sortBy}.${newQuery.sortDir}`)
      }
      if (newQuery.page > 1) params.set('page', newQuery.page.toString())
      if (newQuery.pageSize !== DEFAULT_QUERY.pageSize) {
        params.set('size', newQuery.pageSize.toString())
      }

      // router.replace 대신 setSearchParams를 사용합니다.
      setSearchParams(params, { replace: true })
    },
    [setSearchParams, searchParams, syncUrl]
  )

  // 쿼리 업데이트 (디바운스 포함)
  const updateQuery = useCallback(
    (updates: Partial<TableQuery>, immediate = false) => {
      const newQuery = { ...query, ...updates }

      // 페이지 리셋 조건
      if ('q' in updates || 'status' in updates || 'role' in updates) {
        newQuery.page = 1
      }

      setQuery(newQuery)

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      const executeUpdate = () => {
        updateUrl(newQuery)
        onQueryChange?.(newQuery)
      }

      if (immediate || !('q' in updates)) {
        executeUpdate()
      } else {
        debounceRef.current = setTimeout(executeUpdate, debounceMs)
      }
    },
    [query, updateUrl, onQueryChange, debounceMs]
  )

  // 개별 액션들
  const setSearch = useCallback(
    (q: string) => updateQuery({ q }),
    [updateQuery]
  )

  const setStatus = useCallback(
    (status: string | null) => updateQuery({ status }, true),
    [updateQuery]
  )

  const setRole = useCallback(
    (role: string | null) => updateQuery({ role }, true),
    [updateQuery]
  )

  const setSort = useCallback(
    (sortBy: string | null, sortDir: TableQuery['sortDir'] = null) => {
      updateQuery({ sortBy, sortDir }, true)
    },
    [updateQuery]
  )

  const toggleSort = useCallback(
    (column: string) => {
      if (query.sortBy !== column) {
        setSort(column, 'asc')
      } else if (query.sortDir === 'asc') {
        setSort(column, 'desc')
      } else {
        setSort(null, null)
      }
    },
    [query.sortBy, query.sortDir, setSort]
  )

  const setPage = useCallback(
    (page: number) => updateQuery({ page }, true),
    [updateQuery]
  )

  const reset = useCallback(() => {
    const resetQuery = { ...DEFAULT_QUERY, ...initialQuery }
    setQuery(resetQuery)
    updateUrl(resetQuery)
    onQueryChange?.(resetQuery)
  }, [initialQuery, updateUrl, onQueryChange])

  // 클린업
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const setPageSize = useCallback(
    (pageSize: number) => updateQuery({ pageSize, page: 1 }, true),
    [updateQuery]
  )

  useEffect(() => {
    if (!syncUrl) return
    const fromUrl = getInitialQueryFromUrl()
    setQuery((prev) =>
      JSON.stringify(prev) === JSON.stringify(fromUrl) ? prev : fromUrl
    )
  }, [searchParams, getInitialQueryFromUrl, syncUrl])

  return {
    query,
    setSearch,
    setStatus,
    setRole,
    setSort,
    toggleSort,
    setPage,
    reset,
    updateQuery,
    setPageSize,
  }
}
