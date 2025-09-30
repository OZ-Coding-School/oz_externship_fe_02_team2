// pages/admin/ApplyToStudyManage.tsx
import { useCallback, useMemo, useState } from 'react'
import { useTableFilters } from '@/hooks/useTableFilters'
import { useToast } from '@/hooks'
import type { ApplyToStudyRow } from '@/components/table/Table.types'
import type { EnhancedQueryChangeHandlers, EnhancedTableQuery } from '@/types'
import type { SortOrder } from '@/mocks/utils'
import { ApiError } from '@/api/http'

import ApplyToStudyTable from '@/components/table/feature/ApplyToStudy/ApplyToStudyTable'
import ApplyToStudyFilterBar from '@/components/table/feature/ApplyToStudy/ApplyToStudyFilter'

// ==== (임시) API 타입 & 모듈 ====
type ApplyToStudyDetail = {
  id: number
  title: string
  applicant: { nickname: string; email: string }
  status: '승인' | '검토 중' | '대기' | '거절'
  appliedAt: string // ISO
  updatedAt: string // ISO
}
type ApplyToStudyListRes = {
  items: ApplyToStudyDetail[]
  total: number
  totalPages: number
}

// 실제 프로젝트의 API 모듈로 교체하세요.
async function getApplyToStudyList(params: {
  page: number
  pageSize: number
  sortBy: string
  sortOrder: SortOrder
  q?: string
  status?: string
}): Promise<ApplyToStudyListRes> {
  const url = new URL('/api/admin/apply-to-study', window.location.origin)
  url.searchParams.set('page', String(params.page))
  url.searchParams.set('size', String(params.pageSize))
  url.searchParams.set('sortBy', params.sortBy)
  url.searchParams.set('sortOrder', params.sortOrder)
  if (params.q) url.searchParams.set('q', params.q)
  if (params.status) url.searchParams.set('status', params.status)
  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new ApiError(String(res.status))
  }
  return (await res.json()) as ApplyToStudyListRes
}

// ==== 헬퍼 ====
const SORT_KEY_MAP: Record<string, string> = {
  id: 'id',
  title: 'title',
  status: 'status',
  appliedAt: 'applied_at',
  updatedAt: 'updated_at',
}

const toBackendSort = (sortKey?: string) => {
  // 최신순/오래된 순만 지원
  if (sortKey === 'created_asc')
    return { sortBy: 'applied_at', sortOrder: 'asc' as SortOrder }
  return { sortBy: 'applied_at', sortOrder: 'desc' as SortOrder }
}

// API → 테이블 로우
function mapToRow(a: ApplyToStudyDetail): ApplyToStudyRow {
  return {
    id: a.id,
    title: a.title,
    status: a.status,
    appliedAt: a.appliedAt,
    updatedAt: a.updatedAt,
    applicant: a.applicant,
  } as unknown as ApplyToStudyRow
}

export default function ApplyToStudyManage() {
  const { triggerToast } = useToast()

  // 서버 데이터 상태
  const [rows, setRows] = useState<ApplyToStudyRow[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortKeyUI, setSortKeyUI] = useState<'created_desc' | 'created_asc'>(
    'created_desc'
  )

  // 테이블 필터 훅 (URL 동기화 포함)
  const tableFilters = useTableFilters({
    initialQuery: {
      page: 1,
      pageSize: 10,
      search: '',
      status: undefined,
      sortBy: 'applied_at',
      sortDir: 'desc',
    },
    syncUrl: true,
    debounceMs: 300,
    onQueryChange: async (q) => {
      await loadList(q)
    },
  })

  // 목록 로드
  const loadList = useCallback(
    async (query: EnhancedTableQuery) => {
      try {
        setLoading(true)
        setError(null)
        const sortBy = query.sortBy
          ? (SORT_KEY_MAP[query.sortBy] ?? query.sortBy)
          : 'applied_at'
        const sortOrder: SortOrder = query.sortDir === 'asc' ? 'asc' : 'desc'
        const q = (query.search ?? '').trim()

        const data = await getApplyToStudyList({
          page: query.page,
          pageSize: query.pageSize,
          sortBy,
          sortOrder,
          ...(q && { q }),
          ...(query.status && { status: query.status }),
        })

        setRows(data.items.map(mapToRow))
        setTotal(data.total)
        setTotalPages(data.totalPages ?? 1)
      } catch (e: unknown) {
        const msg =
          e instanceof ApiError || e instanceof Error
            ? e.message
            : '알 수 없는 오류'
        setRows([])
        setTotal(0)
        setTotalPages(1)
        setError(msg)
        triggerToast('error', '데이터 로딩 실패', msg)
      } finally {
        setLoading(false)
      }
    },
    [triggerToast]
  )

  // DataTable에서 오는 상태 변경 (페이지/페이지사이즈/헤더정렬)
  const handleTableRequest = useCallback(
    ({
      page,
      pageSize,
      sort,
    }: {
      page: number
      pageSize: number
      sort?: { id: string; desc: boolean } | null
    }) => {
      if (page !== tableFilters.query.page) tableFilters.setPage(page)
      if (pageSize !== tableFilters.query.pageSize)
        tableFilters.setPageSize(pageSize)

      if (sort) {
        const sortBy = sort.id
        const sortDir = sort.desc ? 'desc' : 'asc'
        if (
          sortBy !== tableFilters.query.sortBy ||
          sortDir !== tableFilters.query.sortDir
        ) {
          tableFilters.setSort(sortBy, sortDir)
          if (sortBy === 'applied_at' || sortBy === 'appliedAt') {
            setSortKeyUI(sortDir === 'asc' ? 'created_asc' : 'created_desc')
          }
        }
      } else if (tableFilters.query.sortBy) {
        tableFilters.setSort(null)
        setSortKeyUI('created_desc')
      }
    },
    [tableFilters]
  )

  // FilterBar → TableFilters 연결 (정렬: 최신/오래된만)
  const enhancedOnQueryChange: EnhancedQueryChangeHandlers = useMemo(
    () => ({
      ...tableFilters.onQueryChange,
      setSort: (sortKey) => {
        const { sortBy, sortOrder } = toBackendSort(sortKey ?? undefined)
        tableFilters.setSort(sortBy, sortOrder)
        setSortKeyUI(
          (sortKey as 'created_desc' | 'created_asc') ?? 'created_desc'
        )
      },
      setStatus: (status) => {
        const newQuery = { ...tableFilters.query, status }
        tableFilters.updateQuery(newQuery)
        void loadList(newQuery)
      },
    }),
    [tableFilters, loadList]
  )

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">지원 내역 관리</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                데이터 로딩 오류
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => void loadList(tableFilters.query)}
                className="btn btn-sm btn-outline-error"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-white shadow">
        <ApplyToStudyFilterBar
          query={
            {
              ...tableFilters.query,
              sortKey: sortKeyUI,
            } as unknown as any
          }
          onQueryChange={enhancedOnQueryChange as any}
          density="compact"
          tone="elevated"
          stickyTop={64}
          config={{
            sortOptions: [
              { label: '최신순', value: 'created_desc' },
              { label: '오래된 순', value: 'created_asc' },
            ],
            sortPlaceholder: '정렬',
            searchPlaceholder: '공고명, 지원자 닉네임, 이메일 검색...',
            statusPlaceholder: '전체',
          }}
        />
      </div>

      <div className="mt-7">
        <ApplyToStudyTable
          rows={rows}
          total={total}
          loading={loading}
          totalPages={totalPages}
          onRequest={handleTableRequest}
          onRowClick={() => {}}
        />
      </div>
    </div>
  )
}
