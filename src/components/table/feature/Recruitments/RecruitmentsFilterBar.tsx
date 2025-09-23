import React, { useMemo } from 'react'
import { TableFilterBar } from '@/components/table/feature/TableFilterBar'
import type { TableState, Maybe } from '@/types/table'

type BaseQuery = {
  search: string
  status: 'ALL' | 'OPEN' | 'CLOSED'
  role?: Maybe<string>
}

type Props = {
  tableState: TableState
  setTableState: React.Dispatch<React.SetStateAction<TableState>>
  query: BaseQuery
  setQuery: React.Dispatch<React.SetStateAction<BaseQuery>>
  className?: string
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'OPEN', label: '모집중' },
  { value: 'CLOSED', label: '마감' },
] as const

export default function RecruitmentsFilterBar({
  tableState,
  setTableState,
  query,
  setQuery,
  className,
}: Props) {
  // TableQuery 어댑트
  const tableQuery = useMemo(() => {
    const sortBy = (tableState.sort as any)?.id ?? 'created_at'
    const sortDir = (tableState.sort as any)?.desc ? 'desc' : 'asc'
    return {
      search: query.search ?? '',
      status: (query.status ?? 'ALL') as string,
      role: (query.role ?? null) as Maybe<string>,
      sortBy,
      sortDir,
      page: tableState.page,
      pageSize: tableState.pageSize,
    }
  }, [
    tableState.page,
    tableState.pageSize,
    tableState.sort,
    query.search,
    query.status,
    query.role,
  ])

  // onQueryChange 어댑트 (Maybe<string> 시그니처 준수)
  const onQueryChange = useMemo(
    () => ({
      setSearch: (q: string, immediate?: boolean) => {
        setQuery((prev) => ({ ...prev, search: q }))
        if (immediate) setTableState((prev) => ({ ...prev, page: 1 }))
      },
      setStatus: (status?: Maybe<string>) => {
        const normalized = (status ?? 'ALL') as 'ALL' | 'OPEN' | 'CLOSED'
        setQuery((prev) => ({ ...prev, status: normalized }))
        setTableState((prev) => ({ ...prev, page: 1 }))
      },
      setRole: (role?: Maybe<string>) => {
        setQuery((prev) => ({ ...prev, role: role ?? undefined }))
        setTableState((prev) => ({ ...prev, page: 1 }))
      },
      reset: () => {
        setQuery(() => ({ search: '', status: 'ALL', role: undefined }))
        setTableState((prev) => ({ ...prev, page: 1 }))
      },
    }),
    [setQuery, setTableState]
  )

  // TableFilterConfig (mode 필수)
  const filterConfig = useMemo(
    () => ({
      mode: 'compact', // 프로젝트 enum에 맞춰 필요시 변경
      searchPlaceholder: '공고명 검색...',
      statusPlaceholder: '공고 상태',
      rolePlaceholder: '역할 선택',
      statusOptions: STATUS_OPTIONS as unknown as {
        value: string
        label: string
      }[],
      roleOptions: [] as { value: string; label: string }[],
    }),
    []
  )

  return (
    <TableFilterBar
      className={className}
      query={tableQuery as any}
      onQueryChange={onQueryChange as any}
      config={filterConfig as any}
    />
  )
}
