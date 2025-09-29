import { useEffect, useMemo, useState } from 'react'
import type { TableState } from '@/types/table'
import { useToast } from '@/hooks'
import RecruitmentsTable from '@/components/table/feature/Recruitments/RecruitmentsTable'
import RecruitmentsFilterBar from '@/components/table/feature/Recruitments/RecruitmentsFilterBar'
import { getRecruitments, type SortKey } from '@/api/modules/recruitments'
import type { RecruitmentItem } from './AdminRecruitments.types'

// 정렬 키 ↔ 테이블 sort 매핑 -----------------------------
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

// API → UI 행 매핑 ---------------------------------------
function mapToUiRow(r: any): RecruitmentItem {
  const now = Date.now()
  const close = r?.close_at ? Date.parse(r.close_at) : NaN
  const status: 'OPEN' | 'CLOSED' =
    Number.isFinite(close) && close < now ? 'CLOSED' : 'OPEN'

  return {
    id: String(r.id), // ← 테이블 타입과 맞춤(문자열)
    uuid: r.uuid,
    title: r.title,
    // 테이블은 string[] | {id,name}[] 둘 다 지원 → 그대로 string[] 사용
    tags: Array.isArray(r?.tags) ? r.tags : [],
    // 테이블 컬럼은 close_at을 쓰지만, 타입 호환 위해 deadline도 채워줌
    close_at: r?.close_at ?? null,
    deadline: r?.close_at ?? null, // ← ⭐️ 타입 에러 해결 포인트
    status,
    views_count: r?.views_count ?? 0,
    bookmarks_count: r?.bookmarks_count ?? 0,
    created_at: r?.created_at ?? '-',
    updated_at: r?.updated_at ?? '-',
  }
}

export default function RecruitmentsManage() {
  const { triggerToast } = useToast()

  // 정렬/페이지는 여기만 단일 소스
  const [state, setState] = useState<TableState>({
    page: 1,
    pageSize: 10,
    sort: { id: 'created_at', desc: true },
    search: '',
  })

  // 필터(정렬 제외 — 순환 업데이트 방지)
  const [filters, setFilters] = useState<{
    queryText: string
    status: 'ALL' | 'OPEN' | 'CLOSED'
    tagId?: string | null
  }>({
    queryText: '',
    status: 'ALL',
    tagId: undefined,
  })

  const [rows, setRows] = useState<RecruitmentItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const resp = await getRecruitments({
          page: state.page,
          pageSize: state.pageSize,
          search: filters.queryText || undefined,
          tag: filters.tagId || undefined,
          sortKey: sortStateToSortKey(state.sort),
        })

        let items = (resp.items ?? []).map(mapToUiRow)

        if (filters.status !== 'ALL') {
          items = items.filter((it) => it.status === filters.status)
        }

        setRows(items)
        setTotalPages(resp.totalPages)
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : '목록을 불러오지 못했습니다.'
        setError(msg)
        // deps에서 빼야 하므로 아래 한 줄로 린트만 무시하세요.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        triggerToast('error', '로딩 실패', msg)
      } finally {
        setLoading(false)
      }
    })()
    return () => ac.abort()
  }, [
    state.page,
    state.pageSize,
    state.sort?.id, // ✅ 객체 대신 원시값 추적
    state.sort?.desc, // ✅ 객체 대신 원시값 추적
    filters.queryText,
    filters.status,
    filters.tagId,
  ])

  const handleStateChange = (next: Partial<TableState>) => {
    setState((prev) => {
      const incomingSort = next.sort ?? prev.sort
      const sameSort =
        !!prev.sort &&
        !!incomingSort &&
        prev.sort.id === incomingSort.id &&
        prev.sort.desc === incomingSort.desc
      return { ...prev, ...next, sort: sameSort ? prev.sort : incomingSort }
    })
  }

  const filterBarValue = useMemo(
    () => ({
      queryText: filters.queryText,
      status: filters.status,
      tagId: filters.tagId,
      sortKey: sortStateToSortKey(state.sort),
    }),
    [filters.queryText, filters.status, filters.tagId, state.sort]
  )

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">스터디 구인 공고 관리</h1>

      <RecruitmentsTable
        data={rows} // ← 이제 RecruitmentItem[]로 맞음
        state={state}
        onStateChange={handleStateChange}
        totalPages={totalPages}
        toolbar={
          <RecruitmentsFilterBar
            value={filterBarValue}
            onChange={(patch) => {
              if ('sortKey' in patch && patch.sortKey) {
                handleStateChange({ sort: sortKeyToSortState(patch.sortKey) })
              }
              const { queryText, status, tagId } = patch as any
              if (
                queryText !== undefined ||
                status !== undefined ||
                tagId !== undefined
              ) {
                setFilters((prev) => ({ ...prev, ...patch }))
              }
            }}
            className="mb-2"
          />
        }
      />

      {loading && <div className="body-sm mt-3 text-gray-500">로딩 중…</div>}
      {error && <div className="body-sm mt-3 text-red-600">{error}</div>}
    </div>
  )
}
