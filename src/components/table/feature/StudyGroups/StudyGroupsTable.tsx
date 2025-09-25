// 스터디 그룹 관리
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataTable } from '@components/table/DataTable'
import type { Column, TableState } from '@type/table'
import { fmtDate } from '@/lib/table'
import Badge from '@/components/ui/Badge/Badge'
import type { StudyGroupRow } from '../../Table.types'

type StudyGroupsProps = {
  rows: StudyGroupRow[]
  loading: boolean
  total?: number
  totalPages?: number
  onRequest?: (params: {
    page: number
    pageSize: number
    sort?: { id: string; desc: boolean } | null
  }) => void
  onRowClick?: (row: StudyGroupRow) => void
}

const columns: Column<StudyGroupRow>[] = [
  {
    id: 'cover',
    header: '대표 이미지',
    accessor: 'coverImageUrl',
    width: '110px',
    align: 'center',
    cell: ({ value }) =>
      value ? (
        <img className="h-10 w-16 rounded object-cover" src={value} alt="" />
      ) : (
        '-'
      ),
  },
  {
    id: 'title',
    header: '그룹명',
    accessor: 'title',
    width: '200px',
    sortable: true,
  },
  {
    id: 'enroll',
    header: '인원 현황',
    accessor: (r) => (
      <div className="leading-tight whitespace-pre-line">
        <span className="font-medium">{r.enrolled}</span>
        {'\n'}
        <span className="font-normal">/ {r.capacity}명</span>
      </div>
    ),
    width: '120px',
    align: 'left',
  },
  {
    id: 'period',
    header: '스터디 기간',
    accessor: (r) => `${r.period.start} ~ ${r.period.end}`,
    width: '230px',
  },
  {
    id: 'status',
    header: '상태',
    accessor: 'status',
    width: '90px',
    cell: ({ value }) => (
      <Badge
        tone={
          value === '진행중' ? 'green' : value === '대기중' ? 'blue' : 'gray'
        }
      >
        {value}
      </Badge>
    ),
  },
  {
    id: 'created',
    header: '생성일시',
    accessor: (r) => fmtDate(r.createdAt, { withTime: true }),
    width: '160px',
    sortable: true,
  },
  {
    id: 'updated',
    header: '수정일시',
    accessor: (r) => fmtDate(r.updatedAt, { withTime: true }),
    width: '160px',
  },
]

export default function StudyGroupsTable({
  rows,
  total,
  loading,
  onRequest, // (추가) 서버 호출 트리거
  totalPages,
  onRowClick,
}: StudyGroupsProps) {
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
    <DataTable<StudyGroupRow>
      columns={columns}
      data={displayRows}
      state={state}
      onStateChange={handleStateChange}
      meta={{
        rowKey: (r) => r.id,
        total: total ?? totalCountFallback,
        enableClientSort: true,
        loading,
        emptyText: '스터디 그룹이 없습니다.',
        totalPages: finalTotalPages, //  API 또는 폴백 총페이지
      }}
      onRowClick={(row) => onRowClick?.(row)}
    />
  )
}
