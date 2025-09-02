import { useEffect, useMemo, useState } from 'react'
import Pagination from '@components/Pagination'

const LIMIT = 20

const clamp = ({ n, min, max }: { n: number; min: number; max: number }) =>
  Math.max(min, Math.min(max, n))

export default function PaginationTest() {
  const [page, setPage] = useState<number>(1) // 반드시 number
  const [totalItems, setTotalItems] = useState(187) // 가짜 총개수

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / LIMIT)),
    [totalItems]
  )

  useEffect(() => {
    setPage((prev) => {
      const next = clamp({ n: prev, min: 1, max: totalPages })
      return prev === next ? prev : next
    })
  }, [totalPages])

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

      <div className="flex gap-2">
        <button
          onClick={() => setTotalItems(79)}
          className="rounded border px-2 py-1"
        >
          총 79개로
        </button>
        <button
          onClick={() => setTotalItems(187)}
          className="rounded border px-2 py-1"
        >
          총 187개로
        </button>
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onChange={setPage}
      />
    </div>
  )
}
