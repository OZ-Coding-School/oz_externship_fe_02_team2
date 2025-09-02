// 스터디 그룹 관리
import { useState } from 'react'
import { DataTable } from '@components/table/DataTable'
import { Badge } from '@components/table/Badges'
import type { Column, TableState } from '@type/table'
import { fmtDate } from '@utils/table'

export type StudyGroupRow = {
  id: number | string
  cover?: string
  title: string
  capacity: number
  enrolled: number
  period: { start: string; end: string }
  status: '대기중' | '진행중' | '종료됨'
  createdAt: string
  updatedAt: string
}

const columns: Column<StudyGroupRow>[] = [
  {
    id: 'cover',
    header: '대표 이미지',
    accessor: 'cover',
    width: '72px',
    cell: ({ value }) =>
      value ? (
        <img className="h-10 w-16 rounded object-cover" src={value} alt="" />
      ) : (
        '-'
      ),
  },
  { id: 'title', header: '그룹명', accessor: 'title' },
  {
    id: 'enroll',
    header: '인원 현황',
    accessor: (r) => `${r.enrolled} / ${r.capacity}`,
    width: '120px',
    align: 'center',
  },
  {
    id: 'period',
    header: '스터디 기간',
    accessor: (r) => `${r.period.start} ~ ${r.period.end}`,
    width: '230px',
  },
  {
    id: 'status',
    header: '상태',
    accessor: 'status',
    width: '90px',
    cell: ({ value }) => (
      <Badge
        tone={
          value === '진행중' ? 'green' : value === '대기중' ? 'blue' : 'gray'
        }
      >
        {value}
      </Badge>
    ),
  },
  {
    id: 'created',
    header: '생성일시',
    accessor: (r) => fmtDate(r.createdAt),
    width: '160px',
  },
  {
    id: 'updated',
    header: '수정일시',
    accessor: (r) => fmtDate(r.updatedAt),
    width: '160px',
  },
]

export default function StudyGroupsTable({
  rows,
  total,
  loading,
}: {
  rows: StudyGroupRow[]
  total: number
  loading: boolean
}) {
  const [state, setState] = useState<TableState>({
    page: 1,
    pageSize: 10,
    sort: null,
  })

  return (
    <DataTable<StudyGroupRow>
      columns={columns}
      data={rows}
      state={state}
      onStateChange={(n) => setState((s) => ({ ...s, ...n }))}
      meta={{
        rowKey: (r) => r.id,
        total,
        loading,
        emptyText: '스터디 그룹이 없습니다.',
      }}
    />
  )
}
