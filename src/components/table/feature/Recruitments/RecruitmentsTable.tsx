import React, { useMemo } from 'react'
import type { Column, TableState } from '@/types/table'
import type { RecruitmentItem } from '@/pages/AdminRecruitments/AdminRecruitments.types'
import DataTable from '../../DataTable'

type Props = {
  data: RecruitmentItem[]
  state: TableState
  onStateChange: (next: Partial<TableState>) => void
  totalPages: number
  toolbar?: React.ReactNode
}

const STATUS_LABEL: Record<'OPEN' | 'CLOSED', string> = {
  OPEN: '모집중',
  CLOSED: '마감',
}

export default function RecruitmentsTable({
  data,
  state,
  onStateChange,
  totalPages,
  toolbar,
}: Props) {
  const columns: Column<RecruitmentItem>[] = useMemo(
    () => [
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
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.tags.slice(0, 2).map((t) => (
              <span
                key={t.id}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
              >
                {t.name}
              </span>
            ))}
            {row.tags.length > 2 && (
              <span className="rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-500">
                +{row.tags.length - 2}
              </span>
            )}
          </div>
        ),
      },
      {
        id: 'deadline',
        header: '마감 기한',
        accessor: 'deadline',
        width: '120px',
        cell: ({ value }) => value ?? '-',
      },
      {
        id: 'status',
        header: '상태',
        accessor: 'status',
        width: '100px',
        cell: ({ value }) => (
          <span
            className={
              'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ' +
              (value === 'OPEN'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600')
            }
          >
            {STATUS_LABEL[value as 'OPEN' | 'CLOSED']}
          </span>
        ),
      },
      {
        id: 'views_count',
        header: ({ sort, onSort }) => (
          <button
            type="button"
            onClick={onSort}
            className="inline-flex items-center gap-1"
            aria-label="조회수 정렬"
          >
            조회수 <span>{sort ? (sort.desc ? '↑' : '↓') : ''}</span>
          </button>
        ),
        accessor: 'views_count',
        width: '100px',
        align: 'left',
        sortable: true,
      },
      {
        id: 'bookmarks_count',
        header: ({ sort, onSort }) => (
          <button
            type="button"
            onClick={onSort}
            className="inline-flex items-center gap-1"
            aria-label="북마크 정렬"
          >
            북마크 <span>{sort ? (sort.desc ? '↑' : '↓') : ''}</span>
          </button>
        ),
        accessor: 'bookmarks_count',
        width: '100px',
        align: 'left',
        sortable: true,
      },
      {
        id: 'created_at',
        header: ({ sort, onSort }) => (
          <button
            type="button"
            onClick={onSort}
            className="inline-flex items-center gap-1"
            aria-label="생성일시 정렬"
          >
            생성일시 <span>{sort ? (sort.desc ? '↑' : '↓') : ''}</span>
          </button>
        ),
        accessor: 'created_at',
        width: '160px',
        sortable: true,
      },
      {
        id: 'updated_at',
        header: '수정일시',
        accessor: 'updated_at',
        width: '160px',
      },
    ],
    []
  )

  return (
    <DataTable<RecruitmentItem>
      columns={columns}
      data={data}
      state={state}
      onStateChange={onStateChange}
      meta={{ totalPages }}
      toolbar={toolbar}
      stickyHeader
      nowrapCells
    />
  )
}
