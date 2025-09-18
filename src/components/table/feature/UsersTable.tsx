// 회원 관리
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataTable } from '@components/table/DataTable'
import { fmtDate } from '@/lib/table'
import type { Column, TableState } from '@type/table'
import { roleToTone, statusToTone } from '@/lib/mappers'
import Badge from '@/components/ui/Badge/Badge'
import type { UserRow } from '../Table.types'

const columns: Column<UserRow>[] = [
  {
    id: 'memberId',
    header: '회원 ID',
    accessor: 'memberId',
    width: '90px',
  },
  { id: 'email', header: '이메일', accessor: 'email', width: '220px' },
  { id: 'nickname', header: '닉네임', accessor: 'nickname' },
  { id: 'name', header: '이름', accessor: 'name', width: '90px' },
  { id: 'birth', header: '생년월일', accessor: 'birth', width: '120px' },
  {
    id: 'role',
    header: '권한',
    accessor: 'role',
    width: '100px',
    cell: ({ value }) => <Badge tone={roleToTone(value)}>{value}</Badge>,
  },
  {
    id: 'status',
    header: '상태',
    accessor: 'status',
    width: '100px',
    cell: ({ value }: { value: UserRow['status'] }) => (
      <Badge tone={statusToTone[value]}>{value}</Badge>
    ),
  },
  {
    id: 'joinedAt',
    header: '가입일',
    accessor: (r) => fmtDate(r.joinedAt, { withTime: false }),
    width: '150px',
  },
  {
    id: 'withdrawnAt',
    header: '탈퇴요청일',
    accessor: (r) =>
      r.withdrawnAt ? fmtDate(r.withdrawnAt, { withTime: false }) : '-',
    width: '160px',
  },
]

export default function UsersTable({
  rows,
  total,
  loading,
  onRequest, // (추가) 서버 호출 트리거
  totalPages,
}: {
  rows: UserRow[]
  total?: number
  loading: boolean
  totalPages?: number
  onRequest?: (params: {
    page: number
    pageSize: number
    sort?: { id: string; desc: boolean } | null
  }) => void
}) {
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
    <DataTable<UserRow>
      columns={columns}
      //data={rows}
      data={displayRows} // 분할된 데이터(서버 모드면 원본 그대로)
      state={state}
      onStateChange={handleStateChange}
      meta={{
        rowKey: (r) => r.memberId,
        total: total ?? totalCountFallback,
        enableClientSort: true,
        loading,
        emptyText: '회원이 없습니다.',
        totalPages: finalTotalPages, //  API 또는 폴백 총페이지
      }}
    />
  )
}
