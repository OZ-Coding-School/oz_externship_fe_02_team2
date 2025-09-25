import React, { useMemo } from 'react'
import type { Column, TableState } from '@/types/table'
import DataTable from '../../DataTable'

/** 현재 화면(UI)에서 쓰는 로우 타입 – RecruitmentsManage의 mapToUiRow에 맞춤 */
type RecruitmentItem = {
  id: string
  uuid: string
  title: string
  tags: { id: string; name: string }[]
  deadline: string | null
  status: 'OPEN' | 'CLOSED'
  views_count: number
  bookmarks_count: number
  created_at: string
  updated_at: string
}

type Props = {
  data: RecruitmentItem[]
  state: TableState
  onStateChange: (next: Partial<TableState>) => void
  totalPages: number
  toolbar?: React.ReactNode
}

const STATUS_LABEL = {
  OPEN: '모집중',
  CLOSED: '마감',
} as const
type Status = keyof typeof STATUS_LABEL

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
          // 현재는 {id,name}[] 형태로 들어옴
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
        id: 'deadline',
        header: '마감 기한',
        accessor: 'deadline',
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
          // value가 any로 들어올 수 있어 타입 가드로 키 좁히기
          const isStatus = (x: unknown): x is Status =>
            x === 'OPEN' || x === 'CLOSED'

          const v: Status = isStatus(value)
            ? value
            : row.deadline && new Date(row.deadline) < new Date()
              ? 'CLOSED'
              : 'OPEN'

          const label = STATUS_LABEL[v]
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
        sortable: true, // 서버 정렬 키와 매핑됨
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
