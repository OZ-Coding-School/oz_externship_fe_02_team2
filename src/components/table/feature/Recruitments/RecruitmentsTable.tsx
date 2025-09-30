import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataTable } from '@components/table/DataTable'
import { fmtDate } from '@/lib/table'
import type { Column, TableState } from '@type/table'
import Badge from '@/components/ui/Badge/Badge'
import { openStatusToTone } from '@/lib'
import type {
  RecruitmentRow,
  RecruitmentsTableProps,
} from '@/types/AdminRecruitments.types'

const columns: Column<RecruitmentRow>[] = [
  {
    id: 'id',
    header: 'ID',
    accessor: 'id',
    width: '72px',
    cell: ({ value }) => <span className="text-gray-500">#{value}</span>,
  },
  {
    id: 'title',
    header: '공고 제목',
    accessor: 'title',
    cell: ({ value }) => <span className="font-semibold">{value}</span>,
  },
  {
    id: 'tags',
    header: '태그',
    width: '260px',
    cell: ({ row }) => {
      const tags = Array.isArray(row.tags) ? row.tags : []

      // 태그가 없을 때 빈 태그 표시
      if (tags.length === 0) {
        return (
          <Badge variant="secondary" size="sm">
            태그 없음
          </Badge>
        )
      }

      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map((t) => (
            <Badge key={t.id} variant="default" size="sm">
              {t.name}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant="outline" size="sm">
              +{tags.length - 2}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    id: 'close_at',
    header: '마감 기한',
    accessor: 'close_at',
    width: '120px',
    cell: ({ value }) => (value ? fmtDate(value, { withTime: false }) : '-'),
  },
  {
    id: 'status',
    header: '상태',
    accessor: 'status',
    width: '100px',
    cell: ({ value }: { value: RecruitmentRow['status'] }) => (
      <Badge tone={openStatusToTone(value)}>
        {value === 'OPEN' ? '모집중' : '마감'}
      </Badge>
    ),
  },
  {
    id: 'views_count',
    header: '조회수',
    accessor: 'views_count',
    width: '100px',
    align: 'right',
    sortable: true,
  },
  {
    id: 'bookmarks_count',
    header: '북마크',
    accessor: 'bookmarks_count',
    width: '100px',
    align: 'right',
    sortable: true,
  },
  {
    id: 'created_at',
    header: '생성일시',
    accessor: (r) => fmtDate(r.created_at, { withTime: false }),
    width: '160px',
    sortable: true,
  },
  {
    id: 'updated_at',
    header: '수정일시',
    accessor: (r) =>
      r.updated_at ? fmtDate(r.updated_at, { withTime: false }) : '-',
    width: '160px',
  },
]

export default function RecruitmentsTable({
  rows,
  total,
  loading,
  onRequest,
  totalPages,
  onRowClick,
}: RecruitmentsTableProps) {
  const [state, setState] = useState<TableState>({
    page: 1,
    pageSize: 10,
    sort: { id: 'created_at', desc: true },
  })

  const handleStateChange = useCallback(
    (next: Partial<TableState>) => {
      setState((s) => {
        const merged = { ...s, ...next }
        onRequest?.({
          page: merged.page,
          pageSize: merged.pageSize,
          sort: merged.sort,
        })
        return merged
      })
    },
    [onRequest]
  )

  useEffect(() => {
    onRequest?.({
      page: state.page,
      pageSize: state.pageSize,
      sort: state.sort,
    })
  }, [])

  const totalCountFallback = rows.length
  const totalPagesFallback = Math.max(
    1,
    Math.ceil(totalCountFallback / Math.max(1, state.pageSize))
  )
  const finalTotalPages = Math.max(1, Number(totalPages ?? totalPagesFallback))

  const start = (state.page - 1) * state.pageSize
  const end = start + state.pageSize
  const displayRows = useMemo(
    () => (onRequest ? rows : rows.slice(start, end)),
    [onRequest, rows, start, end]
  )

  useEffect(() => {
    if (!onRequest && state.page > finalTotalPages) {
      setState((s) => ({ ...s, page: finalTotalPages }))
    }
  }, [onRequest, state.page, finalTotalPages])

  return (
    <DataTable<RecruitmentRow>
      columns={columns}
      data={displayRows}
      state={state}
      onStateChange={handleStateChange}
      meta={{
        rowKey: (r) => r.id,
        total: total ?? totalCountFallback,
        enableClientSort: true,
        loading,
        emptyText: '구인 공고가 없습니다.',
        totalPages: finalTotalPages,
      }}
      onRowClick={(row) => onRowClick?.(row)}
    />
  )
}
