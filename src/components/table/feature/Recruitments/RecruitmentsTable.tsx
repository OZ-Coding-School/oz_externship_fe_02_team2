import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataTable } from '@components/table/DataTable'
import { fmtDate } from '@/lib/table'
import type { Column, TableState } from '@type/table'
import Badge from '@/components/ui/Badge/Badge'
import { openStatusToTone } from '@/lib'

/** 구인공고 로우 타입 */
export type RecruitmentRow = {
  id: string
  uuid: string
  title: string
  tags: { id: number; name: string }[]
  close_at: string | null
  deadline: string | null
  status: 'OPEN' | 'CLOSED'
  views_count: number
  bookmarks_count: number
  created_at: string
  updated_at: string | null
}

type RecruitmentsTableProps = {
  rows: RecruitmentRow[]
  loading: boolean
  total?: number
  totalPages?: number
  onRequest?: (params: {
    page: number
    pageSize: number
    sort?: { id: string; desc: boolean } | null
  }) => void
  onRowClick?: (row: RecruitmentRow) => void
}
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
      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map((t) => (
            <span
              key={t.id}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
            >
              {t.name}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-500">
              +{tags.length - 2}
            </span>
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

  // DataTable이 상태를 바꾸면, 바로 서버 호출까지 함께 트리거
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

  // 최초 1회 로드
  useEffect(() => {
    onRequest?.({
      page: state.page,
      pageSize: state.pageSize,
      sort: state.sort,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 폴백: 서버 요청(onRequest)이 없을 때, 클라이언트에서 분할/이페이지 계산
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

  // onRequest 없을 때만 클램프
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
