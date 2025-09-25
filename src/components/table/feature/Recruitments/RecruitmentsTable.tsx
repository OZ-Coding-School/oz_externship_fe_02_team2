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
        cell: ({ row }) => {
          // ✅ 문자열[] | {id,name}[] 모두 지원
          const tags = Array.isArray(row.tags)
            ? row.tags.map((t: any) =>
                typeof t === 'string' ? { id: t, name: t } : t
              )
            : []
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
        id: 'close_at', // ✅ 키 교체
        header: '마감 기한',
        accessor: 'close_at',
        width: '120px',
        cell: ({ value }) =>
          value ? new Date(value).toLocaleDateString() : '-',
      },
      {
        id: 'status',
        header: '상태',
        accessor: 'status',
        width: '100px',
        cell: ({ value, row }) => {
          // ✅ 응답에 없으면 close_at 기준으로 계산
          const v =
            value ??
            (row.close_at && new Date(row.close_at) < new Date()
              ? 'CLOSED'
              : 'OPEN')
          const label = v === 'OPEN' ? '모집중' : '마감'
          const cls =
            v === 'OPEN'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          return (
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
            >
              {label}
            </span>
          )
        },
      },
      {
        id: 'views_count',
        header: ({ sort }) => (
          <span className="inline-flex items-center gap-1">
            조회수 <span>{sort ? (sort.desc ? '↑' : '↓') : ''}</span>
          </span>
        ),
        accessor: 'views_count',
        width: '100px',
        align: 'left',
        sortable: true,
      },
      {
        id: 'bookmarks_count',
        header: ({ sort }) => (
          <span className="inline-flex items-center gap-1">
            북마크 <span>{sort ? (sort.desc ? '↑' : '↓') : ''}</span>
          </span>
        ),
        accessor: 'bookmarks_count',
        width: '100px',
        align: 'left',
        sortable: true,
      },
      {
        id: 'created_at',
        header: ({ sort }) => (
          <span className="inline-flex items-center gap-1">
            생성일시 <span>{sort ? (sort.desc ? '↑' : '↓') : ''}</span>
          </span>
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
