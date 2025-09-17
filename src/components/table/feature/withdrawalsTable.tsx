// 회원 탈퇴 관리
import { useState } from 'react'
import { DataTable } from '@components/table/DataTable'
import { fmtDate } from '@/lib/table'
import type { Column, TableState } from '@type/table'
import { roleToTone } from '@/lib/mappers'
import type { WithdrawalRow } from '../Table.types'
import Badge from '@/components/ui/Badge/Badge'

const columns: Column<WithdrawalRow>[] = [
  {
    id: 'wid',
    header: '탈퇴요청 ID',
    accessor: 'wid',
    width: '120px',
    sortable: true,
  },
  { id: 'email', header: '이메일', accessor: 'email', width: '220px' },
  {
    id: 'name',
    header: '이름',
    accessor: 'name',
    width: '100px',
    sortable: true,
  },
  {
    id: 'role',
    header: '권한',
    accessor: 'role',
    width: '100px',
    cell: ({ value }) => <Badge tone={roleToTone(value)}>{value}</Badge>,
  },
  {
    id: 'birth',
    header: '생년월일',
    accessor: (r) => r.birth ?? '-',
    width: '120px',
  },
  {
    id: 'reason',
    header: '탈퇴 사유',
    accessor: (r) => r.reason ?? '-',
    cell: ({ value }) => <span className="line-clamp-1">{value}</span>,
  },
  {
    id: 'withdrawnAt',
    header: '탈퇴일시',
    accessor: (r) => fmtDate(r.withdrawnAt, { withTime: true }),
    width: '170px',
    sortable: true,
  },
]

export default function WithdrawalsTable({
  rows,
  total,
  loading,
}: {
  rows: WithdrawalRow[]
  total: number
  loading: boolean
}) {
  const [state, setState] = useState<TableState>({
    page: 1,
    pageSize: 10,
    sort: null,
  })

  return (
    <DataTable<WithdrawalRow>
      columns={columns}
      data={rows}
      state={state}
      onStateChange={(n) => setState((s) => ({ ...s, ...n }))}
      meta={{
        rowKey: (r) => r.wid,
        total,
        loading,
        emptyText: '탈퇴 요청 내역이 없습니다.',
      }}
    />
  )
}
