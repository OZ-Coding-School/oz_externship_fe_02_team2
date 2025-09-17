import type { Column, TableMeta, TableState, SortState } from '@type/table'
import { cls } from '@/lib/table'
import Pagination from '../ui/Pagination/Pagination'
import { makeComparer, type Getter } from './sort'
import { useCallback, useEffect, useMemo } from 'react'
import SortIcon from './SortIcon'

type MobileKeep =
  | 'all' // 모바일에서도 전부 보이게(기본)
  | number // 앞에서부터 N개만 보이기(원하면 숫자로)

type TableProps<T> = {
  columns?: Column<T>[]
  data?: T[]
  state: TableState
  onStateChange?: (next: Partial<TableState>) => void
  meta: TableMeta<T>
  toolbar?: React.ReactNode
  footerExtra?: React.ReactNode

  mobileKeepCols?: MobileKeep // ← 기본 "all"
  stickyHeader?: boolean // ← 기본 true
  nowrapCells?: boolean // ← 기본 true (말줄임)
  wrapCells?: boolean // ← true면 셀 줄바꿈(break-words)
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

  // 파생: 숨김 제거한 컬럼 목록도 메모이즈
  const visibleCols = useMemo(
    () => safeCols.filter((c) => !c.hidden),
    [safeCols]
  )
  const { page, pageSize, sort } = state ?? {
    page: 1,
    pageSize: 10,
    sort: null,
  }

  // --- 정렬용 getter 추출 ----------------------------------------------------
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

  // --- 정렬 데이터 (안정 정렬) ------------------------------------------------
  const sortedData = useMemo(() => {
    if (!sort) return safeData
    const col = safeCols.find((c) => c.id === sort.id && c.sortable)
    if (!col) return safeData

    const getter = getSortGetter(col)
    if (!getter) return safeData

    const withIdx = safeData.map((row, i) => ({ row, i }))
    withIdx.sort(makeComparer(getter, Boolean(sort.desc)))
    return withIdx.map((x) => x.row)
  }, [safeData, safeCols, sort, getSortGetter])

  // --- 페이징 모드 ------------------------------------------------------------
  const isClientPaging = meta?.clientPaging === true
  const start = (page - 1) * pageSize
  const end = start + pageSize

  // 서버 모드: 부모가 내려준 페이지 분량을 그대로 사용
  // 클라 모드: 정렬된 전체에서 슬라이스
  const renderData: T[] = useMemo(() => {
    if (isClientPaging) return sortedData.slice(start, end)
    // 서버 모드에서 헤더 아이콘과 "표시" 일관성을 맞추려면 sortedData를 써도 되지만,
    // 서버가 정렬 책임을 지는 경우 safeData로 렌더해도 무방함.
    return safeData
  }, [isClientPaging, sortedData, safeData, start, end])

  // 총 페이지 계산
  const computedTotalPages = useMemo(() => {
    if (isClientPaging) {
      const total = Math.ceil((sortedData.length ?? 0) / Math.max(1, pageSize))
      return Math.max(1, total)
    }
    return Math.max(1, Number(meta?.totalPages ?? 1))
  }, [isClientPaging, sortedData.length, pageSize, meta?.totalPages])

  // page 가 총 페이지를 넘으면 안전하게 클램프
  useEffect(() => {
    if (page > computedTotalPages) onStateChange?.({ page: computedTotalPages })
  }, [page, computedTotalPages, onStateChange])

  // 행 key
  const rowKey =
    meta?.rowKey ??
    ((_: T, i: number) => {
      // fallback index key
      return i
    })

  // --- 정렬 핸들러 (3단계: none → asc → desc → none) -------------------------
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
    onStateChange({ sort: next, page: 1 })
  }

  return (
    <div className="border-base-300 bg-base-100 w-full overflow-hidden rounded-2xl border">
      {/* 헤더 툴바 */}
      <div className="border-base-300 flex items-center justify-between border-b p-3">
        <div className="text-base font-semibold">목록</div>
        <div className="flex items-center gap-2">{toolbar}</div>
      </div>

      {/* 가로 스크롤 */}
      <div className="overflow-x-auto">
        <table className="min-w-max text-xs sm:text-sm">
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
                      col.align === 'right' && 'text-right'
                    )}
                    style={{ width: col.width }}
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
                          'px-3 py-2 align-middle',
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
        {computedTotalPages > 1 && (
          <div className="flex w-full justify-center">
            <Pagination
              totalPages={computedTotalPages}
              currentPage={page}
              onChange={(next) => onStateChange?.({ page: next })}
            />
          </div>
        )}

        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
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
