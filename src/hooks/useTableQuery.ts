import { useCallback, useEffect, useState, useRef } from 'react'
import type { TableQuery, UseTableQueryOptions } from '@/types/table'
import { useSearchParams } from 'react-router-dom'

/**
 * 설계 개요
 * - q(검색어)만 트레일링 디바운스(기본 300ms). Enter/blur 등의 즉시 커밋은 immediate=true로 처리.
 * - status/role/sort/page 등은 즉시 반영. 이때 대기 중 q-디바운스는 모두 취소(clearDebounce)해 레이스/깜빡임 방지.
 * - URL 동기화는 변경점이 실제로 있을 때만 replace → 불필요한 히스토리/리렌더 최소화.
 */

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
        // 얕은 비교 대신 JSON 문자열 비교를 쓰는 이유는 간결성 때문.
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
      // 즉시 커밋 요청(Enter/Blur 등) → 대기 중 디바운스를 취소하고 바로 반영
      if (immediate) {
        clearDebounce()
        updateQuery({ q })
        return
      }
      // trailing 디바운스: 입력이 멈춘 뒤 한 번만 반영
      clearDebounce()
      debounceRef.current = setTimeout(() => {
        updateQuery({ q })
      }, debounceMs)
    },
    [updateQuery, debounceMs, clearDebounce]
  )

  const setStatus = useCallback(
    (status: string | null) => {
      clearDebounce() // ← 대기 중 q 디바운스 취소: 뒤늦은 검색 커밋으로 URL/상태 흔들림 방지
      updateQuery({ status })
    },
    [updateQuery, clearDebounce]
  )

  const setRole = useCallback(
    (role: string | null) => {
      clearDebounce()
      updateQuery({ role })
    },
    [updateQuery, clearDebounce]
  )

  const setSort = useCallback(
    (sortBy: string | null, sortDir: TableQuery['sortDir'] = null) => {
      clearDebounce() // 정렬 변경도 즉시 반영. q 디바운스가 남아있으면 뒤늦게 덮어쓸 수 있음
      updateQuery({ sortBy, sortDir })
    },
    [updateQuery, clearDebounce]
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
      clearDebounce()
      updateQuery({ pageSize, page: 1 })
    },
    [updateQuery, clearDebounce]
  )

  useEffect(() => {
    if (!syncUrl) return
    const fromUrl = getInitialQueryFromUrl()
    setQuery((prev) =>
      JSON.stringify(prev) === JSON.stringify(fromUrl) ? prev : fromUrl
    )
    dbg('url sync check', { fromUrl })
  }, [searchParams, getInitialQueryFromUrl, syncUrl])

  useEffect(
    () => () => {
      // 언마운트 시 디바운스 타이머 정리
      clearDebounce()
    },
    [clearDebounce]
  )

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
