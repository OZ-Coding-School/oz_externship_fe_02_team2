import React, { useCallback, useEffect, useMemo, useState } from 'react'

// 타입: 네 프로젝트 경로에 맞춰 그대로 사용
import type {
  RecruitmentItem,
  RecruitmentListRes,
  SortKey,
  Tag,
} from '@/pages/AdminRecruitments/AdminRecruitments.types'

import { TableFilterBar } from '@/components/table/feature/TableFilterBar'
import Modal from '@/components/ui/Modal/Modal'
import { Input } from '@/components/ui/input/Input'

// ✅ 테이블 타입 (네 프로젝트에 있으면 그걸로 교체)
// 예) import type { Column, TableState, SortState } from '@/types/table'
type SortState = { id: string; desc: boolean } | null
type TableState = {
  page: number
  pageSize: number
  sort: SortState
  search?: string
}
type Column<Row> = {
  id: string
  header:
    | string
    | ((p: { sort: SortState; onSort: () => void }) => React.ReactNode)
  accessor?: keyof Row
  width?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  cell?: (p: { row: Row; value: any }) => React.ReactNode
}

// ────────────────────────────────────────────────────────────────────────────
// 상수/유틸
// ────────────────────────────────────────────────────────────────────────────
type Row = RecruitmentItem

const STATUS_OPTIONS: Array<{
  value: 'ALL' | 'OPEN' | 'CLOSED'
  label: string
}> = [
  { value: 'ALL', label: '전체' },
  { value: 'OPEN', label: '모집중' },
  { value: 'CLOSED', label: '마감' },
]

const STATUS_LABEL: Record<'OPEN' | 'CLOSED', string> = {
  OPEN: '모집중',
  CLOSED: '마감',
}

const TAG_POOL: Tag[] = [
  { id: 'react', name: 'React' },
  { id: 'vue', name: 'Vue.js' },
  { id: 'angular', name: 'Angular' },
  { id: 'js', name: 'JavaScript' },
  { id: 'ts', name: 'TypeScript' },
  { id: 'spring', name: 'Spring Boot' },
  { id: 'node.js', name: 'Node.js' },
  { id: 'express', name: 'Express' },
  { id: 'nextjs', name: 'NextJS' },
  { id: 'java', name: 'Java' },
  { id: 'python', name: 'Python' },
  { id: 'django', name: 'Django' },
  { id: 'fast', name: 'FastAPI' },
  { id: 'flask', name: 'Flask' },
  { id: 'php', name: 'PHP' },
  { id: 'docker', name: 'Docker' },
  { id: 'kubernetes', name: 'Kubernetes' },
  { id: 'aws', name: 'AWS' },
  { id: 'azure', name: 'Azure' },
  { id: 'gcp', name: 'GCP' },
  { id: 'frontend', name: 'Frontend' },
  { id: 'backend', name: 'Backend' },
  { id: 'fullstack', name: 'Fullstack' },
  { id: 'devops', name: 'DevOps' },
  { id: 'ai', name: 'AI' },
  { id: 'ml', name: 'ML' },
]

// Table.sort → API SortKey 매핑
function toSortKey(sort: SortState): SortKey {
  if (!sort) return 'created_desc'
  const order = sort.desc ? 'desc' : 'asc'
  switch (sort.id) {
    case 'created_at':
      return order === 'desc' ? 'created_desc' : 'created_asc'
    case 'views_count':
      return 'views_desc'
    case 'bookmarks_count':
      return 'bookmarks_desc'
    default:
      return 'created_desc'
  }
}

// ────────────────────────────────────────────────────────────────────────────
// 페이지
// ────────────────────────────────────────────────────────────────────────────
export default function AdminRecruitmentsPage() {
  // 공용 Table 상태
  const [state, setState] = useState<TableState>({
    page: 1, // 1-based
    pageSize: 10,
    sort: { id: 'created_at', desc: true },
    search: '',
  })

  // 필터바 상태
  const [query, setQuery] = useState<{
    search: string
    status: 'ALL' | 'OPEN' | 'CLOSED'
    role: string | null
  }>({
    search: '',
    status: 'ALL',
    role: null,
  })

  // 태그 필터(필터바 children에서 모달로 선택)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [tagModalOpen, setTagModalOpen] = useState(false)
  const [tagSearchText, setTagSearchText] = useState('')

  // 서버 데이터
  const [data, setData] = useState<RecruitmentListRes | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 목록 호출 (MSW가 /api/v1/recruiting-posts 제공)
  useEffect(() => {
    const controller = new AbortController()
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const qs = new URLSearchParams()
        qs.set('page', String(state.page))
        qs.set('size', String(state.pageSize))
        if (query.search) qs.set('query', query.search)
        if (query.status) qs.set('status', query.status)
        if (selectedTagIds.length) qs.set('tagIds', selectedTagIds.join(','))
        qs.set('sortKey', toSortKey(state.sort!))
        const res = await fetch(`/api/v1/recruiting-posts?${qs.toString()}`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error('LIST_FETCH_FAILED')
        const json = (await res.json()) as RecruitmentListRes
        setData(json)
      } catch (e: any) {
        if (e?.name !== 'AbortError') setError(String(e?.message ?? e))
      } finally {
        setLoading(false)
      }
    })()
    return () => controller.abort()
  }, [
    state.page,
    state.pageSize,
    state.sort,
    query.search,
    query.status,
    selectedTagIds.join(','),
  ])

  const items = data?.items ?? []
  const totalPages = data ? Math.ceil(data.total / data.size) : 1

  // 공용 컬럼
  const columns: Column<Row>[] = useMemo(
    () => [
      {
        id: 'id',
        header: 'ID',
        accessor: 'id',
        width: '72px',
        cell: ({ value }) => <span className="text-gray-500">#{value}</span>,
      },
      {
        id: 'title',
        header: '공고 제목',
        accessor: 'title',
        cell: ({ value }) => <span className="font-semibold">{value}</span>,
      },
      {
        id: 'tags',
        header: '태그',
        width: '260px',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.tags.slice(0, 2).map((t) => (
              <span
                key={t.id}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
              >
                {t.name}
              </span>
            ))}
            {row.tags.length > 2 && (
              <span className="rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-500">
                +{row.tags.length - 2}
              </span>
            )}
          </div>
        ),
      },
      {
        id: 'deadline',
        header: '마감 기한',
        accessor: 'deadline',
        width: '120px',
        cell: ({ value }) => value ?? '-',
      },
      {
        id: 'status',
        header: '상태',
        accessor: 'status',
        width: '100px',
        cell: ({ value }) => (
          <span
            className={
              'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ' +
              (value === 'OPEN'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600')
            }
          >
            {STATUS_LABEL[value as 'OPEN' | 'CLOSED']}
          </span>
        ),
      },
      {
        id: 'views_count',
        header: ({ sort, onSort }) => (
          <button
            type="button"
            onClick={onSort}
            className="inline-flex items-center gap-1"
            aria-label="조회수 정렬"
          >
            조회수 <span>{sort ? (sort.desc ? '↑' : '↓') : ''}</span>
          </button>
        ),
        accessor: 'views_count',
        width: '100px',
        align: 'left',
        sortable: true,
      },
      {
        id: 'bookmarks_count',
        header: ({ sort, onSort }) => (
          <button
            type="button"
            onClick={onSort}
            className="inline-flex items-center gap-1"
            aria-label="북마크 정렬"
          >
            북마크 <span>{sort ? (sort.desc ? '↑' : '↓') : ''}</span>
          </button>
        ),
        accessor: 'bookmarks_count',
        width: '100px',
        align: 'left',
        sortable: true,
      },
      {
        id: 'created_at',
        header: ({ sort, onSort }) => (
          <button
            type="button"
            onClick={onSort}
            className="inline-flex items-center gap-1"
            aria-label="생성일시 정렬"
          >
            생성일시 <span>{sort ? (sort.desc ? '↑' : '↓') : ''}</span>
          </button>
        ),
        accessor: 'created_at',
        width: '160px',
        sortable: true,
      },
      {
        id: 'updated_at',
        header: '수정일시',
        accessor: 'updated_at',
        width: '160px',
      },
    ],
    []
  )

  // 필터바 콜백(TableFilterBar 규격)
  const onQueryChange = useMemo(
    () => ({
      setSearch: (next: string, immediate?: boolean) => {
        setQuery((q) => ({ ...q, search: next }))
        if (immediate) setState((s) => ({ ...s, page: 1 }))
      },
      setStatus: (next: string | null) => {
        const normalized = (next ?? 'ALL') as 'ALL' | 'OPEN' | 'CLOSED'
        setQuery((q) => ({ ...q, status: normalized }))
        setState((s) => ({ ...s, page: 1 }))
      },
      setRole: (_: string | null) => {}, // 역할 필터 안 씀
      reset: () => {
        setQuery({ search: '', status: 'ALL', role: null })
        setSelectedTagIds([])
        setState((s) => ({ ...s, page: 1 }))
      },
    }),
    []
  )

  // 필터바 설정
  const filterConfig = useMemo(
    () => ({
      statuses: STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
      roles: [],
      searchPlaceholder: '공고명 검색...',
      statusPlaceholder: '공고 상태',
      rolePlaceholder: '역할 선택',
    }),
    []
  )

  // 필터바 children: 태그 선택 모달
  const filterBarExtra = (
    <>
      <button
        type="button"
        className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm"
        onClick={() => setTagModalOpen(true)}
        aria-label="태그 필터"
      >
        태그 선택…
        {selectedTagIds.length > 0 && (
          <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {selectedTagIds.length}
          </span>
        )}
      </button>

      <Modal
        open={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        title="태그 선택"
        closeOnEsc
        closeOnBackdrop
      >
        <Modal.Body>
          <div className="mb-3">
            <Input
              value={tagSearchText}
              onChange={(e) => setTagSearchText(e.target.value)}
              placeholder="태그 검색"
              aria-label="태그 검색"
            />
          </div>
          <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1">
            {TAG_POOL.filter((t) =>
              t.name.toLowerCase().includes(tagSearchText.trim().toLowerCase())
            ).map((t) => {
              const checked = selectedTagIds.includes(t.id)
              return (
                <label
                  key={t.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 p-2"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      setSelectedTagIds((prev) =>
                        e.target.checked
                          ? [...prev, t.id]
                          : prev.filter((id) => id !== t.id)
                      )
                    }}
                  />
                  <span className="text-sm">{t.name}</span>
                </label>
              )
            })}
          </div>
        </Modal.Body>
        <Modal.Actions>
          <button
            type="button"
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
            onClick={() => setSelectedTagIds([])}
          >
            초기화
          </button>
          <button
            type="button"
            className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white"
            onClick={() => {
              setState((s) => ({ ...s, page: 1 }))
              setTagModalOpen(false)
            }}
          >
            적용하기
          </button>
        </Modal.Actions>
      </Modal>
    </>
  )

  // Table 상태 변경
  const handleStateChange = useCallback((next: Partial<TableState>) => {
    setState((prev) => ({ ...prev, ...next }))
  }, [])

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">스터디 구인 공고 관리</h1>

      <table<Row>
        columns={columns}
        data={items}
        state={state}
        onStateChange={handleStateChange}
        meta={{ totalPages }}
        toolbar={
          <TableFilterBar
            query={{
              search: query.search,
              status: query.status,
              role: query.role,
            }}
            onQueryChange={onQueryChange}
            config={filterConfig}
            className="mb-2"
          >
            {filterBarExtra}
          </TableFilterBar>
        }
        stickyHeader
        nowrapCells
      />

      {loading && <div className="mt-3 text-sm text-gray-500">로딩 중…</div>}
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </div>
  )
}
