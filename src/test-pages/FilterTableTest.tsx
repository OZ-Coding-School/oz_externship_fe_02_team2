import { useMemo } from 'react'
import { TableWithFilters } from '@/components/table/TableWithFilters'
import type { TableFilterConfig, TableData } from '@/types/table'

type UserRow = {
  id: number
  name: string
  email: string
  status: '활성' | '비활성'
  role: '관리자' | '회원' | '게스트'
}

const SAMPLE: UserRow[] = [
  {
    id: 1,
    name: 'Alice',
    email: 'alice@test.com',
    status: '활성',
    role: '관리자',
  },
  {
    id: 2,
    name: 'Bob',
    email: 'bob@test.com',
    status: '비활성',
    role: '회원',
  },
  {
    id: 3,
    name: 'Cara',
    email: 'cara@test.com',
    status: '활성',
    role: '회원',
  },
  {
    id: 4,
    name: 'Duke',
    email: 'duke@test.com',
    status: '활성',
    role: '관리자',
  },
  {
    id: 5,
    name: 'Evan',
    email: 'evan@test.com',
    status: '비활성',
    role: '게스트',
  },
]

const CONFIG: TableFilterConfig = {
  mode: 'client',
  searchPlaceholder: '이름/이메일 검색',
  statusPlaceholder: '상태 선택',
  rolePlaceholder: '권한 선택',
  debounceMs: 200,
  statusOptions: [
    { value: '활성', label: '활성' },
    { value: '비활성', label: '비활성' },
  ],
  roleOptions: [
    { value: '관리자', label: '관리자' },
    { value: '회원', label: '회원' },
    { value: '게스트', label: '게스트' },
  ],
}

function BasicTable({ items }: TableData<UserRow>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] table-fixed border-collapse">
        <thead>
          <tr className="bg-gray-50 text-left text-sm text-gray-600">
            <th className="w-16 border-b p-2">ID</th>
            <th className="w-40 border-b p-2">이름</th>
            <th className="w-64 border-b p-2">이메일</th>
            <th className="w-28 border-b p-2">상태</th>
            <th className="w-28 border-b p-2">권한</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id} className="text-sm">
              <td className="border-b p-2">{r.id}</td>
              <td className="border-b p-2">{r.name}</td>
              <td className="border-b p-2">{r.email}</td>
              <td className="border-b p-2">{r.status}</td>
              <td className="border-b p-2">{r.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TestTablePage() {
  const data = useMemo(() => SAMPLE, [])
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-4 text-xl font-semibold">테이블 데모</h1>

      <TableWithFilters<UserRow>
        data={data}
        config={CONFIG}
        searchFields={['name', 'email']}
        renderTable={(tableData) => <BasicTable {...tableData} />}
        clientFilterKeys={{ status: 'status', role: 'role' }}
      />
    </div>
  )
}
