import { type Column, type TableState } from '@/types'
import Badge from '@/components/ui/Badge/Badge'
import { fmtDate } from '@/lib'
import { useEffect, useState } from 'react'
import { DataTable } from '@/components/table/DataTable'
import type {
  RecruitmentItem,
  RecruitmentListRes,
  SortKey,
} from '@/pages/admin-recruitments/admin-recruitments.types'
import {
  listRecruitments,
  statusToKo,
} from '@/pages/admin-recruitments/admin-recruitments.mock'

type Row = RecruitmentItem

const columns: Column<Row>[] = [
  { id: 'title', header: '공고 제목', accessor: 'title' },
  {
    id: 'tags',
    header: '태그',
    accessor: (r) => r.tags.map((t) => t.name).join(', '),
    width: '240px',
  },
  {
    id: 'deadline',
    header: '마감 기한',
    accessor: (r) => r.deadline ?? '-',
    width: '120px',
  },
  {
    id: 'status',
    header: '상태',
    accessor: (r) => statusToKo(r.status),
    width: '90px',
    cell: ({ value }) => (
      <Badge
        tone={
          value === '모집중' ? 'green' : value === '대기중' ? 'blue' : 'gray'
        }
      >
        {value}
      </Badge>
    ),
  },
  {
    id: 'views',
    header: '조회수',
    accessor: (r) => r.views_count,
    width: '80px',
    align: 'right',
  },
  {
    id: 'bm',
    header: '북마크',
    accessor: (r) => r.bookmarks_count,
    width: '80px',
    align: 'right',
  },
  {
    id: 'created',
    header: '생성일시',
    accessor: (r) => fmtDate(r.created_at),
    width: '160px',
  },
  {
    id: 'updated',
    header: '수정일시',
    accessor: (r) => fmtDate(r.updated_at),
    width: '160px',
  },
]

// UI 정렬 상태 → API SortKey 매핑
// TableState 타입을 사용하는 곳에서 sort 타입을 통일
// 예: { id: 'created', direction: 'desc' } | null
type UnifiedSortState = { id: string; direction: 'asc' | 'desc' } | null

function mapTableSortToApi(sort: UnifiedSortState): SortKey {
  // 1. 정렬 상태가 없으면 기본값 반환
  if (!sort) {
    return 'created_desc'
  }

  const { id, direction } = sort

  // 2. switch 문을 사용해 가독성 향상
  switch (id) {
    case 'created':
      return direction === 'asc' ? 'created_asc' : 'created_desc'
    case 'views':
      return 'views_desc' // 오름차순 미지원
    case 'bm':
      return 'bookmarks_desc' // 오름차순 미지원
    default:
      // 3. 처리되지 않은 id에 대한 기본값 명시
      return 'created_desc'
  }
}

export default function RecruitmentsTable() {
  const [state, setState] = useState<TableState>({
    page: 1,
    pageSize: 10,
    sort: null,
  })
  const [rows, setRows] = useState<Row[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null) // 에러 상태 추가
  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null) // 요청 시작 시 에러 초기화
      try {
        const res: RecruitmentListRes = await listRecruitments({
          page: state.page,
          size: state.pageSize,
          sort: mapTableSortToApi(state.sort as UnifiedSortState),
        })
        setRows(res.items)
        setTotal(res.total)
      } catch (err) {
        console.error('구인글 불러오기를 실패했습니다. :', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [state.page, state.pageSize, state.sort])

  if (error) {
    return <div>데이터를 불러오는 중 오류가 발생했습니다: {error.message}</div>
  }

  return (
    <DataTable<Row>
      columns={columns}
      data={rows}
      state={state}
      onStateChange={(n) => setState((s) => ({ ...s, ...n }))}
      meta={{
        rowKey: (r) => r.id,
        total,
        loading,
        emptyText: '구인 공고가 없습니다.',
      }}
    />
  )
}
