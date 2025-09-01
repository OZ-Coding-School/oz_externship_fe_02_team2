import type { Column, SortState, TableMeta, TableState } from '@type/table'
import { cls } from '@utils/table'
import React from 'react'

type Props<T> = {
  columns?: Column<T>[] // ← optional로 두고 내부에서 기본값 처리
  data?: T[] // ← optional로 두고 내부에서 기본값 처리
  state: TableState
  onStateChange?: (next: Partial<TableState>) => void
  meta: TableMeta<T>
  toolbar?: React.ReactNode
  footerExtra?: React.ReactNode
}

export function DataTable<T>({
  columns,
  data,
  state,
  onStateChange,
  meta,
  toolbar,
  footerExtra,
}: Props<T>) {
  // 안전 기본값
  const safeCols = Array.isArray(columns) ? columns : []
  const safeData = Array.isArray(data) ? data : []
  const visibleCols = safeCols.filter((c) => !c.hidden)

  // 기본 rowKey (제공 안되면 index 사용)
  const rowKey = meta?.rowKey ?? ((_: T, i: number) => i)

  // 방어적 경고 (개발 중 디버깅에 도움)
  if (!Array.isArray(columns)) {
    console.warn(
      '[DataTable] columns가 전달되지 않았습니다. 빈 배열로 처리합니다.'
    )
  }
  if (!Array.isArray(data)) {
    console.warn(
      '[DataTable] data가 전달되지 않았습니다. 빈 배열로 처리합니다.'
    )
  }
  if (!meta) {
    console.warn(
      '[DataTable] meta가 전달되지 않았습니다. 기본 rowKey만 사용합니다.'
    )
  }

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

  return (
    <div className="border-base-300 bg-base-100 w-full overflow-hidden rounded-2xl border">
      {/* 헤더 툴바 */}
      <div className="border-base-300 flex items-center justify-between border-b p-3">
        <div className="text-base font-semibold">목록</div>
        <div className="flex items-center gap-2">{toolbar}</div>
      </div>

      {/* 테이블 */}
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-base-200/60">
            <tr>
              {visibleCols.map((col) => {
                const isSorted = sort?.id === col.id
                const arrow = isSorted ? (sort!.desc ? ' ▼' : ' ▲') : ''
                return (
                  <th
                    key={col.id}
                    className={cls(
                      'px-3 py-2 text-left font-medium whitespace-nowrap',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right'
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
                  {visibleCols.map((col) => {
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
                          col.align === 'right' && 'text-right'
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

      {/* 푸터(페이지네이션) */}
      <div className="border-base-300 flex items-center justify-between gap-2 border-t p-3">
        <div className="text-base-content/60 text-xs">
          페이지 {page} · 페이지당 {pageSize}
          {typeof meta?.total === 'number' && <> · 총 {meta.total}건</>}
        </div>
        <div className="flex items-center gap-2">
          {/* 접근성 라벨 추가 (ID 충돌 피하려면 상위에서 useId로 내려줘도 OK) */}
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
