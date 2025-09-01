import { useMemo, useState } from 'react'
import Pagination from 'src/Pagination'

const LIMIT = 20

export default function PaginationTest() {
  const [page, setPage] = useState<number>(1) // 반드시 number
  const totalItems = 187 // 가짜 총개수
  const totalPages = Math.max(1, Math.ceil(totalItems / LIMIT) || 1)

  const offset = useMemo(() => (page - 1) * LIMIT, [page])

  return (
    <div className="space-y-4 p-6">
      <div className="text-sm">
        <div>
          currentPage: <b>{page}</b>
        </div>
        <div>
          offset (limit={LIMIT}): <b>{offset}</b>
        </div>
        <div>
          totalPages: <b>{totalPages}</b>
        </div>
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onChange={setPage} // ❗️함수 자체를 넘겨라. setPage() 금지
      />
    </div>
  )
}
