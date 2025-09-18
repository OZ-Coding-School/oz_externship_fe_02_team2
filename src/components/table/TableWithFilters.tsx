import React, { useMemo } from 'react'
import { TableFilterBar } from './feature/TableFilterBar'
import type {
  TableFilterConfig,
  TableData,
  TableQuery,
  UseTableQueryOptions,
} from '@/types/table'
import { useTableQuery } from '@/hooks/useTableQuery'
import { filterTableData } from '@/lib/tableFiltering'

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
      // 서버 모드: 이미 처리된 페이지 데이터를 받는 경우.
      // 서버 페치 시엔 useTableQuery의 디바운스/URL 동기화 전략만 공유하고, 목록 가공은 서버가 담당.
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
      // 클라이언트 모드: 필터링/정렬/페이지네이션 처리 (lib로 분리)
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
