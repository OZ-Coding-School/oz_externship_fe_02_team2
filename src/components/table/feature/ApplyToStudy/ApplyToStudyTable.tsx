// 스터디 그룹 관리
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataTable } from '@components/table/DataTable'
import type { Column, TableState } from '@type/table'
import { fmtDate } from '@/lib/table'
import Badge from '@/components/ui/Badge/Badge'
import type { ApplyToStudyRow } from '../../Table.types'

type ApplyToStudyProps = {
  rows: ApplyToStudyRow[]
  loading: boolean
  total?: number
  totalPages?: number
  onRequest?: (params: {
    page: number
    pageSize: number
    sort?: { id: string; desc: boolean } | null
  }) => void
  onRowClick?: (row: ApplyToStudyRow) => void
}

// 헬퍼: #APP001 형태로 표기
const formatAppId = (id: number | string) => {
  const n = String(id).replace(/\D/g, '')
  return `#APP${n.padStart(3, '0')}`
}
const statusTone = (s: string) =>
  s === '승인'
    ? 'green'
    : s === '검토 중'
      ? 'yellow'
      : s === '대기'
        ? 'blue'
        : s === '거절'
          ? 'red'
          : 'gray'

const columns: Column<ApplyToStudyRow>[] = [
  // ID
  {
    id: 'id',
    header: 'ID',
    width: '100px',
    accessor: (r) =>
      formatAppId((r as any).id ?? (r as any).applicationId ?? ''),
    align: 'left',
  },
  // 공고명
  {
    id: 'title',
    header: '공고명',
    width: '260px',
    accessor: (r) => (r as any).title ?? (r as any).recruitmentTitle ?? '',
    cell: ({ value }) => (
      <div className="truncate font-medium text-gray-900">{String(value)}</div>
    ),
    sortable: true,
  },
  // 지원자 정보 (닉네임 / 이메일)
  {
    id: 'applicant',
    header: '지원자 정보',
    width: '260px',
    accessor: (r) => {
      const row = r as any
      const nick =
        row.applicant?.nickname ?? row.nickname ?? row.userNickname ?? '-'
      const email = row.applicant?.email ?? row.email ?? row.userEmail ?? '-'
      return { nick, email }
    },
    cell: ({ value }) => (
      <div className="leading-tight whitespace-pre-line">
        <span className="font-medium text-gray-900">{value.nick}</span>
        {'\n'}
        <span className="text-sm text-gray-500">{value.email}</span>
      </div>
    ),
  },
  // 지원 상태
  {
    id: 'status',
    header: '지원 상태',
    width: '100px',
    accessor: (r) => (r as any).status ?? '',
    cell: ({ value }) => (
      <Badge tone={statusTone(String(value))}>{String(value)}</Badge>
    ),
  },
  // 지원일시
  {
    id: 'appliedAt',
    header: '지원일시',
    width: '170px',
    accessor: (r) => (r as any).appliedAt ?? (r as any).createdAt ?? '',
    cell: ({ value }) => (
      <span className="whitespace-nowrap">
        {fmtDate(value, { withTime: true /* seconds 옵션 있으면 true로 */ })}
      </span>
    ),
    sortable: true,
  },
  // 수정일시
  {
    id: 'updatedAt',
    header: '수정일시',
    width: '170px',
    accessor: (r) => (r as any).updatedAt ?? '',
    cell: ({ value }) => (
      <span className="whitespace-nowrap">
        {fmtDate(value, { withTime: true /* seconds 옵션 있으면 true로 */ })}
      </span>
    ),
  },
]

export default function ApplyToStudyTable({
  rows,
  total,
  loading,
  onRequest, // (추가) 서버 호출 트리거
  totalPages,
  onRowClick,
}: ApplyToStudyProps) {
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
    <DataTable<ApplyToStudyRow>
      columns={columns}
      data={displayRows}
      state={state}
      onStateChange={handleStateChange}
      meta={{
        rowKey: (r) => (r as any).id ?? (r as any).applicationId,
        total: total ?? totalCountFallback,
        enableClientSort: true,
        loading,
        emptyText: '지원 내역이 없습니다.',
        totalPages: finalTotalPages, //  API 또는 폴백 총페이지
      }}
      onRowClick={(row) => onRowClick?.(row)}
    />
  )
}
