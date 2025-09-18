import { useCallback, useMemo, useState } from 'react'
import UsersTable from '@/components/table/feature/UsersTable'
import {
  setMockMode,
  getMockMode,
  type MockMode,
} from '@/api/toggles/mockToggle'
import type { UserDetail } from '@/components/ui/Modal/feature/User/User.types'
import type { SortOrder } from '@/mocks/utils'
import { getUsers } from '@/api/modules/users'
import { ApiError } from '@/api/http'
import type { UserRow } from '@/components/table/Table.types'

// ── 이 페이지에서 쓰는 로우 타입(UsersTable 컬럼 스키마에 맞춤) ──────────────

// API 응답(UserDetail[]) → 테이블 로우(UserRow)로 매핑
function mapToRow(u: UserDetail): UserRow {
  return {
    memberId: u.id,
    email: u.email,
    nickname: u.nickname ?? '', // 필수 보장
    name: u.name,
    birth: u.birth ?? '',
    role: u.role ?? '',
    status: (u.status ?? '활성') as UserRow['status'], // 테이블 enum에 맞춰 기본값
    joinedAt: u.joinedAt ?? '',
    withdrawnAt: null, // 테이블이 string 필수면 ''로
  }
}

// 테이블 onRequest가 기대하는 파라미터 타입과 동일하게 맞춤
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
  withdrawnAt: 'withdrawnAt', // 서버에 없다면 무시되거나 클라정렬만 사용
}

export default function UsersAdminTestPage() {
  const [rows, setRows] = useState<UserRow[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<MockMode>(() => getMockMode())

  // 전역 모드 토글 (mock / real / auto)
  const onChangeMode = useCallback((next: MockMode) => {
    setMockMode(next)
    setMode(next)
  }, [])

  // 서버에 요청 (UsersTable의 onRequest 시그니처에 맞춤)
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
      .finally(() => {
        setLoading(false)
      })
  }

  const modeBadge = useMemo(
    () =>
      mode === 'mock'
        ? '목업 강제'
        : mode === 'real'
          ? '실서버 강제'
          : '자동(auto)',
    [mode]
  )

  return (
    <div className="space-y-4 p-4">
      {/* 상단 툴바: 모드 토글 & 상태표시 */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">API 모드:</span>
          <div className="join">
            <button
              type="button"
              className={`join-item btn btn-sm ${mode === 'mock' ? 'btn-primary' : ''}`}
              onClick={() => onChangeMode('mock')}
            >
              Mock
            </button>
            <button
              type="button"
              className={`join-item btn btn-sm ${mode === 'auto' ? 'btn-primary' : ''}`}
              onClick={() => onChangeMode('auto')}
            >
              Auto
            </button>
            <button
              type="button"
              className={`join-item btn btn-sm ${mode === 'real' ? 'btn-primary' : ''}`}
              onClick={() => onChangeMode('real')}
            >
              Real
            </button>
          </div>
          <span className="badge badge-outline">{modeBadge}</span>
        </div>

        <div className="text-sm text-gray-500">
          {loading ? (
            '불러오는 중…'
          ) : error ? (
            <span className="text-error">{error}</span>
          ) : (
            `총 ${total}명`
          )}
        </div>
      </div>

      {/* 실제 테이블 (서버/목업 어느 쪽이든 동일하게 작동) */}
      <UsersTable
        rows={rows}
        total={total}
        loading={loading}
        totalPages={totalPages}
        onRequest={handleRequest}
      />
    </div>
  )
}
