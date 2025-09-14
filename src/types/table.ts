/* eslint-disable @typescript-eslint/no-explicit-any */
export type Align = 'left' | 'center' | 'right'

export type SortState = { id: string; desc: boolean } | null

export type Column<T> = {
  /** 고유 id */
  id: string
  /** 헤더 텍스트 또는 렌더러 */
  header:
    | string
    | ((c: { sort: SortState; onSort: () => void }) => React.ReactNode)
  /** 셀 값 접근자: key 문자열 or 함수 */
  accessor?: keyof T | ((row: T) => unknown)
  /** 셀 렌더러(값, 행 단위 가공) */
  cell?: (ctx: { value: any; row: T; rowIndex: number }) => React.ReactNode
  /** 정렬 가능 */
  sortable?: boolean
  /** 폭/정렬/숨김 */
  width?: string
  align?: Align
  hidden?: boolean
}

export type TableState = {
  page: number // 1-based
  pageSize: number
  sort: SortState
  search?: string
}

export type TableMeta<T> = {
  totalPages?: number
  rowKey: (row: T, index: number) => string | number
  total?: number // 서버 페이지네이션일 때 전체 개수
  loading?: boolean
  emptyText?: string
}

export type SortDirection = 'asc' | 'desc' | null

export type FilterOption = {
  value: string
  label: string
  disabled?: boolean
}

export type TableQuery = {
  q: string // 검색어
  status: string | null // 상태 필터
  role: string | null // 권한 필터
  sortBy: string | null // 정렬 컬럼
  sortDir: SortDirection // 정렬 방향
  page: number // 현재 페이지
  pageSize: number // 페이지당 항목 수
}

export type TableFilterConfig = {
  searchPlaceholder?: string
  statusPlaceholder?: string
  rolePlaceholder?: string
  statusOptions?: FilterOption[]
  roleOptions?: FilterOption[]
  debounceMs?: number
  mode: 'client' | 'server'
}

export type TableData<T = Record<string, any>> = {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type UseTableQueryOptions = {
  initialQuery?: Partial<TableQuery>
  onQueryChange?: (query: TableQuery) => void | Promise<void>
  syncUrl?: boolean
}
