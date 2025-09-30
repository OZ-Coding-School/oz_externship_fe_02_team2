import { useCallback, useEffect, useState } from 'react'
import { useTableFilters } from '@/hooks/useTableFilters'
import RecruitmentsTable from '@/components/table/feature/Recruitments/RecruitmentsTable'
import RecruitmentsFilterBar from '@/components/table/feature/Recruitments/RecruitmentsFilterBar'
import { useToast } from '@/hooks'
import type { AdminRecruitment } from '@/types/AdminRecruitments.types'
import type { TableQuery } from '@/types/table'
import { getAdminRecruitments } from '@/api/modules/recruitments'
import { ApiError } from '@/api/http'

// API 응답 → 테이블 로우 매핑
function mapToRow(r: AdminRecruitment): any {
  const now = Date.now()
  const close = r.closeAt ? Date.parse(r.closeAt) : NaN
  const status: 'OPEN' | 'CLOSED' =
    Number.isFinite(close) && close < now ? 'CLOSED' : 'OPEN'

  return {
    id: String(r.id),
    uuid: r.uuid,
    title: r.title,
    tags: r.tags,
    close_at: r.closeAt,
    deadline: r.closeAt,
    status,
    views_count: r.viewsCount,
    bookmarks_count: r.bookmarkCount,
    created_at: r.createdAt,
    updated_at: r.updatedAt,
  }
}

// 정렬 키 매핑
const SORT_KEY_MAP: Record<string, string> = {
  id: 'id',
  title: 'title',
  created_at: 'created_at',
  views_count: 'views_count',
  bookmarks_count: 'bookmarks_count',
  close_at: 'close_at',
}

export default function RecruitmentsManage() {
  const { triggerToast } = useToast()

  // 테이블 데이터 상태
  const [tableData, setTableData] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 서버에서 구인 공고 데이터 로드
  const loadTableData = useCallback(
    async (query: TableQuery) => {
      setLoading(true)
      setError(null)

      try {
        // 정렬 파라미터 변환
        const sortBy = query.sortBy
          ? (SORT_KEY_MAP[query.sortBy] ?? query.sortBy)
          : 'created_at'

        // DRF ordering 형식으로 변환
        const ordering = query.sortDir === 'desc' ? `-${sortBy}` : sortBy

        // API 호출 파라미터 구성
        const apiParams = {
          page: query.page,
          ordering,
        }

        const data = await getAdminRecruitments(apiParams, { mock: false })

        let items = data.items.map(mapToRow)

        // 클라이언트 사이드 필터링
        if (query.status && query.status !== 'ALL') {
          items = items.filter((it) => it.status === query.status)
        }

        // 클라이언트 사이드 검색
        if (query.search) {
          const searchLower = query.search.toLowerCase()
          items = items.filter((it) =>
            it.title?.toLowerCase().includes(searchLower)
          )
        }

        // 클라이언트 사이드 정렬
        if (query.sortBy && query.sortDir) {
          items.sort((a, b) => {
            const aVal = a[query.sortBy!]
            const bVal = b[query.sortBy!]
            if (aVal < bVal) return query.sortDir === 'asc' ? -1 : 1
            if (aVal > bVal) return query.sortDir === 'asc' ? 1 : -1
            return 0
          })
        }

        setTableData(items)
        setTotalPages(data.totalPages)
      } catch (e: unknown) {
        const errorMessage =
          e instanceof ApiError || e instanceof Error
            ? e.message
            : '알 수 없는 오류'

        setError(errorMessage)
        triggerToast('error', '데이터 로딩 실패', errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [triggerToast]
  )

  // 테이블 필터 훅 사용
  const tableFilters = useTableFilters({
    initialQuery: {
      page: 1,
      pageSize: 10,
      search: '',
      status: undefined,
      sortBy: 'created_at',
      sortDir: 'desc',
    },
    syncUrl: true,
    debounceMs: 300,
    onQueryChange: loadTableData,
  })

  // 초기 데이터 로드
  useEffect(() => {
    void loadTableData(tableFilters.query)
  }, []) // 빈 배열로 마운트 시 한 번만 실행

  // 테이블에서 정렬 변경 처리
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
      if (page !== tableFilters.query.page) {
        tableFilters.setPage(page)
      }
      if (pageSize !== tableFilters.query.pageSize) {
        tableFilters.setPageSize(pageSize)
      }
      if (sort) {
        const sortBy = sort.id
        const sortDir = sort.desc ? 'desc' : 'asc'
        if (
          sortBy !== tableFilters.query.sortBy ||
          sortDir !== tableFilters.query.sortDir
        ) {
          tableFilters.setSort(sortBy, sortDir)
        }
      } else if (tableFilters.query.sortBy) {
        tableFilters.setSort(null)
      }
    },
    [tableFilters]
  )

  // 새로고침 핸들러
  const refreshTable = useCallback(() => {
    void loadTableData(tableFilters.query)
  }, [loadTableData, tableFilters.query])

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          스터디 구인 공고 관리
        </h1>
      </div>

      {/* 에러 알림 */}
      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                데이터 로딩 오류
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={refreshTable}
                className="btn btn-sm btn-outline-error"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 필터바 */}
      <div className="rounded-lg bg-white shadow">
        <RecruitmentsFilterBar
          query={tableFilters.query}
          onQueryChange={tableFilters.onQueryChange}
          density="compact"
          tone="elevated"
          stickyTop={64}
        />
      </div>

      {/* 테이블 */}
      <div className="mt-7">
        <RecruitmentsTable
          rows={tableData}
          loading={loading}
          totalPages={totalPages}
          onRequest={handleTableRequest}
        />
      </div>
    </div>
  )
}
