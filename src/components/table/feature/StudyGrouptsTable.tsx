// 스터디 그룹 관리
import { useState } from 'react'
import { DataTable } from '@components/table/DataTable'
import type { Column, TableState } from '@type/table'
import { fmtDate } from '@/lib/table'
import Badge from '@/components/ui/Badge/Badge'
import type { StudyGroupRow } from '../Table.types'

const columns: Column<StudyGroupRow>[] = [
  {
    id: 'cover',
    header: '대표 이미지',
    accessor: 'cover',
    width: '110px',
    align: 'center',
    cell: ({ value }) =>
      value ? (
        <img className="h-10 w-16 rounded object-cover" src={value} alt="" />
      ) : (
        '-'
      ),
  },
  {
    id: 'title',
    header: '그룹명',
    accessor: 'title',
    width: '200px',
    sortable: true,
  },
  {
    id: 'enroll',
    header: '인원 현황',
    accessor: (r) => `${r.enrolled}\n  / ${r.capacity}명`,
    width: '120px',
    align: 'left',
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
    accessor: (r) => fmtDate(r.createdAt, { withTime: true }),
    width: '160px',
    sortable: true,
  },
  {
    id: 'updated',
    header: '수정일시',
    accessor: (r) => fmtDate(r.updatedAt, { withTime: true }),
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
