/** 공통 옵션 타입 */
export type SelectOption<Value extends string = string> = {
  value: Value
  label: string
  disabled?: boolean
}

export type CommonFilterBarProps<
  Status extends string = string,
  Sort extends string = string,
> = {
  value: {
    /** 검색어 */
    queryText: string
    /** 상태 값 */
    status: Status
    /** 정렬 키 */
    sortKey: Sort
  }
  /** 부분 업데이트 허용 */
  onChange: (
    next: Partial<{ queryText: string; status: Status; sortKey: Sort }>
  ) => void

  /** 드롭다운 옵션 */
  statusOptions: readonly SelectOption<Status>[]
  sortOptions: readonly SelectOption<Sort>[]

  /** 라벨/동작 커스터마이징 */
  searchLabel?: string
  searchPlaceholder?: string
  statusLabel?: string
  sortLabel?: string
  debounceMs?: number
  className?: string
}
