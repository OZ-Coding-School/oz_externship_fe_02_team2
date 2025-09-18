import { useCallback, useEffect, useState } from 'react'
import type { TableQuery, UseTableQueryOptions } from '@/types/table'
import { useSearchParams } from 'react-router-dom'
import { DEFAULT_DEBOUNCE_MS, DEFAULT_QUERY } from '@/constants/table/table'
import { useDebounceTimer } from './useDebounceTimer'
import {
  buildSearchParamsFromQuery,
  parseSearchParamsToQuery,
} from '@/components/table/queryString'

/**
 * 설계 개요
 * - q(검색어)만 트레일링 디바운스(기본 300ms). Enter/blur 등의 즉시 커밋은 immediate=true로 처리.
 * - status/role/sort/page 등은 즉시 반영. 이때 대기 중 q-디바운스는 모두 취소(clearDebounce)해 레이스/깜빡임 방지.
 * - URL 동기화는 변경점이 실제로 있을 때만 replace → 불필요한 히스토리/리렌더 최소화.
 */

export function useTableQuery(options: UseTableQueryOptions = {}) {
  const {
    initialQuery = {},
    onQueryChange,
    syncUrl = true,
    debounceMs = DEFAULT_DEBOUNCE_MS,
  } = options

  // q 전용 trailing 디바운스 타이머를 훅으로 분리
  const { schedule: scheduleDebounce, cancel: cancelDebounce } =
    useDebounceTimer(debounceMs)

  const [searchParams, setSearchParams] = useSearchParams()

  // URL에서 초기 상태 복원
  const getInitialQueryFromUrl = useCallback(
    (): TableQuery =>
      !syncUrl || !searchParams
        ? { ...DEFAULT_QUERY, ...initialQuery }
        : parseSearchParamsToQuery(searchParams, initialQuery),
    [searchParams, syncUrl, initialQuery]
  )

  const [query, setQuery] = useState<TableQuery>(getInitialQueryFromUrl)

  // URL 동기화
  const updateUrl = useCallback(
    (newQuery: TableQuery) => {
      if (!syncUrl) return
      const params = buildSearchParamsFromQuery(searchParams, newQuery)
      const next = params.toString()
      const curr = searchParams.toString()
      if (next !== curr) setSearchParams(params, { replace: true })
    },
    [setSearchParams, searchParams, syncUrl]
  )

  const updateQuery = useCallback(
    (updates: Partial<TableQuery>) => {
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
    (q: string, immediate: boolean = false) => {
      // 즉시 커밋 요청(Enter/Blur 등) → 대기 중 디바운스를 취소하고 바로 반영
      if (immediate) {
        cancelDebounce()
        updateQuery({ q })
        return
      }
      // trailing 디바운스: 입력이 멈춘 뒤 한 번만 반영
      scheduleDebounce(() => updateQuery({ q }))
    },
    [updateQuery, debounceMs, cancelDebounce]
  )

  const setStatus = useCallback(
    (status: string | null) => {
      cancelDebounce() // ← 대기 중 q 디바운스 취소
      updateQuery({ status })
    },
    [updateQuery, cancelDebounce]
  )

  const setRole = useCallback(
    (role: string | null) => {
      cancelDebounce()
      updateQuery({ role })
    },
    [updateQuery, cancelDebounce]
  )

  const setSort = useCallback(
    (sortBy: string | null, sortDir: TableQuery['sortDir'] = null) => {
      cancelDebounce // 정렬 변경도 즉시 반영. q 디바운스가 남아있으면 뒤늦게 덮어쓸 수 있음
      updateQuery({ sortBy, sortDir })
    },
    [updateQuery, cancelDebounce]
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
    cancelDebounce()
    const resetQuery = { ...DEFAULT_QUERY, ...initialQuery }
    setQuery(resetQuery)
    updateUrl(resetQuery)
    onQueryChange?.(resetQuery)
  }, [initialQuery, updateUrl, onQueryChange, cancelDebounce])

  const setPageSize = useCallback(
    (pageSize: number) => {
      cancelDebounce()
      updateQuery({ pageSize, page: 1 })
    },
    [updateQuery, cancelDebounce]
  )

  useEffect(() => {
    if (!syncUrl) return
    const fromUrl = getInitialQueryFromUrl()
    setQuery((prev) =>
      JSON.stringify(prev) === JSON.stringify(fromUrl) ? prev : fromUrl
    )
  }, [searchParams, getInitialQueryFromUrl, syncUrl])

  useEffect(
    () => () => {
      // 언마운트 시 디바운스 타이머 정리
      cancelDebounce()
    },
    [cancelDebounce]
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
