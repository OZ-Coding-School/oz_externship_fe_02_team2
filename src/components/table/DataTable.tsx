import type { Column, TableMeta, TableState, SortState } from '@type/table'
import { cls } from '@/lib/table'
import Pagination from '../ui/Pagination/Pagination'
import { useCallback, useEffect, useMemo } from 'react'
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
}

export function DataTable<T>({
  columns,
  data,
  state,
  onStateChange,
  meta,
  toolbar,
  footerExtra,
  stickyHeader = true,
  nowrapCells = true,
  wrapCells = false,
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
    <div className="border-base-300 bg-base-100 w-full overflow-hidden rounded-2xl border">
      {/* 헤더 툴바 */}
      <div className="border-base-300 flex items-center justify-between border-b p-3">
        <div className="text-base font-semibold">목록</div>
        <div className="flex items-center gap-2">{toolbar}</div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="body-xs sm:body-sm w-full max-w-full min-w-max table-auto">
          <thead
            className={cls(
              'bg-base-200/60',
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
                      'px-3 py-2 text-left font-medium whitespace-nowrap',
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
                        className="inline-flex items-center gap-1 hover:opacity-80 focus:outline-none"
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

          <tbody>
            {meta?.loading ? (
              <tr>
                <td
                  className="text-base-content/60 px-3 py-8 text-center"
                  colSpan={Math.max(1, visibleCols.length)}
                >
                  불러오는 중…
                </td>
              </tr>
            ) : renderData.length === 0 ? (
              <tr>
                <td
                  className="text-base-content/60 px-3 py-10 text-center"
                  colSpan={Math.max(1, visibleCols.length)}
                >
                  {meta?.emptyText ?? '데이터가 없습니다.'}
                </td>
              </tr>
            ) : (
              renderData.map((row, i) => (
                <tr
                  key={rowKey(row, i)}
                  className="border-base-200 hover:bg-base-200/30 border-t"
                >
                  {visibleCols.map((col) => {
                    const raw: unknown =
                      typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : col.accessor
                          ? row[col.accessor as keyof T]
                          : undefined

                    const content =
                      col.cell?.({ value: raw, row, rowIndex: i }) ??
                      String(raw ?? '')

                    return (
                      <td
                        key={col.id}
                        className={cls(
                          'px-3 py-2 align-middle whitespace-pre-wrap',
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
      <div className="border-base-300 flex flex-col gap-3 border-t p-3 sm:flex-row sm:items-center sm:justify-between">
        {showPagination && (
          <div className="flex w-full justify-center">
            <Pagination
              totalPages={computedTotalPages}
              currentPage={page}
              onChange={(next) => onStateChange?.({ page: next })}
            />
          </div>
        )}

        <div className="flex flex-col items-start gap-2 sm:ml-auto sm:flex-row sm:items-center">
          <label htmlFor="page-size" className="sr-only">
            페이지당 항목 수
          </label>
          <select
            id="page-size"
            name="page-size"
            className="select select-bordered select-xs"
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
          {footerExtra}
        </div>
      </div>
    </div>
  )
}

export default DataTable
