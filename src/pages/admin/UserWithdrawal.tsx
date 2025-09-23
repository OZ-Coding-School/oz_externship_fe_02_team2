import { useCallback, useState } from 'react'
import { useTableFilters } from '@/hooks/useTableFilters'
import Modal from '@/components/ui/Modal/Modal'
import { useToast } from '@/hooks'
import type { WithdrawalRow } from '@/components/table/Table.types'
import type { TableQuery } from '@/types/table'
import type { SortOrder } from '@/mocks/utils'
import { ApiError } from '@/api/http'
import UsersFilterBar from '@/components/table/feature/Users/UsersFilterBar'
import type { WithdrawalDetail } from '@/components/ui/Modal/feature/Withdrawal/Withdrawal.types'
import {
  getWithdrawalDetail,
  getWithdrawals,
  type WithdrawalListItem,
} from '@/api/modules/withdrawals'
import WithdrawalsTable from '@/components/table/feature/withdrawalsTable'
import WithdrawalModal from '@/components/ui/Modal/feature/Withdrawal/WithdrawalDetail'

// API 응답 → 테이블 로우 매핑
function mapToRow(w: WithdrawalDetail | WithdrawalListItem): WithdrawalRow {
  return {
    id: w.id,
    email: w.email,
    name: w.name,
    permission: w.permission ?? '',
    birthday: (('birthday' in w ? w.birthday : undefined) ?? '') || undefined,
    reason: w.reason ?? '',
    created_at: w.created_at ?? '',
  }
}

// 정렬 키 매핑
const SORT_KEY_MAP: Record<string, string> = {
  wid: 'id',
  email: 'email',
  nickname: 'nickname',
  name: 'name',
  role: 'role',
  birthday: 'birthday',
  reason: 'reason',
  withdrawnAt: 'withdrawnAt',
}

export default function UserWithdrawalPage() {
  const { triggerToast } = useToast()

  // 테이블 데이터 상태
  const [tableData, setTableData] = useState<WithdrawalRow[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 모달 상태
  const [modalState, setModalState] = useState({
    detailId: null as number | null,
    detail: null as WithdrawalDetail | null,
    detailLoading: false,
    detailError: null as string | null,
  })

  // 서버에서 사용자 데이터 로드
  const loadTableData = useCallback(
    async (query: TableQuery) => {
      setLoading(true)
      setError(null)

      try {
        // 정렬 파라미터 변환
        const sortBy = query.sortBy
          ? (SORT_KEY_MAP[query.sortBy] ?? query.sortBy)
          : 'joinedAt'
        const sortOrder: SortOrder = query.sortDir === 'desc' ? 'desc' : 'asc'

        const q = (query.search ?? '').trim()

        // API 호출 파라미터 구성
        const apiParams = {
          page: query.page,
          pageSize: query.pageSize,
          sortBy,
          sortOrder,
          ...(q && { q }), // ← 바뀐 부분
          ...(query.status && { status: query.status }),
          ...(query.role && { role: query.role }),
        }

        const data = await getWithdrawals(apiParams, { mock: true })

        setTableData(data.items.map(mapToRow))
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

  // 테이블 필터 훅 사용
  const tableFilters = useTableFilters({
    initialQuery: {
      page: 1,
      pageSize: 10,
      search: '',
      status: undefined,
      role: undefined,
      sortBy: 'joinedAt',
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
  const openWithdrawalDetail = useCallback(
    async (userId: number) => {
      setModalState((prev) => ({
        ...prev,
        detailId: userId,
        detail: null,
        detailError: null,
        detailLoading: true,
      }))

      try {
        const userData = await getWithdrawalDetail(userId, { mock: true })
        setModalState((prev) => ({
          ...prev,
          detail: userData,
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

  //   // 유저 업데이트 핸들러
  //   const handleWithdrawalUpdated = useCallback(
  //     (updatedUser: WithdrawalDetail) => {
  //       setTableData((prev) =>
  //         prev.map((row) =>
  //           row.id === updatedUser.id ? mapToRow(updatedUser) : row
  //         )
  //       )

  //       setModalState((prev) => ({
  //         ...prev,
  //         detail: prev.detail?.id === updatedUser.id ? updatedUser : prev.detail,
  //       }))

  //       triggerToast(
  //         'success',
  //         '업데이트 완료',
  //         '회원 정보가 성공적으로 업데이트되었습니다.'
  //       )
  //     },
  //     [triggerToast]
  //   )

  //   // 유저 복구 핸들러
  //   const handleUserRestored = useCallback(
  //     (restoredUserId: number) => {
  //       setTableData((prev) =>
  //         prev.map((row) =>
  //           row.id === restoredUserId ? { ...row, status: '활성' as const } : row
  //         )
  //       )

  //       closeDetail()
  //       triggerToast('success', '복구 완료', '회원이 활성화되었습니다.')
  //     },
  //     [closeDetail, triggerToast]
  //   )

  // 테이블 로우 클릭 핸들러
  const handleRowClick = useCallback(
    (row: WithdrawalRow) => {
      void openWithdrawalDetail(row.id)
    },
    [openWithdrawalDetail]
  )

  // 새로고침 핸들러
  const refreshTable = useCallback(() => {
    void loadTableData(tableFilters.query)
  }, [loadTableData, tableFilters.query])

  // 로딩 스켈레톤 컴포넌트
  const LoadingModal = () => (
    <Modal open onClose={closeDetail}>
      <Modal.Header>
        <Modal.Title>회원 상세 정보</Modal.Title>
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
            modalState.detailId && openWithdrawalDetail(modalState.detailId)
          }
        >
          다시 시도
        </button>
      </Modal.Footer>
    </Modal>
  )

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">회원 탈퇴 관리</h1>
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
        <UsersFilterBar
          query={tableFilters.query}
          onQueryChange={tableFilters.onQueryChange}
          density="compact" // 밀도 낮추기
          tone="elevated" // 살짝 떠 보이는 톤
          stickyTop={64} // 상단 64px 고정 (예: 헤더 높이)
          // config로 옵션 일부만 덮어쓰기 가능
          // config={{ statusOptions: [...], roleOptions: [...] }}
        >
          {/* 오른쪽/아래쪽에 붙일 유저 전용 컨트롤들 */}
          {/* <button className="btn btn-primary btn-sm ml-auto">일괄 처리</button> */}
        </UsersFilterBar>
      </div>
      <div className="mt-7">
        {/* 테이블 */}
        <WithdrawalsTable
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
              <WithdrawalModal
                open
                onClose={closeDetail}
                data={modalState.detail}
                //onRequestRestore={handleUserRestored}
              />
            )}
        </>
      )}
    </div>
  )
}
