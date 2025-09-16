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
      setSearchParams(params, { replace: true })
    },
    [setSearchParams, searchParams, syncUrl]
  )

  // 쿼리 업데이트 (디바운스 포함)
  const updateQuery = useCallback(
    // `query` 의존성을 제거하기 위해 함수형 업데이트 사용
    (updates: Partial<TableQuery>, immediate = false) => {
      // 디바운스 타이머가 있다면 즉시 클리어
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      const performUpdate = () => {
        setQuery((prevQuery) => {
          const newQuery = { ...prevQuery, ...updates }
          // 페이지 리셋 조건
          if ('q' in updates && !immediate && (updates.q ?? '').trim() !== '') {
            newQuery.page = 1
          }

          // 실제 업데이트 실행 (URL 동기화, 콜백 호출)
          updateUrl(newQuery)
          onQueryChange?.(newQuery)

          return newQuery
        })
      }

      // `q`가 업데이트되고, 즉시 실행이 아니며, 비어있지 않은 경우에만 디바운스 적용
      if (
        'q' in updates &&
        !immediate &&
        updates.q &&
        updates.q.trim() !== ''
      ) {
        debounceRef.current = setTimeout(performUpdate, debounceMs)
      } else {
        // 그 외 모든 경우는 즉시 실행
        performUpdate()
      }
    },
    [updateUrl, onQueryChange, debounceMs] // `query` 의존성 제거로 함수 안정성 확보
  )

  // 개별 액션들
  const setSearch = useCallback(
    (q: string, immediate = false) => {
      // `immediate` 플래그를 updateQuery로 전달
      updateQuery({ q }, immediate)
    },
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
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
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
