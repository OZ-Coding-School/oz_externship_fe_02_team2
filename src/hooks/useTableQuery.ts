import { useCallback, useEffect, useState, useRef } from 'react'
import type { TableQuery, UseTableQueryOptions } from '@/types/table'
import { useSearchParams } from 'react-router-dom'

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
  const DEBUG = true
  const dbg = (...args: any[]) => {
    if (DEBUG) console.log('[useTableQuery]', ...args)
  }

  const {
    initialQuery = {},
    onQueryChange,
    syncUrl = true,
    debounceMs = 300,
  } = options

  // q 전용 trailing 디바운스 타이머
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clearDebounce = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
  }, [])

  const [searchParams, setSearchParams] = useSearchParams()

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

      const qTrim = newQuery.q.trim()

      if (qTrim) params.set('q', qTrim)
      if (newQuery.status) params.set('status', newQuery.status)
      if (newQuery.role) params.set('role', newQuery.role)
      if (newQuery.sortBy && newQuery.sortDir) {
        params.set('sort', `${newQuery.sortBy}.${newQuery.sortDir}`)
      }
      if (newQuery.page > 1) params.set('page', newQuery.page.toString())
      if (newQuery.pageSize !== DEFAULT_QUERY.pageSize) {
        params.set('size', newQuery.pageSize.toString())
      }
      // 실제로 변경점이 없으면 건너뜀(불필요한 리렌더/깜빡임 방지)
      const next = params.toString()
      const curr = searchParams.toString()
      if (next !== curr) {
        setSearchParams(params, { replace: true })
      }
    },
    [setSearchParams, searchParams, syncUrl]
  )

  const updateQuery = useCallback(
    (updates: Partial<TableQuery>) => {
      dbg('update: immediate', { updates })
      setQuery((prevQuery) => {
        const nextDraft = { ...prevQuery, ...updates }
        // 변경 없음이면 스킵 → 불필요 렌더/URL 동기화 방지(깜빡임 감소)
        if (JSON.stringify(nextDraft) === JSON.stringify(prevQuery)) {
          return prevQuery
        }
        const newQuery = nextDraft
        // 검색어가 바뀌면 1페이지로
        if ('q' in updates && (updates.q ?? '') !== (prevQuery.q ?? '')) {
          newQuery.page = 1
        }
        updateUrl(newQuery)
        onQueryChange?.(newQuery)
        return newQuery
      })
    },
    [updateUrl, onQueryChange]
  )

  // 개별 액션들
  const setSearch = useCallback(
    (q: string, immediate = false) => {
      dbg('setSearch()', { q, immediate })
      // 즉시 커밋 요청(Enter/Blur/조합 종료 등) => 대기 중 디바운스 취소 후 즉시 반영
      if (immediate) {
        clearDebounce()
        updateQuery({ q })
        return
      }
      // trailing 디바운스 (타자 멈춘 뒤 한 번만)
      clearDebounce()
      debounceRef.current = setTimeout(() => {
        updateQuery({ q })
      }, debounceMs)
    },
    [updateQuery, debounceMs, clearDebounce]
  )

  const setStatus = useCallback(
    (status: string | null) => {
      updateQuery({ status })
    },
    [updateQuery]
  )

  const setRole = useCallback(
    (role: string | null) => {
      updateQuery({ role })
    },
    [updateQuery]
  )

  const setSort = useCallback(
    (sortBy: string | null, sortDir: TableQuery['sortDir'] = null) => {
      updateQuery({ sortBy, sortDir })
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
    (page: number) => {
      updateQuery({ page })
    },
    [updateQuery]
  )

  const reset = useCallback(() => {
    if (debounceRef.current) {
      dbg('reset(): clear pending debounce')
      clearTimeout(debounceRef.current)
    }
    clearDebounce()
    dbg('reset(): restore to DEFAULT initialQuery')
    const resetQuery = { ...DEFAULT_QUERY, ...initialQuery }
    setQuery(resetQuery)
    updateUrl(resetQuery)
    onQueryChange?.(resetQuery)
  }, [initialQuery, updateUrl, onQueryChange, clearDebounce])

  const setPageSize = useCallback(
    (pageSize: number) => {
      updateQuery({ pageSize, page: 1 })
    },
    [updateQuery]
  )

  useEffect(() => {
    if (!syncUrl) return
    const fromUrl = getInitialQueryFromUrl()
    setQuery((prev) =>
      JSON.stringify(prev) === JSON.stringify(fromUrl) ? prev : fromUrl
    )
    dbg('url sync check', { fromUrl })
  }, [searchParams, getInitialQueryFromUrl, syncUrl])

  useEffect(() => () => clearDebounce(), [clearDebounce])

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
