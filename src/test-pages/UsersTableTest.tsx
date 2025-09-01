import { useEffect, useState } from 'react'
import UsersTable, { type UserRow } from '@components/table/feature/UsersTable'

export default function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    // 👉 실제 API 호출로 대체
    fetch('/api/admin/users?page=1&pageSize=10')
      .then((res) => res.json())
      .then((data) => {
        setRows(data.items) // items: UserRow[]
        setTotal(data.total) // 전체 개수
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-bold">회원 관리</h1>
      <UsersTable rows={rows} total={total} loading={loading} />
    </div>
  )
}
