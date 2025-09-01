import React from 'react'
import type { Column, TableMeta, TableState, SortState } from '@type/table'
import { cls } from '@utils/table'

type MobileKeep =
  | 'all' // 👈 모바일에서도 전부 보이게(기본)
  | number // 앞에서부터 N개만 보이기(원하면 숫자로)

type Props<T> = {
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
  mobileKeepCols = 'all', // 👈 모바일에서도 전부 보이게
  stickyHeader = true,
  nowrapCells = true,
  wrapCells = false,
}: Props<T>) {
  const safeCols = Array.isArray(columns) ? columns : []
  const safeData = Array.isArray(data) ? data : []
  const visibleCols = safeCols.filter((c) => !c.hidden)
  const rowKey = meta?.rowKey ?? ((_: T, i: number) => i)
  const { page, pageSize, sort } = state ?? {
    page: 1,
    pageSize: 10,
    sort: null,
  }

  const handleSort = (col: Column<T>) => {
    if (!col.sortable || !onStateChange) return
    const next: SortState =
      sort?.id === col.id
        ? { id: col.id, desc: !sort.desc }
        : { id: col.id, desc: false }
    onStateChange({ sort: next, page: 1 })
  }

  const shouldHide = (idx: number) =>
    typeof mobileKeepCols === 'number' ? idx >= mobileKeepCols : false // "all"이면 항상 false

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
          {' '}
          {/* 👈 min-w-max: 컬럼 폭 유지 */}
          <thead
            className={cls(
              'bg-base-200/60',
              stickyHeader && 'sticky top-0 z-10'
            )}
          >
            <tr>
              {visibleCols.map((col, idx) => {
                const isSorted = sort?.id === col.id
                const arrow = isSorted ? (sort!.desc ? ' ▼' : ' ▲') : ''
                return (
                  <th
                    key={col.id}
                    className={cls(
                      'px-3 py-2 text-left font-medium whitespace-nowrap',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right',
                      shouldHide(idx) && 'hidden md:table-cell' // 숫자일 때만 숨김
                    )}
                    style={{ width: col.width }}
                  >
                    {typeof col.header === 'function' ? (
                      col.header({ sort, onSort: () => handleSort(col) })
                    ) : col.sortable ? (
                      <button
                        className="hover:underline"
                        onClick={() => handleSort(col)}
                      >
                        {col.header}
                        {arrow}
                      </button>
                    ) : (
                      col.header
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
            ) : safeData.length === 0 ? (
              <tr>
                <td
                  className="text-base-content/60 px-3 py-10 text-center"
                  colSpan={Math.max(1, visibleCols.length)}
                >
                  {meta?.emptyText ?? '데이터가 없습니다.'}
                </td>
              </tr>
            ) : (
              safeData.map((row, i) => (
                <tr
                  key={rowKey(row, i)}
                  className="border-base-200 hover:bg-base-200/30 border-t"
                >
                  {visibleCols.map((col, idx) => {
                    const raw =
                      typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : col.accessor
                          ? (row as any)[col.accessor]
                          : undefined
                    const content = col.cell
                      ? col.cell({ value: raw, row, rowIndex: i })
                      : String(raw ?? '')

                    return (
                      <td
                        key={col.id}
                        className={cls(
                          'px-3 py-2 align-middle',
                          col.align === 'center' && 'text-center',
                          col.align === 'right' && 'text-right',
                          shouldHide(idx) && 'hidden md:table-cell',
                          nowrapCells && 'whitespace-nowrap', // 모바일에서 줄바꿈 안 하고 가로 스크롤
                          wrapCells && 'break-words whitespace-normal' // 필요 시 줄바꿈 모드
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
      <div className="border-base-300 flex items-center justify-between gap-2 border-t p-3">
        <div className="text-base-content/60 text-xs">
          페이지 {page} · 페이지당 {pageSize}
          {typeof meta?.total === 'number' && <> · 총 {meta.total}건</>}
        </div>
        <div className="flex items-center gap-2">
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
                {n} / 페이지
              </option>
            ))}
          </select>

          <div className="join">
            <button
              type="button"
              className="btn btn-xs join-item"
              disabled={page <= 1}
              onClick={() => onStateChange?.({ page: page - 1 })}
            >
              이전
            </button>
            <button
              type="button"
              className="btn btn-xs join-item"
              onClick={() => onStateChange?.({ page: page + 1 })}
            >
              다음
            </button>
          </div>
          {footerExtra}
        </div>
      </div>
    </div>
  )
}
