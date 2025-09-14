import { useMemo } from 'react'
import { TableWithFilters } from '@/components/table/TableWithFilters'
import type { TableFilterConfig, TableData } from '@/types/table'

type UserRow = {
  id: number
  name: string
  email: string
  status: 'active' | 'inactive'
  role: 'admin' | 'member' | 'guest'
  age: number
}

const SAMPLE: UserRow[] = [
  {
    id: 1,
    name: 'Alice',
    email: 'alice@test.com',
    status: 'active',
    role: 'admin',
    age: 30,
  },
  {
    id: 2,
    name: 'Bob',
    email: 'bob@test.com',
    status: 'inactive',
    role: 'member',
    age: 22,
  },
  {
    id: 3,
    name: 'Cara',
    email: 'cara@test.com',
    status: 'active',
    role: 'member',
    age: 27,
  },
  {
    id: 4,
    name: 'Duke',
    email: 'duke@test.com',
    status: 'active',
    role: 'admin',
    age: 41,
  },
  {
    id: 5,
    name: 'Evan',
    email: 'evan@test.com',
    status: 'inactive',
    role: 'guest',
    age: 20,
  },
]

const CONFIG: TableFilterConfig = {
  mode: 'client',
  searchPlaceholder: '이름/이메일 검색',
  statusPlaceholder: '상태 선택',
  rolePlaceholder: '권한 선택',
  debounceMs: 200,
  statusOptions: [
    { value: 'active', label: '활성' },
    { value: 'inactive', label: '비활성' },
  ],
  roleOptions: [
    { value: 'admin', label: '관리자' },
    { value: 'member', label: '멤버' },
    { value: 'guest', label: '게스트' },
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
            <th className="w-20 border-b p-2">나이</th>
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
              <td className="border-b p-2">{r.age}</td>
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
      />
    </div>
  )
}
