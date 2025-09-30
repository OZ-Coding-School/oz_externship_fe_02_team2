import { useCallback, useState } from 'react'
import { useTableFilters } from '@/hooks/useTableFilters'
import Modal from '@/components/ui/Modal/Modal'
import { useToast } from '@/hooks'
import type { StudyGroupRow } from '@/components/table/Table.types'
import type { SortOrder } from '@/mocks/utils'
import { ApiError } from '@/api/http'
import type { EnhancedQueryChangeHandlers, EnhancedTableQuery } from '@/types'
import type { StudyGroupDetail } from '@/components/ui/Modal/feature/Study/Study.types'
import StudyGroupsTable from '@/components/table/feature/StudyGroups/StudyGroupsTable'
import StudyGroupDetailModal from '@/components/ui/Modal/feature/Study/StudyGroupDetailModal'
import { getStudyGroupDetail, getStudyGroups } from '@/api/modules/studygroups'
import StudyGroupsFilterBar from '@/components/table/feature/StudyGroups/StudyGroupsFilterBar'

// 상태 번역 함수
function translateStudygroupStatus(status: string): string {
  const statusMap: Record<string, string> = {
    대기중: '대기중',
    진행중: '진행중',
    종료됨: '종료됨',
  }
  return statusMap[status] || status
}

// API 응답 → 테이블 로우 매핑 (수정됨)
function mapToRow(s: StudyGroupDetail): StudyGroupRow {
  return {
    id: s.id,
    title: s.title,
    capacity: s.capacity,
    enrolled: s.enrolled,
    period: s.period, // 실제 데이터 사용
    status: translateStudygroupStatus(s.status), // 번역 적용
    createdAt: s.createdAt, // 실제 데이터 사용
    updatedAt: s.updatedAt, // 실제 데이터 사용
    ...(s.coverImageUrl && { coverImageUrl: s.coverImageUrl }), // optional 처리
  }
}

// 정렬 키 매핑 (스터디 그룹용으로 수정)
const SORT_KEY_MAP: Record<string, string> = {
  id: 'id',
  title: 'title',
  capacity: 'capacity',
  enrolled: 'enrolled',
  status: 'status',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
}

export default function StudyGroupPage() {
  const { triggerToast } = useToast()

  // 테이블 데이터 상태
  const [tableData, setTableData] = useState<StudyGroupRow[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 모달 상태
  const [modalState, setModalState] = useState({
    detailId: null as number | null,
    detail: null as StudyGroupDetail | null,
    detailLoading: false,
    detailError: null as string | null,
  })

  // 서버에서 스터디 그룹 데이터 로드
  const loadTableData = useCallback(
    async (query: EnhancedTableQuery) => {
      setLoading(true)
      setError(null)

      try {
        // 정렬 파라미터 변환
        const sortBy = query.sortBy
          ? (SORT_KEY_MAP[query.sortBy] ?? query.sortBy)
          : 'created_at'
        const sortOrder: SortOrder = query.sortDir === 'desc' ? 'desc' : 'asc'

        const q = (query.search ?? '').trim()

        // API 호출 파라미터 구성
        const apiParams = {
          page: query.page,
          pageSize: query.pageSize,
          sortBy,
          sortOrder,
          ...(q && { q }),
          ...(query.status && { status: query.status }), // reason → status로 변경
        }

        const data = await getStudyGroups(apiParams, { mock: true })

        setTableData((data.items as StudyGroupDetail[]).map(mapToRow))
        setTotal(data.total)
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

  // 테이블 필터 훅 사용 (초기값 수정)
  const tableFilters = useTableFilters({
    initialQuery: {
      page: 1,
      pageSize: 10,
      search: '',
      status: undefined, // reason → status
      sortBy: 'created_at',
      sortDir: 'desc',
    },
    syncUrl: true,
    debounceMs: 300,
    onQueryChange: loadTableData,
  })

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

  // 모달 열기 (상세 데이터 로드)
  const openStudyGroupDetail = useCallback(
    async (groupId: number) => {
      // userId → groupId로 변경
      setModalState((prev) => ({
        ...prev,
        detailId: groupId,
        detail: null,
        detailError: null,
        detailLoading: true,
      }))

      try {
        const groupData = await getStudyGroupDetail(groupId, { mock: true }) // userData → groupData

        // 모달에 표시할 데이터도 번역 처리
        const translatedGroupData = {
          ...groupData,
          status: translateStudygroupStatus(groupData.status),
        }

        setModalState((prev) => ({
          ...prev,
          detail: translatedGroupData,
          detailLoading: false,
        }))
      } catch (e: unknown) {
        const errorMessage =
          e instanceof ApiError || e instanceof Error
            ? e.message
            : '상세 정보를 불러오지 못했습니다.'

        setModalState((prev) => ({
          ...prev,
          detailError: errorMessage,
          detailLoading: false,
        }))

        triggerToast('error', '상세 정보 로딩 실패', errorMessage)
      }
    },
    [triggerToast]
  )

  // 모달 닫기
  const closeDetail = useCallback(() => {
    setModalState({
      detailId: null,
      detail: null,
      detailLoading: false,
      detailError: null,
    })
  }, [])

  // 테이블 로우 클릭 핸들러
  const handleRowClick = useCallback(
    (row: StudyGroupRow) => {
      void openStudyGroupDetail(row.id)
    },
    [openStudyGroupDetail]
  )

  // 쿼리 변경 핸들러 (수정됨)
  const enhancedOnQueryChange: EnhancedQueryChangeHandlers = {
    ...tableFilters.onQueryChange,
    setStatus: (status) => {
      // setWithdrawalReason → setStatus
      const newQuery = { ...tableFilters.query, status: status }
      tableFilters.updateQuery(newQuery)
      loadTableData(newQuery)
    },
  }

  // 새로고침 핸들러
  const refreshTable = useCallback(() => {
    void loadTableData(tableFilters.query)
  }, [loadTableData, tableFilters.query])

  // 로딩 스켈레톤 컴포넌트
  const LoadingModal = () => (
    <Modal open onClose={closeDetail}>
      <Modal.Header>
        <Modal.Title>스터디 그룹 상세 정보</Modal.Title>{' '}
        {/* 회원 → 스터디 그룹 */}
      </Modal.Header>
      <div className="border-b border-gray-200" />
      <Modal.Body>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )

  // 에러 모달 컴포넌트
  const ErrorModal = ({ error }: { error: string }) => (
    <Modal open onClose={closeDetail}>
      <Modal.Header>
        <Modal.Title>오류 발생</Modal.Title>
      </Modal.Header>
      <div className="border-b border-gray-200" />
      <Modal.Body>
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 text-red-500">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            데이터를 불러올 수 없습니다
          </h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </Modal.Body>
      <div className="border-b border-gray-200" />
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={closeDetail}>
          닫기
        </button>
        <button
          className="btn btn-primary"
          onClick={() =>
            modalState.detailId && openStudyGroupDetail(modalState.detailId)
          }
        >
          다시 시도
        </button>
      </Modal.Footer>
    </Modal>
  )

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 헤더 (수정됨) */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">스터디 그룹 관리</h1>
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

      {/* 테이블 */}
      <div className="rounded-lg bg-white shadow">
        {/* 필터 바 */}
        <StudyGroupsFilterBar
          query={tableFilters.query as EnhancedTableQuery}
          onQueryChange={enhancedOnQueryChange}
          density="compact"
          tone="elevated"
          stickyTop={64}
        />
      </div>

      <div className="mt-7">
        {/* 테이블 */}
        <StudyGroupsTable
          rows={tableData}
          total={total}
          loading={loading}
          totalPages={totalPages}
          onRequest={handleTableRequest}
          onRowClick={handleRowClick}
        />
      </div>

      {/* 상세 모달들 */}
      {modalState.detailId && (
        <>
          {modalState.detailLoading && <LoadingModal />}
          {!modalState.detailLoading && modalState.detailError && (
            <ErrorModal error={modalState.detailError} />
          )}
          {!modalState.detailLoading &&
            !modalState.detailError &&
            modalState.detail && (
              <StudyGroupDetailModal
                open
                onClose={closeDetail}
                data={modalState.detail}
              />
            )}
        </>
      )}
    </div>
  )
}
