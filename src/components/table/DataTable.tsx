import type { Column, TableMeta, TableState, SortState } from '@type/table'
import { cls } from '@/lib/table'
import Pagination from '../ui/Pagination/Pagination'
import { isValidElement, useCallback, useEffect, useMemo } from 'react'
import { makeComparer, type Getter } from './sort'
import SortIcon from './SortIcon'

type MobileKeep = 'all' | number

type TableProps<T> = {
  columns?: Column<T>[]
  data?: T[]
  state: TableState
  onStateChange?: (next: Partial<TableState>) => void
  meta: TableMeta<T>
  toolbar?: React.ReactNode
  footerExtra?: React.ReactNode

  mobileKeepCols?: MobileKeep
  stickyHeader?: boolean
  nowrapCells?: boolean
  wrapCells?: boolean
  onRowClick?: (row: T, index: number) => void
}

function toNode(v: unknown): React.ReactNode {
  if (v == null) return null

  // 이미 React 엘리먼트면 그대로
  if (isValidElement(v)) return v

  // 원시 타입
  if (
    typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'bigint' ||
    typeof v === 'boolean'
  ) {
    return String(v)
  }

  // 배열(Iterable) → 각 요소를 재귀 변환
  if (Array.isArray(v)) {
    return v.map(toNode)
  }

  // 함수/Promise 등 ReactNode 불가 타입은 문자열 등으로 안전 변환
  if (typeof v === 'function') return String(v)
  if (v instanceof Promise) return null // 또는 '...'

  // 그 외 객체(Date 등)
  return String(v)
}

export function DataTable<T>({
  columns,
  data,
  state,
  onStateChange,
  meta,
  footerExtra,
  stickyHeader = true,
  nowrapCells = true,
  wrapCells = false,
  onRowClick,
}: TableProps<T>) {
  const safeCols = useMemo(
    () => (Array.isArray(columns) ? columns : []),
    [columns]
  )
  const safeData = useMemo(() => (Array.isArray(data) ? data : []), [data])
  const visibleCols = useMemo(
    () => safeCols.filter((c) => !c.hidden),
    [safeCols]
  )

  const { page, pageSize, sort } = state ?? {
    page: 1,
    pageSize: 10,
    sort: null,
  }

  const isClientSort = meta?.enableClientSort !== false
  const isClientPaging = meta?.clientPaging === true
  const alwaysShowPagination = meta?.alwaysShowPagination === true

  // --- 정렬 파이프라인 (asc/desc) ---
  const getSortGetter = useCallback(
    (col: Column<T> | undefined): Getter<T> | null => {
      if (!col) return null
      if (col.sortAccessor) return col.sortAccessor as Getter<T>
      if (typeof col.accessor === 'function') return col.accessor as Getter<T>
      if (col.accessor) {
        const key = col.accessor as keyof T
        return (row: T) => row[key]
      }
      return null
    },
    []
  )

  const sortedData = useMemo(() => {
    if (!isClientSort || !sort) return safeData
    const col = safeCols.find((c) => c.id === sort.id && c.sortable)
    if (!col) return safeData

    const getter = getSortGetter(col)
    if (!getter) return safeData

    const withIdx = safeData.map((row, i) => ({ row, i }))
    withIdx.sort(makeComparer(getter, Boolean(sort.desc)))
    return withIdx.map((x) => x.row)
  }, [isClientSort, sort, safeCols, safeData, getSortGetter])

  // --- 페이지네이션 파이프라인 ---
  const start = (page - 1) * pageSize
  const end = start + pageSize

  const renderData = useMemo(() => {
    if (isClientPaging) return sortedData.slice(start, end)
    return sortedData
  }, [isClientPaging, sortedData, start, end])

  const computedTotalPages = useMemo(() => {
    if (isClientPaging) {
      return Math.max(1, Math.ceil(sortedData.length / pageSize))
    }
    return Math.max(1, Number(meta?.totalPages ?? 1))
  }, [isClientPaging, sortedData.length, pageSize, meta?.totalPages])

  useEffect(() => {
    if (page > computedTotalPages) onStateChange?.({ page: computedTotalPages })
  }, [page, computedTotalPages, onStateChange])

  const rowKey = meta?.rowKey ?? ((_: T, i: number) => i)

  // --- 정렬 핸들러 (asc/desc toggle) ---
  const handleSort = (col: Column<T>) => {
    if (!col.sortable || !onStateChange) return
    let next: SortState = null

    if (!sort || sort.id !== col.id) {
      next = { id: col.id, desc: false } // 오름차순
    } else if (!sort.desc) {
      next = { id: col.id, desc: true } // 내림차순
    } else {
      next = null // 초기화
    }
    onStateChange({ sort: next })
  }

  const showPagination = alwaysShowPagination || computedTotalPages > 1

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto">
          <thead
            className={cls(
              'bg-gradient-to-r from-gray-50 to-gray-100/80',
              stickyHeader && 'sticky top-0 z-10'
            )}
          >
            <tr>
              {visibleCols.map((col) => {
                const isSorted = !!sort && sort.id === col.id
                const iconState: 'none' | 'asc' | 'desc' = !isSorted
                  ? 'none'
                  : sort!.desc
                    ? 'desc'
                    : 'asc'

                return (
                  <th
                    key={col.id}
                    className={cls(
                      'border-b border-gray-200/60 px-6 py-4 text-left font-semibold whitespace-nowrap text-gray-900',
                      'text-sm tracking-wide uppercase',
                      col.align === 'center' && 'text-center',
                      col.align === 'left' && 'text-left',
                      col.align === 'right' && 'text-right'
                    )}
                    scope="col"
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col)}
                        className={cls(
                          'inline-flex items-center gap-2 transition-colors duration-200 hover:text-blue-600',
                          '-m-1 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none',
                          isSorted && 'text-blue-600'
                        )}
                        aria-label={
                          !isSorted
                            ? `${String(col.header)} 정렬 없음`
                            : sort!.desc
                              ? `${String(col.header)} 내림차순`
                              : `${String(col.header)} 오름차순`
                        }
                      >
                        {typeof col.header === 'function'
                          ? col.header({ sort, onSort: () => handleSort(col) })
                          : col.header}
                        <SortIcon state={iconState} />
                      </button>
                    ) : (
                      <span>
                        {typeof col.header === 'function'
                          ? col.header({ sort: null, onSort: () => {} })
                          : col.header}
                      </span>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {meta?.loading ? (
              <tr>
                <td
                  className="px-6 py-12 text-center text-gray-500"
                  colSpan={Math.max(1, visibleCols.length)}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm font-medium">불러오는 중…</span>
                  </div>
                </td>
              </tr>
            ) : renderData.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-16 text-center text-gray-500"
                  colSpan={Math.max(1, visibleCols.length)}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <svg
                        className="h-6 w-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">
                      {meta?.emptyText ?? '데이터가 없습니다.'}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              renderData.map((row, i) => (
                <tr
                  key={rowKey(row, i)}
                  className={cls(
                    'transition-colors duration-150 hover:bg-gray-50/80',
                    'group relative',
                    onRowClick && 'cursor-pointer hover:bg-blue-50/50'
                  )}
                  onClick={() => onRowClick?.(row, i)}
                >
                  {visibleCols.map((col) => {
                    const raw: unknown =
                      typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : col.accessor
                          ? row[col.accessor as keyof T]
                          : undefined

                    const cellValue = col.cell?.({
                      value: raw,
                      row,
                      rowIndex: i,
                    })

                    const content: React.ReactNode =
                      cellValue !== undefined ? cellValue : toNode(raw)

                    return (
                      <td
                        key={col.id}
                        className={cls(
                          'px-6 py-4 text-sm text-gray-900',
                          'border-b border-gray-50 last:border-b-0',
                          col.align === 'left' && 'text-left',
                          col.align === 'center' && 'text-center',
                          col.align === 'right' && 'text-right',
                          nowrapCells && 'whitespace-nowrap',
                          wrapCells && 'break-words whitespace-normal'
                        )}
                      >
                        {content}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 푸터 */}
      <div className="border-t border-gray-200 bg-gray-50/50 px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* 왼쪽 공간 (균형을 위해) */}
          <div className="hidden sm:flex sm:flex-1"></div>

          {/* 페이지네이션 - 가운데 */}
          {showPagination && (
            <div className="flex justify-center">
              <Pagination
                totalPages={computedTotalPages}
                currentPage={page}
                onChange={(next) => onStateChange?.({ page: next })}
              />
            </div>
          )}

          {/* 페이지 사이즈 선택 - 오른쪽 */}
          <div className="flex flex-col items-center gap-3 sm:flex-1 sm:flex-row sm:items-center sm:justify-end">
            <select
              id="page-size"
              name="page-size"
              className={cls(
                'rounded-lg border border-gray-300 px-3 py-2 shadow-sm',
                'focus:border-blue-500 focus:ring-2 focus:ring-blue-500',
                'bg-white text-sm font-medium text-gray-900',
                'transition-colors duration-200 hover:border-gray-400'
              )}
              value={pageSize}
              onChange={(e) =>
                onStateChange?.({ pageSize: Number(e.target.value), page: 1 })
              }
              aria-label="페이지당 항목 수 선택"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}개
                </option>
              ))}
            </select>
            {footerExtra && (
              <div className="flex items-center gap-2">{footerExtra}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataTable
