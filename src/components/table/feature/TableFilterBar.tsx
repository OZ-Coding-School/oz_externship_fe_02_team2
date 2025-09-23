import React, { useCallback, useId, useMemo, useRef, useState } from 'react'
import type {
  EnhancedTableQuery,
  EnhancedTableFilterConfig,
  EnhancedQueryChangeHandlers,
} from '@/types/table'
import { XIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import { Input } from '@/components/ui/input/Input'
import { SearchIcon } from 'lucide-react'
import Dropdown from '@/components/ui/Dropdown/Dropdown'
import {
  DEFAULT_ROLE_PLACEHOLDER,
  DEFAULT_SEARCH_PLACEHOLDER,
  DEFAULT_STATUS_PLACEHOLDER,
  DEFAULT_WITHDRAWAL_PLACEHOLDER,
} from '@/constants/table/ui'
import { withAllOption } from './filterOption'
import { countActiveFilters } from '../filterHelpers'

// 탈퇴사유 상수 - 이제 중앙 타입에서 import 가능
// import { WITHDRAWAL_REASONS } from '@/types/table'

export type TableFilterBarProps = {
  query: EnhancedTableQuery
  onQueryChange: EnhancedQueryChangeHandlers
  config: EnhancedTableFilterConfig
  className?: string
  children?: React.ReactNode
  /** 각 필드 위에 라벨 노출 여부 */
  showLabels?: boolean
  /** 라벨 텍스트 커스터마이즈 */
  labels?: {
    search?: string
    status?: string
    role?: string
    withdrawalReason?: string
  }
}

export function TableFilterBar({
  query,
  onQueryChange,
  config,
  className,
  children,
  showLabels = false,
  labels = { search: '검색', status: '상태', role: '권한' },
}: TableFilterBarProps) {
  const panelId = useId()
  // query.search를 사용
  const [draft, setDraft] = useState<string>(query.search ?? '')
  const inputRef = useRef<HTMLInputElement>(null)
  const [mobileOpen] = useState(false)

  const {
    searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
    statusPlaceholder = DEFAULT_STATUS_PLACEHOLDER,
    rolePlaceholder = DEFAULT_ROLE_PLACEHOLDER,
    withdrawalReasonPlaceholder = DEFAULT_WITHDRAWAL_PLACEHOLDER,
    statusOptions = [],
    roleOptions = [],
    withdrawalReasonOptions = [],
  } = config

  // query.search가 변경되면 draft 동기화
  React.useEffect(() => {
    setDraft(query.search ?? '')
  }, [query.search])

  const commitNow = useCallback(
    (value: string) => {
      onQueryChange.setSearch(value, true)
    },
    [onQueryChange]
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setDraft(v)
    // 타이핑 중: 디바운스 적용
    onQueryChange.setSearch(v, false)
  }

  const statusDropdownOptions = useMemo(
    () => withAllOption(statusOptions, '전체'),
    [statusOptions]
  )

  const roleDropdownOptions = useMemo(
    () => withAllOption(roleOptions, '전체'),
    [roleOptions]
  )

  const activeFilterCount = useMemo(() => countActiveFilters(query), [query])

  const handleStatusChange = (value: string) => {
    onQueryChange.setStatus(value === '' ? undefined : value)
  }

  const handleRoleChange = (value: string) => {
    onQueryChange.setRole(value === '' ? undefined : value)
  }

  const handleWithdrawalReasonChange = (value: string) => {
    onQueryChange.setWithdrawalReason?.(value === '' ? undefined : value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitNow((e.currentTarget as HTMLInputElement).value)
    }
  }

  const handleClearSearch = () => {
    setDraft('')
    commitNow('')
    inputRef.current?.focus()
  }

  return (
    <section
      className={cn(
        'rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6',
        className
      )}
      role="search"
      aria-label="테이블 필터"
    >
      <div className="hidden items-end gap-4 sm:flex">
        {/* 4필드를 grid로 배치: 검색/상태/권한은 flex-1, 초기화는 auto */}
        <div className="grid w-full grid-cols-[1fr_1fr_1fr_auto] gap-4">
          {/* 검색 */}
          <div>
            {showLabels && (
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {labels.search ?? '검색'}
              </label>
            )}
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                value={draft}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                onCompositionEnd={(e) =>
                  onQueryChange.setSearch(
                    (e.currentTarget as HTMLInputElement).value,
                    false
                  )
                }
                onBlur={(e) =>
                  commitNow((e.currentTarget as HTMLInputElement).value)
                }
                placeholder={searchPlaceholder}
                enterKeyHint="search"
                leftIcon={<SearchIcon className="h-4 w-4 text-gray-400" />}
                size="md"
                className="w-full pr-10"
                aria-label="검색어 입력"
              />
              {draft && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="검색어 지우기"
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* 상태 */}
          <div className="w-full">
            {showLabels && (
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {labels.status ?? '상태'}
              </label>
            )}
            <div className="w-full">
              <Dropdown
                options={statusDropdownOptions}
                value={query.status || ''}
                onChange={handleStatusChange}
                placeholder={statusPlaceholder}
                classes={{
                  wrapper: 'w-full',
                  button: 'w-full !min-w-0 !bg-gray-100',
                }}
                aria-label="상태 필터"
              />
            </div>
          </div>

          {/* 권한 */}
          <div className="w-full">
            {showLabels && (
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {labels.role ?? '권한'}
              </label>
            )}
            <div className="w-full">
              <Dropdown
                options={roleDropdownOptions}
                value={query.role || ''}
                onChange={handleRoleChange}
                placeholder={rolePlaceholder}
                classes={{
                  wrapper: 'w-full',
                  button: 'w-full !min-w-0 !bg-gray-100',
                }}
                aria-label="권한 필터"
              />
            </div>
          </div>

          {/* 초기화 */}
          <div className="shrink-0">
            {showLabels && (
              <div className="mb-1 block text-sm font-medium text-gray-700 opacity-0">
                {/* 빈 라벨로 높이 맞춤 */}
                &nbsp;
              </div>
            )}
            <button
              type="button"
              onClick={onQueryChange.reset}
              className="body-sm inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-50"
              aria-label={`${activeFilterCount}개 필터 초기화`}
            >
              <XIcon className="h-4 w-4" />
              초기화
              <span
                className={cn(
                  'bg-primary-100 text-primary-700 body-xs ml-1 rounded-full px-1.5 py-0.5',
                  activeFilterCount === 0 && 'invisible'
                )}
              >
                {activeFilterCount || 0}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 접이식 패널 */}
      <div
        id={panelId}
        className={cn(
          'mt-4 grid grid-cols-1 gap-3 sm:hidden',
          mobileOpen ? 'block' : 'hidden'
        )}
      >
        {statusDropdownOptions.length > 0 && (
          <Dropdown
            options={statusDropdownOptions}
            value={query.status || ''}
            onChange={handleStatusChange}
            placeholder={statusPlaceholder}
            classes={{ button: 'w-full' }}
            aria-label="상태 필터(모바일)"
          />
        )}
        {roleDropdownOptions.length > 0 && (
          <Dropdown
            options={roleDropdownOptions}
            value={query.role || ''}
            onChange={handleRoleChange}
            placeholder={rolePlaceholder}
            classes={{ button: 'w-full' }}
            aria-label="권한 필터(모바일)"
          />
        )}
      </div>

      {children && (
        <div className="mt-2 border-t border-gray-200 pt-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {children}
          </div>
        </div>
      )}

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {activeFilterCount > 0
          ? `${activeFilterCount}개의 필터가 적용되었습니다.`
          : '모든 필터가 해제되었습니다.'}
        {query.search && ` 검색어: ${query.search}`}
        {query.status &&
          ` 상태: ${statusOptions.find((opt) => opt.value === query.status)?.label ?? query.status}`}
        {query.role &&
          ` 권한: ${roleOptions.find((opt) => opt.value === query.role)?.label ?? query.role}`}
        {query.reason &&
          ` 탈퇴사유: ${config.withdrawalReasonOptions?.find((opt) => opt.value === query.reason)?.label ?? query.reason}`}
      </div>
    </section>
  )
}
