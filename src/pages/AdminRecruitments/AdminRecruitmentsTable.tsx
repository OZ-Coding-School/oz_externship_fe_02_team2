import {
  type Column,
  type TableState,
  type SortState,
  type TableFilterConfig,
} from '@/types'
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
import { useTableQuery } from '@/hooks/useTableQuery'
import { TableFilterBar } from '@/components/table/feature/TableFilterBar'
import Dropdown from '@/components/ui/Dropdown/Dropdown'
import { ChevronDown } from 'lucide-react'

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
        <Badge key={tag.id ?? tag.name} variant="secondary" size="sm">
          {tag.name}
        </Badge>
      ))}
      {hiddenCount > 0 && (
        <Badge
          variant="default"
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
      <Badge tone={value === '모집중' ? 'green' : 'gray'} size="sm">
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

  // switch 문을 사용해 가독성 향상
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
  /** 태그 필터 모달 오픈 상태(추후 모달 컴포넌트 연결) */
  const [isTagModalOpen, setTagModalOpen] = useState(false)

  // DataTable이 필요로 하는 totalPages 계산 (서버가 total만 줄 때)
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / state.pageSize)),
    [total, state.pageSize]
  )

  /**
   * 공용 필터 훅: q(디바운스), status(즉시), URL 동기화
   * - 역할(role)은 사용하지 않으므로 미사용
   */
  const queryActions = useTableQuery({
    syncUrl: true,
    debounceMs: 300,
  })

  /** 공용 필터바 설정 */
  const filterConfig: TableFilterConfig = useMemo(
    () => ({
      mode: 'server',
      searchPlaceholder: '공고명 검색...',
      statusPlaceholder: '공고 상태',
      // 권한 필터 미사용: 옵션을 비워두면 컴포넌트가 렌더링하지 않음
      rolePlaceholder: '',
      // 공용 컴포넌트가 '전체'를 자동 추가(withAllOption)하므로 OPEN/CLOSED만 넘김
      statusOptions: [
        { value: 'OPEN', label: '모집중' },
        { value: 'CLOSED', label: '마감' },
      ],
      roleOptions: [],
    }),
    []
  )

  /** 정렬 드롭다운 옵션 (children 슬롯에서 사용) */
  const sortOptions: { value: SortKey; label: string }[] = useMemo(
    () => [
      { value: 'created_desc', label: '최신순' },
      { value: 'created_asc', label: '오래된 순' },
      { value: 'views_desc', label: '조회수 순' },
      { value: 'bookmarks_desc', label: '북마크 순' },
    ],
    []
  )

  /** q/status 변경 시 페이지 1로 리셋 (검색 조건 변경) */
  useEffect(() => {
    setState((s) => ({ ...s, page: 1 }))
  }, [queryActions.query.q, queryActions.query.status])

  // API 쿼리 객체를 useMemo로 메모이제이션
  const apiQuery = useMemo(() => {
    const statusFilter: RecruitmentStatusFilter =
      (queryActions.query.status as RecruitmentStatusFilter) ?? 'ALL'
    return {
      q: queryActions.query.q ?? '',
      status: statusFilter,
      page: state.page,
      size: state.pageSize,
      sort: mapTableSortToApi(state.sort as SortState),
    }
  }, [
    queryActions.query.q,
    queryActions.query.status,
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

  // 정렬 드롭다운은 테이블 정렬 상태를 단방향 제어(드롭다운 → 테이블)
  const currentSortKey = useMemo<SortKey>(
    () => mapTableSortToApi(state.sort as SortState),
    [state.sort]
  )

  return (
    <>
      <div className="mb-4">
        <TableFilterBar
          query={queryActions.query}
          onQueryChange={{
            setSearch: queryActions.setSearch,
            setStatus: queryActions.setStatus,
            setRole: () => {}, // 미사용
            reset: queryActions.reset,
          }}
          config={filterConfig}
          /* 코어 필터(검색/상태) 라벨 가시화 */
          showCoreLabels
          searchLabel="검색어"
          statusLabel="상태"
          /* 한 줄 유지 위해 검색 최대폭 제한 */
          searchMaxWidthClassName="sm:w-[520px]"
          /* 데스크톱에서도 children(정렬/태그)을 같은 줄에 배치 */
          childrenPlacement="inline"
          /* 모바일 패널에도 children 포함 */
          includeChildrenInMobilePanel
        >
          {/* 정렬 드롭다운: 공용 필터바의 children 슬롯 활용 */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-600">
              정렬
            </label>
            <Dropdown
              options={sortOptions}
              value={currentSortKey}
              onChange={(nextValue) =>
                setState((s) => ({
                  ...s,
                  sort: mapApiSortToTable(nextValue as SortKey),
                }))
              }
              classes={{ button: 'w-36' }}
            />
          </div>
          {/* 태그 필터: 모달 트리거(스샷처럼 셀렉트 형태의 버튼 UI) */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-600">
              태그 필터
            </label>
            <button
              type="button"
              onClick={() => setTagModalOpen(true)}
              className="relative inline-flex h-9 w-40 items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span className="truncate">태그 선택...</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </TableFilterBar>
      </div>
      <DataTable<RecruitmentItem>
        columns={columns}
        data={rows}
        state={state}
        onStateChange={(n) => setState((s) => ({ ...s, ...n }))}
        meta={{
          rowKey: (r) => r.id,
          // 서버 페이징 모드에서 DataTable이 페이지 수를 알도록 totalPages를 제공
          totalPages,
          // 서버가 정렬/페이징을 담당 → 클라 정렬 비활성화
          enableClientSort: false,
          // 서버 페이징 사용(명시)
          clientPaging: false,
          loading: loading && rows.length === 0,
          emptyText: '구인 공고가 없습니다.',
        }}
      />
      {/* TODO: 태그 필터 모달 컴포넌트 연결 지점 */}
      {/* {isTagModalOpen && (
    <TagFilterModal
      selectedTagIds={selectedTagIds}
      onApply={(ids) => { setSelectedTagIds(ids); setTagModalOpen(false) }}
      onClose={() => setTagModalOpen(false)}
    />
  )} */}
    </>
  )
}
