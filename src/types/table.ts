/* eslint-disable @typescript-eslint/no-explicit-any */
export type Align = 'left' | 'center' | 'right'

export type SortState = { id: string; desc: boolean } | null

/** 정렬 방향(쿼리/URL 표현) */
export type SortDir = 'asc' | 'desc'

/** 드롭다운 공용 옵션 */
export type SelectOption<Value extends string = string> = {
  value: Value
  label: string
  disabled?: boolean
}

/** 테이블 컬럼 정의 */
export type HeaderRenderContext = {
  /** 현재 전체 정렬 상태 */
  sort: SortState
  /** 이 컬럼을 기준으로 정렬 토글 */
  onSort: () => void
  /** 이 컬럼이 정렬 중인지 */
  isSorted: boolean
  /** 이 컬럼 정렬 방향(null은 정렬 아님) */
  dir: SortDir | null
  /** a11y용 aria-sort */
  ariaSort: 'ascending' | 'descending' | 'none'
}

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
  q?: string
  search?: string
}

export type TableMeta<T> = {
  totalPages?: number
  rowKey: (row: T, index: number) => string | number
  total?: number // 서버 페이지네이션일 때 전체 개수
  loading?: boolean
  emptyText?: string
}

/** URL 쿼리 모델 (?q=&status=&role=&sort=col.asc&page=1&size=20) */
export type TableQuery<
  Status extends string = string,
  Role extends string = string,
> = {
  q: string
  status: Status | 'ALL' | ''
  role: Role | 'ALL' | ''
  sortBy: string // 'created_at' | 'bookmarks_count' | 'views_count' ...
  sortDir: SortDir // 'asc' | 'desc'
  page: number // 1-based
  size: number // pageSize
}

/** 정렬 파라미터 인코딩: 'col.dir' */
export function encodeSort(sortBy: string, sortDir: SortDir) {
  return sortBy ? `${sortBy}.${sortDir}` : ''
}

/** 정렬 파라미터 디코딩: 'col.dir' -> { sortBy, sortDir } */
export function decodeSort(sort: string | null): {
  sortBy: string
  sortDir: SortDir
} {
  if (!sort) return { sortBy: '', sortDir: 'asc' }
  const [by, dir] = sort.split('.')
  return { sortBy: by ?? '', sortDir: dir === 'desc' ? 'desc' : 'asc' }
}

/** URL 정렬표현 -> 테이블 SortState */
export function decodeSortToState(sort: string | null): SortState {
  const { sortBy, sortDir } = decodeSort(sort)
  if (!sortBy) return null
  return { id: sortBy, desc: sortDir === 'desc' }
}

/** 테이블 SortState -> URL 정렬표현 */
export function encodeStateToSort(s: SortState): string {
  if (!s) return ''
  return encodeSort(s.id, s.desc ? 'desc' : 'asc')
}

/** 현재 정렬 상태에서 컬럼을 클릭했을 때 다음 상태 계산 */
export function nextSortState(current: SortState, colId: string): SortState {
  if (!current || current.id !== colId) return { id: colId, desc: false } // asc 시작
  return { id: colId, desc: !current.desc } // asc <-> desc 토글
}

/** a11y용 aria-sort 계산 */
export function ariaSortFor(
  columnId: string,
  sort: SortState
): 'ascending' | 'descending' | 'none' {
  if (!sort || sort.id !== columnId) return 'none'
  return sort.desc ? 'descending' : 'ascending'
}

/* ---------------- 도메인 값 타입(필요 시) ---------------- */

// 회원 관리 페이지 권한
export type MemberRole = 'ALL' | 'ADMIN' | 'STAFF' | 'USER'

// 회원 관리 페이지 상태
export type MemberStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'WITHDRAWAL_REQUEST'

// 회원 탈퇴 관리 페이지 상태(사유 카테고리)
export type WithdrawalStatus =
  | 'ALL'
  | 'SERVICE_DISSATISFACTION'
  | 'PRIVACY_CONCERN'

// 스터디 그룹관리 페이지 스터디 상태
export type StudyStatus = 'ALL' | 'IN_PROGRESS' | 'PENDING'

// 스터디 구인 공고 관리 페이지 공고 상태
export type RecruitmentStatusFilter = 'ALL' | 'OPEN' | 'CLOSED'
