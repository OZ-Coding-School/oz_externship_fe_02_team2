import { useEffect, useMemo, useState } from 'react'
import type { TableState } from '@/types/table'
import type {
  RecruitmentItem,
  RecruitmentListRes,
  RecruitmentStatusFilter,
  SortKey,
} from '@/pages/AdminRecruitments/AdminRecruitments.types'
import RecruitmentsTable from '@/components/table/feature/Recruitments/RecruitmentsTable'
import RecruitmentsFilterBar from '@/components/table/feature/Recruitments/RecruitmentsFilterBar'

// SortKey ↔ TableState.sort 매핑 -----------------------------
function sortKeyToSortState(k: SortKey): TableState['sort'] {
  switch (k) {
    case 'created_asc':
      return { id: 'created_at', desc: false }
    case 'views_desc':
      return { id: 'views_count', desc: true }
    case 'bookmarks_desc':
      return { id: 'bookmarks_count', desc: true }
    case 'created_desc':
    default:
      return { id: 'created_at', desc: true }
  }
}
function sortStateToSortKey(s: TableState['sort'] | null): SortKey {
  if (!s) return 'created_desc'
  const { id, desc } = s as any
  if (id === 'created_at') return desc ? 'created_desc' : 'created_asc'
  if (id === 'views_count') return 'views_desc'
  if (id === 'bookmarks_count') return 'bookmarks_desc'
  return 'created_desc'
}

// API 결과 → UI 행 변환 ---------------------------------------
function adaptListItemToRow(r: any): RecruitmentItem {
  const now = Date.now()
  const close = r.close_at ? Date.parse(r.close_at) : NaN
  const status: 'OPEN' | 'CLOSED' =
    Number.isFinite(close) && close < now ? 'CLOSED' : 'OPEN'
  return {
    id: String(r.id),
    uuid: r.uuid,
    title: r.title,
    tags: Array.isArray(r.tags)
      ? r.tags
          .slice(0, 3)
          .map((name: string, i: number) => ({ id: `${r.id}-${i}`, name }))
      : [],
    deadline: r.close_at ? String(r.close_at).slice(0, 10) : null,
    status,
    views_count: r.views_count ?? 0,
    bookmarks_count: r.bookmarks_count ?? 0,
    created_at: r.created_at ?? '-', // 목록엔 없으므로 표기용
    updated_at: r.updated_at ?? '-', // 목록엔 없으므로 표기용
  }
}

export default function AdminRecruitmentsPage() {
  // 테이블 상태
  const [state, setState] = useState<TableState>({
    page: 1,
    pageSize: 10,
    sort: { id: 'created_at', desc: true },
    search: '',
  })

  // 필터 상태
  const [filters, setFilters] = useState<{
    queryText: string
    status: RecruitmentStatusFilter
    sortKey: SortKey
    tagId?: string | null
  }>({
    queryText: '',
    status: 'ALL',
    sortKey: 'created_desc',
    tagId: undefined,
  })

  // 서버 데이터
  const [data, setData] = useState<RecruitmentListRes | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 정렬 드롭다운 ↔ 헤더 정렬 동기화
  useEffect(() => {
    setState((prev) => ({ ...prev, sort: sortKeyToSortState(filters.sortKey) }))
  }, [filters.sortKey])

  // 헤더 정렬 변경 시 드롭다운 값도 동기화
  const handleStateChange = (next: Partial<TableState>) => {
    setState((prev) => {
      const merged = { ...prev, ...next }
      if ('sort' in next) {
        setFilters((f) => ({ ...f, sortKey: sortStateToSortKey(merged.sort) }))
      }
      return merged
    })
  }

  // 목록 호출 (API 래퍼 사용)
  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const resp = await getrec(
          {
            page: state.page,
            pageSize: state.pageSize,
            search: filters.queryText || undefined,
            tag: filters.tagId || undefined, // API는 단일 tag만 지원
            sortKey: filters.sortKey,
          },
          { mock: true }
        )

        let items: RecruitmentItem[] = (resp.items ?? []).map(
          adaptListItemToRow
        )

        // 서버에 상태 필터는 없으므로 클라이언트에서 보정
        if (filters.status !== 'ALL') {
          items = items.filter((it) => it.status === filters.status)
        }

        setData({
          total: resp.total,
          page: resp.page,
          size: resp.pageSize,
          items,
        })
        setTotalPages(resp.totalPages)
      } catch (e: any) {
        if (e?.name !== 'AbortError') setError(String(e?.message ?? e))
      } finally {
        setLoading(false)
      }
    })()
    return () => ac.abort()
  }, [
    state.page,
    state.pageSize,
    state.sort, // 정렬 헤더로 바뀐 경우도 반영
    filters.queryText,
    filters.status,
    filters.tagId,
    filters.sortKey, // 드롭다운으로 바뀐 경우도 반영
  ])

  const items = useMemo(() => data?.items ?? [], [data])

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">스터디 구인 공고 관리</h1>

      <RecruitmentsTable
        data={items}
        state={state}
        onStateChange={handleStateChange}
        totalPages={totalPages}
        toolbar={
          <RecruitmentsFilterBar
            value={filters}
            onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
          />
        }
      />

      {loading && <div className="body-sm mt-3 text-gray-500">로딩 중…</div>}
      {error && <div className="body-sm mt-3 text-red-600">{error}</div>}
    </div>
  )
}
