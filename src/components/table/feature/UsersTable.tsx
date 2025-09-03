// 회원 관리
import { useState } from 'react'
import { DataTable } from '@components/table/DataTable'
import { Badge } from '@components/table/Badges'
import { fmtDate } from '@/lib/table'
import type { Column, TableState } from '@type/table'
import { roleToTone } from '@/lib/mappers'

export type UserRow = {
  memberId: string
  email: string
  nickname: string
  name: string
  birth: string
  role: '관리자' | '스태프' | '일반회원'
  status: '활성' | '정지' | '탈퇴요청'
  joinedAt: string
  withdrawnAt?: string
}

const columns: Column<UserRow>[] = [
  {
    id: 'memberId',
    header: '회원 ID',
    accessor: 'memberId',
    sortable: true,
    width: '90px',
  },
  { id: 'email', header: '이메일', accessor: 'email', width: '220px' },
  { id: 'nickname', header: '닉네임', accessor: 'nickname' },
  { id: 'name', header: '이름', accessor: 'name', width: '90px' },
  { id: 'birth', header: '생년월일', accessor: 'birth', width: '120px' },
  {
    id: 'role',
    header: '권한',
    accessor: 'role',
    width: '100px',
    cell: ({ value }) => <Badge tone={roleToTone(value)}>{value}</Badge>,
  },
  {
    id: 'status',
    header: '상태',
    accessor: 'status',
    width: '100px',
    cell: ({ value }) => (
      <Badge
        tone={value === '활성' ? 'green' : value === '정지' ? 'red' : 'yellow'}
      >
        {value}
      </Badge>
    ),
  },
  {
    id: 'joinedAt',
    header: '가입일',
    accessor: (r) => fmtDate(r.joinedAt, { withTime: false }),
    width: '150px',
  },
  {
    id: 'withdrawnAt',
    header: '탈퇴요청일',
    accessor: (r) =>
      r.withdrawnAt ? fmtDate(r.withdrawnAt, { withTime: false }) : '-',
    width: '160px',
  },
]

export default function UsersTable({
  rows,
  total,
  loading,
}: {
  rows: UserRow[]
  total: number
  loading: boolean
}) {
  const [state, setState] = useState<TableState>({
    page: 1,
    pageSize: 10,
    sort: null,
  })

  return (
    <DataTable<UserRow>
      columns={columns}
      data={rows}
      state={state}
      onStateChange={(n) => setState((s) => ({ ...s, ...n }))}
      meta={{
        rowKey: (r) => r.memberId,
        total,
        loading,
        emptyText: '회원이 없습니다.',
      }}
    />
  )
}
