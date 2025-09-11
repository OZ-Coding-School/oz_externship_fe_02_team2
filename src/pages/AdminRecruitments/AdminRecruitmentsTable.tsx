import { type Column, type TableState, type SortState } from '@/types'
import type {
  RecruitmentItem,
  RecruitmentListRes,
  RecruitmentStatusFilter,
  SortKey,
  Tag,
} from './AdminRecruitments.types'
import { listRecruitments, statusToKo } from './AdminRecruitments.mock'
import Badge from '@/components/ui/Badge/Badge'
import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '@/components/table/DataTable'
import AdminRecruitmentsFilters from './AdminRecruitmentFilter'

/** 태그 정규화 */
function normalizeTags(value: unknown): Tag[] {
  if (Array.isArray(value)) {
    return value as Tag[]
  }
  return []
}

/**
 * 태그 칩 렌더러
 * - 최대 3개까지 표시, 그 이상은 +N로 축약
 * - 축약 칩 title에 숨겨진 태그 전체 목록 제공(hover 시 툴팁)
 */
function TechTagsCell({ value }: { value: unknown }) {
  const tags = normalizeTags(value)
  const MAX_GRID_CELLS = 4
  const MAX_VISIBLE_TAGS = 3
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS)
  const hiddenTags = tags.slice(MAX_VISIBLE_TAGS)
  const hiddenCount = Math.max(0, tags.length - MAX_VISIBLE_TAGS)
  const hiddenLabel = hiddenTags.map((t) => t.name).join(', ')

  return (
    <div className="grid grid-cols-2 gap-1">
      {visibleTags.map((tag) => (
        <Badge key={tag.id ?? tag.name} tone="gray">
          {tag.name}
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
      {Array.from({
        length: Math.max(
          0,
          MAX_GRID_CELLS - (visibleTags.length + (hiddenCount > 0 ? 1 : 0))
        ),
      }).map((_, index) => (
        <span key={`placeholder-${index}`} />
      ))}
    </div>
  )
}

/** 테이블 컬럼 정의(정렬/폭/정렬 방향 등은 DataTable의 TableState와 연동) */
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
      <Badge tone={value === '모집중' ? 'green' : 'gray'}>{value}</Badge>
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
  /**
   * 날짜는 목 데이터에서 이미 "YYYY-MM-DD HH:MM" 문자열로 생성됨
   * - created_at/updated_at 그대로 표시하면 요구 포맷 충족
   */

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
type TableSort = SortState | null

function mapTableSortToApi(sort: TableSort): SortKey {
  // 1. 정렬 상태가 없으면 기본값 반환
  if (!sort) {
    return 'created_desc'
  }

  const { id, desc } = sort

  // 2. switch 문을 사용해 가독성 향상
  switch (id) {
    case 'created':
      return desc ? 'created_desc' : 'created_asc'
    case 'views_count':
      return 'views_desc' // 오름차순 미지원
    case 'bookmarks_count':
      return 'bookmarks_desc' // 오름차순 미지원
    default:
      // 3. 처리되지 않은 id에 대한 기본값 명시
      return 'created_desc'
  }
}

/** API SortKey → UI 정렬 상태(드롭다운 정렬과 테이블 헤더 정렬을 상호 동기화) */
function mapApiSortToTable(sortKey: SortKey): SortState {
  switch (sortKey) {
    case 'created_asc':
      return { id: 'created', desc: false }
    case 'created_desc':
      return { id: 'created', desc: true }
    case 'views_desc':
      return { id: 'views_count', desc: true }
    case 'bookmarks_desc':
      return { id: 'bookmarks_count', desc: true }
    default:
      return { id: 'created', desc: true }
  }
}

export default function RecruitmentsTable() {
  /** DataTable의 페이징/정렬 상태 */
  const [state, setState] = useState<TableState>({
    page: 1,
    pageSize: 10,
    sort: null,
  })

  /** 목록 데이터와 로딩/오류 상태 */
  const [rows, setRows] = useState<RecruitmentItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null) // 에러 상태 추가

  /**
   * 필터바 상태(검색어 + 상태 + 정렬)
   * - 검색어(queryText)와 상태(status)는 API 쿼리에 바로 반영
   * - sortKey는 테이블 헤더 정렬과 양방향 동기화
   */
  const [filters, setFilters] = useState<{
    queryText: string
    status: RecruitmentStatusFilter
    sortKey: SortKey
  }>({
    queryText: '',
    status: 'ALL',
    sortKey: 'created_desc',
  })

  /**
   * 필터 변경 핸들러(부분 업데이트 허용)
   * - 정렬 드롭다운이 바뀌면: 테이블의 정렬 상태도 함께 갱신(mapApiSortToTable)
   * - 검색어/상태가 바뀌면: 페이지는 1로 리셋(검색 조건 변경 시 첫 페이지부터)
   */
  const onChangeFilters = (next: Partial<typeof filters>) => {
    setFilters((prev) => {
      const merged = { ...prev, ...next }
      if (next.sortKey) {
        setState((s) => ({ ...s, sort: mapApiSortToTable(next.sortKey!) }))
      }
      if (next.queryText !== undefined || next.status !== undefined) {
        setState((s) => ({ ...s, page: 1 }))
      }
      return merged
    })
  }

  // API 쿼리 객체를 useMemo로 메모이제이션
  const apiQuery = useMemo(() => {
    return {
      q: filters.queryText,
      status: filters.status,
      page: state.page,
      size: state.pageSize,
      sort: mapTableSortToApi(state.sort as SortState),
    }
  }, [
    filters.queryText,
    filters.status,
    state.page,
    state.pageSize,
    state.sort,
  ])

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

  // 테이블 상태가 변경될 때 필터의 sortKey를 업데이트하는 useEffect
  useEffect(() => {
    const newSortKey = mapTableSortToApi(state.sort as SortState)
    if (newSortKey !== filters.sortKey) {
      setFilters((prev) => ({ ...prev, sortKey: newSortKey }))
    }
  }, [state.sort, filters.sortKey])

  return (
    <>
      <AdminRecruitmentsFilters value={filters} onChange={onChangeFilters} />
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
    </>
  )
}
