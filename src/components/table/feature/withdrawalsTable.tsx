// 회원 탈퇴 관리
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataTable } from '@components/table/DataTable'
import { fmtDate } from '@/lib/table'
import type { Column, TableState } from '@type/table'
import { roleToTone } from '@/lib/mappers'
import type { WithdrawalRow } from '../Table.types'
import Badge from '@/components/ui/Badge/Badge'

type WithdrawalTableProps = {
  rows: WithdrawalRow[]
  loading: boolean
  total?: number
  totalPages?: number
  onRequest?: (params: {
    page: number
    pageSize: number
    sort?: { id: string; desc: boolean } | null
  }) => void
  onRowClick?: (row: WithdrawalRow) => void
}

const columns: Column<WithdrawalRow>[] = [
  {
    id: 'id',
    header: '탈퇴요청 ID',
    accessor: 'id',
    width: '120px',
    sortable: true,
  },
  { id: 'email', header: '이메일', accessor: 'email', width: '220px' },
  {
    id: 'name',
    header: '이름',
    accessor: 'name',
    width: '100px',
    sortable: true,
  },
  {
    id: 'permission',
    header: '권한',
    accessor: 'permission',
    width: '100px',
    cell: ({ value }) => <Badge tone={roleToTone(value)}>{value}</Badge>,
  },
  {
    id: 'birthday',
    header: '생년월일',
    accessor: 'birthday', // 단순히 필드명만 사용
    width: '120px',
    cell: ({ value }) => value || '-', // cell에서 fallback 처리
  },
  {
    id: 'reason',
    header: '탈퇴 사유',
    accessor: 'reason', // 단순히 필드명만 사용
    width: '200px',
    cell: ({ value }) => (
      <span className="line-clamp-1">{value || '-'}</span> // cell에서 fallback 처리
    ),
  },
  {
    id: 'created_at',
    header: '탈퇴일시',
    accessor: (r) => fmtDate(r.created_at, { withTime: true }),
    width: '170px',
    sortable: true,
  },
]

export default function WithdrawalsTable({
  rows,
  total,
  totalPages,
  loading,
  onRequest,
  onRowClick,
}: WithdrawalTableProps) {
  const [state, setState] = useState<TableState>({
    page: 1,
    pageSize: 10,
    sort: null,
  })

  // DataTable이 상태를 바꾸면, 바로 서버 호출까지 함께 트리거
  const handleStateChange = useCallback(
    (next: Partial<TableState>) => {
      setState((s) => {
        const merged = { ...s, ...next }
        onRequest?.({
          page: merged.page,
          pageSize: merged.pageSize,
          sort: merged.sort,
        })
        return merged
      })
    },
    [onRequest]
  )

  // 최초 1회 또는 외부 deps에 따라 초기 로드
  useEffect(() => {
    onRequest?.({
      page: state.page,
      pageSize: state.pageSize,
      sort: state.sort,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 최초 한 번

  // ----  폴백: 서버 요청(onRequest)이 없을 때, 클라이언트에서 분할/총페이지 계산
  const totalCountFallback = rows.length
  const totalPagesFallback = Math.max(
    1,
    Math.ceil(totalCountFallback / Math.max(1, state.pageSize))
  )
  const finalTotalPages = Math.max(1, Number(totalPages ?? totalPagesFallback))

  const start = (state.page - 1) * state.pageSize
  const end = start + state.pageSize
  const displayRows = useMemo(
    () => (onRequest ? rows : rows.slice(start, end)),
    [onRequest, rows, start, end]
  )

  // onRequest 없을 때만 클램프(서버 모드에선 서버 결과를 신뢰)
  useEffect(() => {
    if (!onRequest && state.page > finalTotalPages) {
      setState((s) => ({ ...s, page: finalTotalPages }))
    }
  }, [onRequest, state.page, finalTotalPages])

  return (
    <DataTable<WithdrawalRow>
      columns={columns}
      data={displayRows} // 분할된 데이터(서버 모드면 원본 그대로)
      state={state}
      onStateChange={handleStateChange}
      meta={{
        rowKey: (r) => r.id,
        total: total ?? totalCountFallback,
        totalPages: finalTotalPages,
        loading,
        emptyText: '탈퇴 요청 내역이 없습니다.',
        enableClientSort: true,
      }}
      onRowClick={(row) => onRowClick?.(row)}
    />
  )
}
