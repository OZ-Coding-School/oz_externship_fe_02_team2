// src/pages/AdminRecruitments/RecruitmentsManage.tsx
import { useEffect, useMemo, useState } from 'react'
import type { TableState, Maybe } from '@/types/table'
import { useToast } from '@/hooks'
import { ApiError } from '@/api/http'

import RecruitmentsTable from '@/components/table/feature/Recruitments/RecruitmentsTable'
import RecruitmentsFilterBar from '@/components/table/feature/Recruitments/RecruitmentsFilterBar'

import type { RecruitmentItem as UiRow } from '@/pages/AdminRecruitments/AdminRecruitments.types'

// 백엔드 API 모듈
import {
  getRecruitments,
  type SortKey as ApiSortKey,
  type RecruitmentListItem as ApiRow,
} from '@/api/modules/recruitments'

// UI 테이블 정렬 -> API ordering 매핑
function toApiSortKey(sort: TableState['sort'] | null): ApiSortKey {
  if (!sort) return 'created_desc'
  const id = (sort as any)?.id ?? 'created_at'
  const desc = !!(sort as any)?.desc
  if (id === 'created_at') return desc ? 'created_desc' : 'created_asc'
  if (id === 'views_count') return 'views_desc'
  if (id === 'bookmarks_count') return 'bookmarks_desc'
  return 'created_desc'
}

// 목록 아이템(API) -> 테이블 로우(UI) 매핑
function mapToUiRow(row: ApiRow): UiRow {
  // 상태 계산: 마감일 지나면 CLOSED, 아니면 OPEN
  const deadlineISO = row.close_at ?? null
  const deadlineDateOnly = deadlineISO ? String(deadlineISO).slice(0, 10) : null
  const isClosed = deadlineISO
    ? new Date(deadlineISO).getTime() < Date.now()
    : false

  return {
    id: String(row.id),
    title: row.title,
    tags: (row.tags ?? []).map((name) => ({ id: name, name })), // string[] -> Tag[]
    deadline: deadlineDateOnly,
    status: isClosed ? 'CLOSED' : 'OPEN',
    views_count: row.views_count ?? 0,
    bookmarks_count: row.bookmarks_count ?? 0,
    created_at: '', // 스펙상 리스트엔 없음(표시는 유지)
    updated_at: '', // 스펙상 리스트엔 없음(표시는 유지)
  }
}

export default function RecruitmentsManage() {
  const { triggerToast } = useToast()

  // 테이블 상태
  const [state, setState] = useState<TableState>({
    page: 1,
    pageSize: 10,
    sort: { id: 'created_at', desc: true }, // 최신순
    search: '',
  })

  // 필터바 상태 (status/role은 UI용, 서버 파라미터엔 없음)
  const [query, setQuery] = useState<{
    search: string
    status: 'ALL' | 'OPEN' | 'CLOSED'
    role?: Maybe<string> // 미사용
  }>({
    search: '',
    status: 'ALL',
    role: undefined,
  })

  // 서버 데이터
  const [rows, setRows] = useState<UiRow[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 목록 로드
  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const { items, totalPages } = await getRecruitments(
          {
            page: state.page,
            pageSize: state.pageSize,
            search: query.search || undefined, // 서버 파라미터명: search
            sortKey: toApiSortKey(state.sort),
            // tag: '필요 시 사용',
          },
          { mock: true } // MSW 사용 시 true
        )

        // API -> UI로 매핑
        const mapped = items.map(mapToUiRow)

        // (선택) 상태 필터는 서버 스펙에 없으므로 프론트에서 1페이지 데이터에 한해 적용
        const filtered =
          query.status === 'ALL'
            ? mapped
            : mapped.filter((r) => r.status === query.status)

        setRows(filtered)
        setTotalPages(totalPages)
      } catch (e: unknown) {
        const msg =
          e instanceof ApiError || e instanceof Error
            ? e.message
            : '목록을 불러오지 못했습니다.'
        setError(msg)
        triggerToast('error', '로딩 실패', msg)
      } finally {
        setLoading(false)
      }
    })()
    return () => ac.abort()
  }, [
    state.page,
    state.pageSize,
    state.sort,
    query.search,
    query.status,
    triggerToast,
  ])

  const data = useMemo(() => rows, [rows])

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">스터디 구인 공고 관리</h1>

      <RecruitmentsTable
        data={data}
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
