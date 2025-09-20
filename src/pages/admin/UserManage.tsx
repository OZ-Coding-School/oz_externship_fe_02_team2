import { useEffect, useState } from 'react'
import UsersTable from '@/components/table/feature/UsersTable'
import type { UserDetail as UserDetailType } from '@/components/ui/Modal/feature/User/User.types'
import type { SortOrder } from '@/mocks/utils'
import { getUserDetail, getUsers } from '@/api/modules/users'
import { ApiError } from '@/api/http'
import type { UserRow } from '@/components/table/Table.types'
import UserDetail from '@/components/ui/Modal/feature/User/UserDetail' // ← 모달 컴포넌트
import Modal from '@/components/ui/Modal/Modal'

// API 응답(UserDetail[]) → 테이블 로우(UserRow)로 매핑
function mapToRow(u: UserDetailType): UserRow {
  return {
    memberId: u.id,
    email: u.email,
    nickname: u.nickname ?? '',
    name: u.name,
    birth: u.birth ?? '',
    role: u.role ?? '',
    status: (u.status ?? '활성') as UserRow['status'],
    joinedAt: u.joinedAt ?? '',
    withdrawnAt: null,
  }
}

// 테이블 onRequest가 기대하는 파라미터 타입
type RequestParams = {
  page: number
  pageSize: number
  sort?: { id: string; desc: boolean } | null
}

// 정렬 키 매핑(테이블 sort.id → API sortBy)
const SORT_KEY_MAP: Record<string, string> = {
  memberId: 'id',
  email: 'email',
  nickname: 'nickname',
  name: 'name',
  birth: 'birth',
  role: 'role',
  status: 'status',
  joinedAt: 'joinedAt',
  withdrawnAt: 'withdrawnAt',
}

export default function UsersManagePage() {
  const [rows, setRows] = useState<UserRow[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // ▼ 상세 모달 상태
  const [detailId, setDetailId] = useState<string | null>(null)
  const [detail, setDetail] = useState<UserDetailType | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  // UsersTable의 onRequest
  const handleRequest = (params: RequestParams): void => {
    setLoading(true)
    setError(null)

    const sortBy = params.sort
      ? (SORT_KEY_MAP[params.sort.id] ?? params.sort.id)
      : 'joinedAt'
    const sortOrder: SortOrder = params.sort?.desc ? 'desc' : 'asc'

    void getUsers({
      page: params.page,
      pageSize: params.pageSize,
      sortBy,
      sortOrder,
    })
      .then((data) => {
        setRows(data.items.map(mapToRow))
        setTotalPages(data.totalPages)
        setTotal(data.total)
      })
      .catch((e: unknown) => {
        if (e instanceof ApiError || e instanceof Error) setError(e.message)
        else setError('알 수 없는 오류')
      })
      .finally(() => setLoading(false))
  }

  // ▼ 상세 데이터 로딩
  useEffect(() => {
    if (detailId == null) return
    setDetail(null)
    setDetailError(null)
    setDetailLoading(true)

    void getUserDetail(detailId)
      .then((d) => setDetail(d))
      .catch((e: unknown) => {
        if (e instanceof ApiError || e instanceof Error)
          setDetailError(e.message)
        else setDetailError('상세 정보를 불러오지 못했습니다.')
      })
      .finally(() => setDetailLoading(false))
  }, [detailId])

  const closeDetail = () => {
    setDetailId(null)
    setDetail(null)
    setDetailError(null)
  }

  return (
    <>
      <h3>회원 관리</h3>

      {/* 에러 배너 */}
      {error && (
        <div className="alert alert-error mb-2">
          <span>{error}</span>
        </div>
      )}

      <UsersTable
        rows={rows}
        total={total}
        loading={loading}
        totalPages={totalPages}
        onRequest={handleRequest}
        onRowClick={(row) => setDetailId(String(row.memberId))} // ← 클릭 시 상세 열기
      />

      {/* 상세 모달: 데이터 준비 후 렌더 */}
      {detailId !== null && (
        <>
          {/* 로딩/에러 상태에 따라 간단한 처리 (필요 시 커스텀 스켈레톤으로 대체) */}
          {detailLoading && (
            <Modal open onClose={closeDetail}>
              <div className="modal-box">
                <h3 className="text-lg font-bold">회원 상세</h3>
                <div className="mt-4 space-y-2">
                  <div className="bg-base-200 h-6 w-28 animate-pulse rounded" />
                  <div className="bg-base-200 h-6 w-40 animate-pulse rounded" />
                  <div className="bg-base-200 h-6 w-32 animate-pulse rounded" />
                </div>
                <div className="modal-action"></div>
              </div>
            </Modal>
          )}

          {!detailLoading && detailError && (
            <Modal open onClose={closeDetail}>
              <div className="modal-box">
                <h3 className="text-lg font-bold">회원 상세</h3>
                <div className="text-error mt-4">{detailError}</div>
                <div className="modal-action"></div>
              </div>
            </Modal>
          )}

          {!detailLoading && !detailError && detail && (
            <UserDetail open onClose={closeDetail} data={detail} />
          )}
        </>
      )}
    </>
  )
}
