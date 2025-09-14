import React, { useMemo } from 'react'
import type { TableFilterConfig, TableQuery } from '@/types/table'
import { XIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import { Input } from '@/components/ui/input/Input'
import { SearchIcon } from 'lucide-react'
import Dropdown from '@/components/ui/Dropdown/Dropdown'

export type TableFilterBarProps = {
  query: TableQuery
  onQueryChange: {
    setSearch: (q: string) => void
    setStatus: (status: string | null) => void
    setRole: (role: string | null) => void
    reset: () => void
  }
  config: TableFilterConfig
  className?: string /** 추가 필터나 액션 버튼을 위한 슬롯 */
  children?: React.ReactNode
}

export function TableFilterBar({
  query,
  onQueryChange,
  config,
  className,
  children,
}: TableFilterBarProps) {
  const {
    searchPlaceholder = '검색어를 입력하세요',
    statusPlaceholder = '상태 선택',
    rolePlaceholder = '권한 선택',
    statusOptions = [],
    roleOptions = [],
  } = config

  const statusDropdownOptions = useMemo(() => {
    if (statusOptions.length === 0) return []
    return [{ value: '', label: '전체 상태' }, ...statusOptions]
  }, [statusOptions])

  const roleDropdownOptions = useMemo(() => {
    if (roleOptions.length === 0) return []
    return [{ value: '', label: '전체 권한' }, ...roleOptions]
  }, [roleOptions])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (query.q.trim()) count++
    if (query.status) count++
    if (query.role) count++
    return count
  }, [query.q, query.status, query.role])

  const handleStatusChange = (value: string) => {
    onQueryChange.setStatus(value || null)
  }

  const handleRoleChange = (value: string) => {
    onQueryChange.setRole(value || null)
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4',
        className
      )}
      role="search"
      aria-label="테이블 필터"
    >
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <Input
            type="text"
            value={query.q}
            onChange={(e) => onQueryChange.setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            leftIcon={<SearchIcon className="h-4 w-4 text-gray-400" />}
            size="md"
            className="w-full"
            aria-label="검색어 입력"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {statusDropdownOptions.length > 0 && (
            <Dropdown
              options={statusDropdownOptions}
              value={query.status || ''}
              onChange={handleStatusChange}
              placeholder={statusPlaceholder}
              classes={{ button: 'w-36' }}
              aria-label="상태 필터"
            />
          )}
          {roleDropdownOptions.length > 0 && (
            <Dropdown
              options={roleDropdownOptions}
              value={query.role || ''}
              onChange={handleRoleChange}
              placeholder={rolePlaceholder}
              classes={{ button: 'w-36' }}
              aria-label="권한 필터"
            />
          )}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onQueryChange.reset}
              className={cn(
                'flex items-center gap-1 px-3 py-2 text-sm',
                'text-gray-600 hover:text-gray-900',
                'rounded-lg border border-gray-300',
                'hover:bg-gray-50',
                'transition-colors duration-150',
                'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring-2'
              )}
              aria-label={`${activeFilterCount}개 필터 초기화`}
            >
              <XIcon className="h-4 w-4" /> <span>초기화</span>
              <span className="bg-primary-100 text-primary-700 ml-1 rounded-full px-1.5 py-0.5 text-xs">
                {activeFilterCount}
              </span>
            </button>
          )}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-2 border-t border-gray-200 pt-2">
          {children}
        </div>
      )}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {activeFilterCount > 0
          ? `${activeFilterCount}개의 필터가 적용되었습니다.`
          : '모든 필터가 해제되었습니다.'}
        {query.q && ` 검색어: ${query.q}`}
        {query.status &&
          ` 상태: ${statusOptions.find((opt) => opt.value === query.status)?.label}`}
        {query.role &&
          ` 권한: ${roleOptions.find((opt) => opt.value === query.role)?.label}`}
      </div>
    </div>
  )
}
