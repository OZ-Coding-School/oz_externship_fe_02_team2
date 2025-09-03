// 강의 관리
import { useState } from 'react'
import { DataTable } from '@components/table/DataTable'
import { Badge } from '@components/table/Badges'
import type { Column, TableState } from '@type/table'
import { fmtDate } from '@/lib/table'

export type CourseRow = {
  id: number
  thumbnail?: string
  title: string
  instructor: string
  platform: 'Udemy' | 'Inflearn' | 'Fastcampus' | 'ETC'
  openedAt: string // 생성일시
  completedAt?: string // 수정일시
  link?: string
}

const columns: Column<CourseRow>[] = [
  {
    id: 'id',
    header: 'ID',
    accessor: 'id',
    width: '70px',
    align: 'center',
    sortable: true,
  },
  {
    id: 'thumb',
    header: '썸네일',
    accessor: 'thumbnail',
    width: '64px',
    cell: ({ value, row }) =>
      value ? (
        <a href={row.link} target="_blank" rel="noreferrer">
          <img className="h-10 w-10 rounded object-cover" src={value} alt="" />
        </a>
      ) : (
        '-'
      ),
  },
  {
    id: 'title',
    header: '강의명',
    accessor: 'title',
    cell: ({ value, row }) =>
      row.link ? (
        <a className="link" href={row.link} target="_blank" rel="noreferrer">
          {value}
        </a>
      ) : (
        value
      ),
  },
  {
    id: 'instructor',
    header: '강사명',
    accessor: 'instructor',
    width: '140px',
  },
  {
    id: 'platform',
    header: '플랫폼',
    accessor: 'platform',
    width: '100px',
    cell: ({ value }) => (
      <Badge
        tone={
          value === 'Udemy' ? 'purple' : value === 'Inflearn' ? 'green' : 'blue'
        }
      >
        {value}
      </Badge>
    ),
  },
  {
    id: 'openedAt',
    header: '생성일시',
    accessor: (r) => fmtDate(r.openedAt),
    width: '160px',
  },
  {
    id: 'completedAt',
    header: '수정일시',
    accessor: (r) => (r.completedAt ? fmtDate(r.completedAt) : '-'),
    width: '160px',
  },
]

export default function CoursesTable({
  rows,
  total,
  loading,
}: {
  rows: CourseRow[]
  total: number
  loading: boolean
}) {
  const [state, setState] = useState<TableState>({
    page: 1,
    pageSize: 10,
    sort: null,
  })

  return (
    <DataTable<CourseRow>
      columns={columns}
      data={rows}
      state={state}
      onStateChange={(n) => setState((s) => ({ ...s, ...n }))}
      meta={{
        rowKey: (r) => r.id,
        total,
        loading,
        emptyText: '강의가 없습니다.',
      }}
    />
  )
}
