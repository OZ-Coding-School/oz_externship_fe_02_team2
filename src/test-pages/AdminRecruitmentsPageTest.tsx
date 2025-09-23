import { useEffect, useMemo, useState } from 'react'
import type { TableState, Maybe } from '@/types/table'
import type {
  RecruitmentItem,
  RecruitmentListRes,
} from '@/pages/AdminRecruitments/AdminRecruitments.types'
import RecruitmentsTable from '@/components/table/feature/Recruitments/RecruitmentsTable'
import RecruitmentsFilterBar from '@/components/table/feature/Recruitments/RecruitmentsFilterBar'

// DataTable.sort → API ordering 매핑
function toOrdering(sort: TableState['sort'] | null): string {
  if (!sort) return '-created_at' // 기본 최신순
  const s = sort as any
  const id: string = s?.id ?? 'created_at'
  const desc: boolean = !!s?.desc
  if (id === 'created_at') return desc ? '-created_at' : 'created_at'
  if (id === 'views_count') return '-views_count' // 서버는 desc만 의미있음
  if (id === 'bookmarks_count') return '-bookmarks_count'
  return '-created_at'
}

// OpenAPI 결과 → 테이블 아이템 어댑터
function adaptResultToItem(r: any): RecruitmentItem {
  const now = Date.now()
  const close = r.close_at ? Date.parse(r.close_at) : NaN
  const status: 'OPEN' | 'CLOSED' =
    Number.isFinite(close) && close < now ? 'CLOSED' : 'OPEN'

  return {
    id: String(r.id),
    title: r.title,
    tags: Array.isArray(r.tags)
      ? r.tags.slice(0, 3).map((name: string, i: number) => ({
          id: `${r.id}-${i}`,
          name,
        }))
      : [],
    deadline: r.close_at ? String(r.close_at).slice(0, 10) : null,
    status,
    views_count: r.views_count ?? 0,
    bookmarks_count: r.bookmarks_count ?? 0,
    // OpenAPI 목록에는 created/updated가 없으므로 UI용으로 보정
    created_at: r.created_at ?? '-',
    updated_at: r.updated_at ?? '-',
  }
}

export default function AdminRecruitmentsPage() {
  // 공용 테이블 상태
  const [state, setState] = useState<TableState>({
    page: 1,
    pageSize: 10,
    sort: { id: 'created_at', desc: true },
    search: '',
  })

  // 필터바 상태 (role은 현재 미사용)
  const [query, setQuery] = useState<{
    search: string
    status: 'ALL' | 'OPEN' | 'CLOSED'
    role?: Maybe<string>
  }>({
    search: '',
    status: 'ALL',
    role: undefined,
  })

  // 서버 데이터
  const [data, setData] = useState<RecruitmentListRes | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 목록 호출 (OpenAPI: GET /api/v1/recruitments)
  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const qs = new URLSearchParams()
        qs.set('page', String(state.page)) // required
        qs.set('size', String(state.pageSize))
        if (query.search) qs.set('search', query.search) // ← search 로 보냄
        qs.set('ordering', toOrdering(state.sort)) // ← ordering 사용

        const url = `/api/v1/recruitments?${qs.toString()}`
        const res = await fetch(url, { signal: ac.signal })
        if (!res.ok) {
          const txt = await res.text().catch(() => '')
          throw new Error(`LIST_FETCH_FAILED ${res.status} ${txt}`)
        }

        const json = await res.json() // { count, next, previous, results }
        let items: RecruitmentItem[] = (json.results ?? []).map(
          adaptResultToItem
        )

        // 서버에 status 필터가 없으므로 클라에서 보정
        if (query.status !== 'ALL') {
          items = items.filter((it) => it.status === query.status)
        }

        const adapted: RecruitmentListRes = {
          total: Number(json.count ?? items.length),
          page: state.page,
          size: state.pageSize,
          items,
        }

        setData(adapted)
      } catch (e: any) {
        if (e?.name !== 'AbortError') setError(String(e?.message ?? e))
      } finally {
        setLoading(false)
      }
    })()
    return () => ac.abort()
  }, [state.page, state.pageSize, state.sort, query.search, query.status])

  const items = useMemo(() => (data?.items ?? []) as RecruitmentItem[], [data])
  const totalPages = data ? Math.ceil(data.total / data.size) : 1

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">스터디 구인 공고 관리</h1>

      <RecruitmentsTable
        data={items}
        state={state}
        onStateChange={(next) => setState((prev) => ({ ...prev, ...next }))}
        totalPages={totalPages}
        toolbar={
          <RecruitmentsFilterBar
            tableState={state}
            setTableState={setState}
            query={query}
            setQuery={setQuery}
            className="mb-2"
          />
        }
      />

      {loading && <div className="body-sm mt-3 text-gray-500">로딩 중…</div>}
      {error && <div className="body-sm mt-3 text-red-600">{error}</div>}
    </div>
  )
}
