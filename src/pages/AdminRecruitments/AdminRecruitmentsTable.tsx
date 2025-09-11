import { type Column, type TableState } from '@/types'
import type {
  RecruitmentItem,
  RecruitmentListRes,
  SortKey,
  Tag,
} from './AdminRecruitments.types'
import { listRecruitments, statusToKo } from './AdminRecruitments.mock'
import Badge from '@/components/ui/Badge/Badge'
import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '@/components/table/DataTable'

function normalizeTags(value: unknown): Tag[] {
  if (Array.isArray(value)) {
    return value as Tag[]
  }
  return []
}

function TechTagsCell({ value }: { value: unknown }) {
  const tags = normalizeTags(value)
  const maxVisible = 3
  const visible = tags.slice(0, maxVisible)
  const hidden = tags.slice(maxVisible)
  const hiddenCount = Math.max(0, tags.length - maxVisible)
  const hiddenLabel = hidden.map((t) => t.name).join(', ')

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((t) => (
        <Badge key={t.id ?? t.name} tone="gray">
          {t.name}
        </Badge>
      ))}
      {hiddenCount > 0 && (
        <Badge
          tone="gray"
          title={hiddenLabel}
          aria-label={`숨겨진 기술 태그: ${hiddenLabel}`}
        >
          +{hiddenCount}
        </Badge>
      )}
    </div>
  )
}

const columns: Column<RecruitmentItem>[] = [
  {
    id: 'id',
    header: 'ID',
    accessor: (r) => r.id,
    width: '80px',
    align: 'center',
  },
  { id: 'title', header: '공고 제목', accessor: 'title' },
  {
    id: 'tags',
    header: '태그',
    accessor: 'tags',
    width: '240px',
    cell: ({ value }) => <TechTagsCell value={value} />,
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
    id: 'views_count',
    header: '조회수',
    accessor: (r) => r.views_count,
    width: '80px',
    align: 'right',
  },
  {
    id: 'bookmarks_count',
    header: '북마크',
    accessor: (r) => r.bookmarks_count,
    width: '80px',
    align: 'right',
  },
  {
    id: 'created',
    header: '생성일시',
    accessor: (r) => r.created_at,
    width: '160px',
  },
  {
    id: 'updated',
    header: '수정일시',
    accessor: (r) => r.updated_at,
    width: '160px',
  },
]

// UI 정렬 상태 → API SortKey 매핑
// TableState 타입을 사용하는 곳에서 sort 타입을 통일
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
    case 'views_count':
      return 'views_desc' // 오름차순 미지원
    case 'bookmarks_count':
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
  const [rows, setRows] = useState<RecruitmentItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null) // 에러 상태 추가

  // API 쿼리 객체를 useMemo로 메모이제이션
  const apiQuery = useMemo(() => {
    return {
      page: state.page,
      size: state.pageSize,
      sort: mapTableSortToApi(state.sort as UnifiedSortState),
    }
  }, [state.page, state.pageSize, state.sort])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null) // 요청 시작 시 에러 초기화
      try {
        const res: RecruitmentListRes = await listRecruitments(apiQuery)
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
  }, [apiQuery])

  if (error) {
    return <div>데이터를 불러오는 중 오류가 발생했습니다: {error.message}</div>
  }

  return (
    <DataTable<RecruitmentItem>
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
