import React, { useMemo } from 'react'
import { TableFilterBar } from './feature/TableFilterBar'
import type {
  TableFilterConfig,
  TableData,
  TableQuery,
  UseTableQueryOptions,
} from '@/types/table'
import { useTableQuery } from '@/hooks/useTableQuery'

export type TableWithFiltersProps<T = Record<string, any>> = {
  /** 테이블 데이터 (client mode) 또는 현재 페이지 데이터 (server mode) */
  data: T[] | TableData<T>
  /** 필터 설정 */
  config: TableFilterConfig
  /** 클라이언트 모드에서 검색할 필드들 */
  searchFields?: (keyof T)[]
  /** 테이블 렌더링 함수 */
  renderTable: (data: TableData<T>) => React.ReactNode
  /** 페이지네이션 렌더링 함수 */
  renderPagination?: (
    data: TableData<T>,
    onPageChange: (page: number) => void
  ) => React.ReactNode
  /** 서버 모드에서 데이터 로딩 상태 */
  loading?: boolean
  /** 추가 필터 컴포넌트 */
  children?: React.ReactNode
  className?: string
  onQueryChange?: (query: TableQuery) => void | Promise<void>
  clientFilterKeys?: {
    status?: keyof T
    role?: keyof T
  }
  /** 쿼리 훅 동작 제어(초기값/URL동기화/디바운스) */
  queryOptions?: Pick<
    UseTableQueryOptions,
    'initialQuery' | 'syncUrl' | 'debounceMs'
  >
}

function filterTableData<T extends Record<string, unknown>>(
  raw: T[],
  q: TableQuery,
  fields: (keyof T)[],
  filterKeys: { status?: keyof T; role?: keyof T } = {}
): TableData<T> {
  let items = raw

  // 1) 검색
  if (fields.length) {
    const rawKw = q.q.trim().toLowerCase()
    if (rawKw) {
      const at = rawKw.indexOf('@')
      const startsWithAt = at === 0 // '@...' 형태
      const normKw = at >= 0 ? rawKw.slice(0, at).trim() : rawKw
      if (startsWithAt) {
        // '@'로 시작하는 입력은 도메인 검색 의도로 보고 결과 없음
        items = []
      } else if (normKw) {
        const norm = (v: unknown): string => {
          const s = String(v ?? '').toLowerCase()
          // 셀 값도 로컬파트만 비교
          return s.includes('@') ? s.split('@')[0] : s
        }
        items = items.filter((row) =>
          fields.some((f) => norm(row[f as keyof T]).includes(normKw))
        )
      }
      // normKw가 빈 문자열이면(공백만 입력 등) 검색 필터 미적용
    }
  }
  // 2) 상태/권한 필터 (지정된 키로만)
  const { status: statusKey, role: roleKey } = filterKeys
  if (q.status && statusKey) {
    const want = String(q.status).toLowerCase()
    items = items.filter(
      (row) => String(row[statusKey] ?? '').toLowerCase() === want
    )
  }
  if (q.role && roleKey) {
    const want = String(q.role).toLowerCase()
    items = items.filter(
      (row) => String(row[roleKey] ?? '').toLowerCase() === want
    )
  }

  // 3) 정렬
  if (q.sortBy && q.sortDir) {
    const dir = q.sortDir === 'desc' ? -1 : 1
    const key = q.sortBy as keyof T
    items = [...items].sort((a, b) => {
      const av = a[key] as any
      const bv = b[key] as any
      if (av == null && bv == null) return 0
      if (av == null) return -1 * dir
      if (bv == null) return 1 * dir
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
  }

  // 4) 페이징 (필터/정렬 끝난 뒤)
  const total = items.length
  const start = (q.page - 1) * q.pageSize
  const paged = items.slice(start, start + q.pageSize)

  return {
    items: paged,
    total,
    page: q.page,
    pageSize: q.pageSize,
    totalPages: Math.max(1, Math.ceil(total / q.pageSize)),
  }
}

export function TableWithFilters<T extends Record<string, any>>({
  data,
  config,
  searchFields = [],
  renderTable,
  renderPagination,
  loading = false,
  children,
  className,
  onQueryChange,
  clientFilterKeys,
  queryOptions,
}: TableWithFiltersProps<T>) {
  const queryActions = useTableQuery({
    // 서버 모드일 때만 훅에 전달
    onQueryChange: config.mode === 'server' ? onQueryChange : undefined,
    ...(queryOptions ?? {}),
  })

  // 데이터 처리
  const tableData = useMemo((): TableData<T> => {
    if (config.mode === 'server') {
      // 서버 모드: 이미 처리된 데이터를 받음
      if (Array.isArray(data)) {
        // 단순 배열이면 기본 구조로 변환
        return {
          items: data,
          total: data.length,
          page: queryActions.query.page,
          pageSize: queryActions.query.pageSize,
          totalPages: Math.ceil(data.length / queryActions.query.pageSize),
        }
      }
      return data as TableData<T>
    } else {
      // 클라이언트 모드: 필터링/정렬/페이지네이션 처리
      const rawData = Array.isArray(data) ? data : data.items
      return filterTableData(
        rawData,
        queryActions.query,
        searchFields,
        clientFilterKeys ?? {}
      )
    }
  }, [data, queryActions.query, config.mode, searchFields, clientFilterKeys])

  return (
    <div className={className}>
      {/* 필터 바 */}
      <TableFilterBar
        query={queryActions.query}
        onQueryChange={{
          setSearch: queryActions.setSearch,
          setStatus: queryActions.setStatus,
          setRole: queryActions.setRole,
          reset: queryActions.reset,
        }}
        config={config}
      >
        {children}
      </TableFilterBar>

      {/* 로딩 상태 */}
      {loading && (
        <div
          className="flex items-center justify-center py-8"
          role="status"
          aria-live="polite"
        >
          <div className="border-primary-500 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
          <span className="ml-2 text-gray-600">로딩 중...</span>
        </div>
      )}

      {/* 테이블 */}
      {!loading && renderTable(tableData)}

      {/* 페이지네이션 */}
      {!loading &&
        renderPagination &&
        renderPagination(tableData, queryActions.setPage)}
    </div>
  )
}
