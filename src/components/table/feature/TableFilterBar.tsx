import React, { useCallback, useId, useMemo, useRef, useState } from 'react'
import type {
  EnhancedTableQuery,
  EnhancedTableFilterConfig,
  EnhancedQueryChangeHandlers,
  FilterVisibilityOptions,
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
  /** 필터 표시 옵션 - 각 필터를 선택적으로 노출 */
  showFilters?: FilterVisibilityOptions
  /** 탈퇴사유 플레이스홀더 */
  withdrawalReasonPlaceholder?: string
  /** 그리드 컬럼 수 직접 지정 (선택사항, 미지정시 자동 계산) */
  gridColumns?: 1 | 2 | 3 | 4 | 5 | 6
}

export function TableFilterBar({
  query,
  onQueryChange,
  config,
  className,
  children,
  showLabels = false,
  labels = {
    search: '검색',
    status: '상태',
    role: '권한',
    withdrawalReason: '탈퇴사유',
  },
  showFilters = {
    search: true,
    status: true,
    role: true,
    reason: false,
  },
  gridColumns, // 새로 추가된 선택적 prop
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

  const withdrawalDropdownOptions = useMemo(
    () => withAllOption(withdrawalReasonOptions, '전체'),
    [withdrawalReasonOptions]
  )

  // 표시되는 필터들 계산
  const visibleFilters = useMemo(() => {
    const filters = []
    if (showFilters.search) filters.push('search')
    if (showFilters.status) filters.push('status')
    if (showFilters.role) filters.push('role')
    if (showFilters.reason) filters.push('reason')
    return filters
  }, [showFilters])

  // 그리드 컬럼 수 계산 (모든 필터 + 초기화 버튼은 항상 오른쪽 끝)
  // gridCols 계산 수정: auto 컬럼 제거
  const gridCols = useMemo(() => {
    const count = gridColumns ?? visibleFilters.length
    const safe = Math.min(Math.max(count, 1), 6) as 1 | 2 | 3 | 4 | 5 | 6
    const colsMap: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    }
    return colsMap[safe]
  }, [visibleFilters.length, gridColumns])

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
        {/* 동적 그리드 레이아웃 */}
        <div className={cn('grid w-full flex-1 gap-4 pb-2', gridCols)}>
          {/* 검색 */}
          {showFilters.search && (
            <div>
              {showLabels && (
                <label className="mb-2 block text-sm font-semibold text-gray-800">
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
                  className="w-full border-gray-300 bg-gray-50 pr-10 transition-colors duration-200 focus:border-blue-500 focus:bg-white"
                  aria-label="검색어 입력"
                />
                {draft && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="검색어 지우기"
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors duration-200 hover:text-gray-600"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 탈퇴사유 */}
          {showFilters.reason && (
            <div className="w-full">
              {showLabels && (
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  {labels.withdrawalReason ?? '탈퇴사유'}
                </label>
              )}
              <div className="w-full">
                <Dropdown
                  options={withdrawalDropdownOptions}
                  value={query.reason || ''}
                  onChange={handleWithdrawalReasonChange}
                  placeholder={withdrawalReasonPlaceholder}
                  classes={{
                    wrapper: 'w-full',
                    button:
                      'w-full !min-w-0 !bg-gray-50 !border-gray-300 hover:!bg-white hover:!border-blue-500 transition-colors duration-200',
                  }}
                  aria-label="탈퇴사유 필터"
                />
              </div>
            </div>
          )}

          {/* 상태 */}
          {showFilters.status && (
            <div className="w-full">
              {showLabels && (
                <label className="mb-2 block text-sm font-semibold text-gray-800">
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
                    button:
                      'w-full !min-w-0 !bg-gray-50 !border-gray-300 hover:!bg-white hover:!border-blue-500 transition-colors duration-200',
                  }}
                  aria-label="상태 필터"
                />
              </div>
            </div>
          )}

          {/* 권한 */}
          {showFilters.role && (
            <div className="w-full">
              {showLabels && (
                <label className="mb-2 block text-sm font-semibold text-gray-800">
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
                    button:
                      'w-full !min-w-0 !bg-gray-50 !border-gray-300 hover:!bg-white hover:!border-blue-500 transition-colors duration-200',
                  }}
                  aria-label="권한 필터"
                />
              </div>
            </div>
          )}
        </div>

        {/* 초기화 */}
        <div className="ml-auto shrink-0 pb-2">
          {showLabels && (
            <div className="mb-2 block text-sm font-semibold text-gray-800 opacity-0">
              &nbsp;
            </div>
          )}
          <button
            type="button"
            onClick={onQueryChange.reset}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition-all duration-200',
              'h-9',
              activeFilterCount > 0
                ? 'border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100'
                : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
            )}
            aria-label={`${activeFilterCount}개 필터 초기화`}
            disabled={activeFilterCount === 0}
          >
            <XIcon className="h-4 w-4" />
            초기화
            {activeFilterCount > 0 && (
              <span className="min-w-[20px] rounded-full bg-red-100 px-2 py-0.5 text-center text-xs text-red-800">
                {activeFilterCount}
              </span>
            )}
          </button>
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
        {showFilters.reason && (
          <Dropdown
            options={withdrawalDropdownOptions}
            value={query.reason || ''}
            onChange={handleWithdrawalReasonChange}
            placeholder={withdrawalReasonPlaceholder}
            classes={{ button: 'w-full !bg-gray-50' }}
            aria-label="탈퇴사유 필터(모바일)"
          />
        )}
        {showFilters.status && statusDropdownOptions.length > 0 && (
          <Dropdown
            options={statusDropdownOptions}
            value={query.status || ''}
            onChange={handleStatusChange}
            placeholder={statusPlaceholder}
            classes={{ button: 'w-full !bg-gray-50' }}
            aria-label="상태 필터(모바일)"
          />
        )}
        {showFilters.role && roleDropdownOptions.length > 0 && (
          <Dropdown
            options={roleDropdownOptions}
            value={query.role || ''}
            onChange={handleRoleChange}
            placeholder={rolePlaceholder}
            classes={{ button: 'w-full !bg-gray-50' }}
            aria-label="권한 필터(모바일)"
          />
        )}
      </div>
      {children && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
