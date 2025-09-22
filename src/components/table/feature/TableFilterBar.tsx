import React, { useCallback, useId, useMemo, useRef, useState } from 'react'
import type { TableFilterConfig, TableQuery } from '@/types/table'
import { XIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import { Input } from '@/components/ui/input/Input'
import { FilterIcon, SearchIcon } from 'lucide-react'
import Dropdown from '@/components/ui/Dropdown/Dropdown'
import {
  DEFAULT_ROLE_PLACEHOLDER,
  DEFAULT_SEARCH_PLACEHOLDER,
  DEFAULT_STATUS_PLACEHOLDER,
} from '@/constants/table/ui'
import { withAllOption } from './filterOption'
import { countActiveFilters } from '../filterHelpers'

/**
 * TableFilterBar
 * - 입력 중에는 상위 쿼리를 즉시 올리지 않고, 트레일링 디바운스(훅에서 300ms)로만 커밋
 * - Enter/blur 시에는 즉시 플러시(즉시 커밋)
 * - 한글 IME: 음절이 완성될 때 compositionend가 발생하므로, 여기서는 '즉시 커밋 금지'로 두고
 *   디바운스만 재스케줄
 */

export type TableFilterBarProps = {
  query: TableQuery
  onQueryChange: {
    setSearch: (q: string, immediate?: boolean) => void
    setStatus: (status: string | null) => void
    setRole: (role: string | null) => void
    reset: () => void
  }
  config: TableFilterConfig
  className?: string /** 추가 필터나 액션 버튼을 위한 슬롯 */
  children?: React.ReactNode
  showChildrenDivider?: boolean
  /** 기본 코어 필터(검색/상태/권한)의 가시 라벨 표시 여부 */
  showCoreLabels?: boolean
  /** 코어 필터 라벨 텍스트 커스터마이즈 */
  searchLabel?: string
  statusLabel?: string
  roleLabel?: string
  searchMaxWidthClassName?: string
  includeChildrenInMobilePanel?: boolean // 모바일 패널에 children 포함 여부 (기본 true)
  extraActiveCount?: number // children이 가진 활성 필터 개수(예: 선택된 태그 수)
  onResetExtras?: () => void // children 필터 초기화 핸들러
}

export function TableFilterBar({
  query,
  onQueryChange,
  config,
  className,
  children,
  showChildrenDivider = true,
  showCoreLabels = false,
  searchLabel = '검색어',
  statusLabel = '상태',
  roleLabel = '권한',
  searchMaxWidthClassName,
  includeChildrenInMobilePanel = true,
  extraActiveCount = 0,
  onResetExtras,
}: TableFilterBarProps) {
  const panelId = useId()
  const [draft, setDraft] = useState<string>(query.q ?? '')
  const inputRef = useRef<HTMLInputElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const {
    searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
    statusPlaceholder = DEFAULT_STATUS_PLACEHOLDER,
    rolePlaceholder = DEFAULT_ROLE_PLACEHOLDER,
    statusOptions = [],
    roleOptions = [],
  } = config

  const commitNow = useCallback(
    (value: string) => {
      // 즉시 커밋: 디바운스 큐를 비우고 바로 상위로 올리기(훅 내부에서 처리)
      onQueryChange.setSearch(value, true)
    },
    [onQueryChange]
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setDraft(v)
    // 타이핑 중: 트레일링 디바운스(300ms). 입력마다 "재스케줄"만 하고, 실제 커밋은 멈출 때 1회.
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

  const baseCount = useMemo(() => countActiveFilters(query), [query])
  const totalActiveCount = baseCount + (extraActiveCount ?? 0)

  const handleStatusChange = (value: string) => {
    onQueryChange.setStatus(value || null)
  }

  const handleRoleChange = (value: string) => {
    onQueryChange.setRole(value || null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 사용자가 명시적으로 Enter: 현재 값 즉시 반영
      commitNow((e.currentTarget as HTMLInputElement).value)
    }
  }

  const handleClearSearch = () => {
    setDraft('')
    commitNow('') // 즉시 초기화
    inputRef.current?.focus()
  }

  /** 기본 + children 필터를 함께 초기화 */
  const handleReset = useCallback(() => {
    onQueryChange.reset()
    onResetExtras?.()
    setDraft('')
  }, [onQueryChange, onResetExtras])

  return (
    <section
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-3 sm:p-4',
        className
      )}
      role="search"
      aria-label="테이블 필터"
    >
      {/* 한 줄 유지: sm이상에서 줄바꿈 방지 */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-nowrap sm:items-end sm:gap-3">
        {/* 검색 */}
        <div className={cn('relative min-w-0 flex-1', searchMaxWidthClassName)}>
          {showCoreLabels && (
            <label
              className="mb-1.5 block text-sm font-semibold text-gray-600"
              htmlFor="table-filterbar-search"
            >
              {searchLabel}
            </label>
          )}
          <Input
            id="table-filterbar-search"
            ref={inputRef}
            type="text"
            value={draft}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            onCompositionEnd={(e) =>
              onQueryChange.setSearch(
                (e.currentTarget as HTMLInputElement).value,
                false // IME 음절 확정 시에도 즉시 커밋 금지 -> '멈춤 후 1회 커밋' UX 유지
              )
            }
            onBlur={(e) =>
              // 포커스 아웃에서는 사용자가 타이핑을 끝낸 것으로 간주하고 즉시 커밋
              commitNow((e.currentTarget as HTMLInputElement).value)
            }
            placeholder={searchPlaceholder}
            enterKeyHint="search"
            leftIcon={<SearchIcon className="h-4 w-4 text-gray-400" />}
            size="md"
            className="w-full pr-10" // 오른쪽 X 자리 확보하는 css
            aria-label="검색어 입력"
          />
          {draft && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="검색어 지우기"
              className={cn(
                'absolute inset-y-0 right-2 flex items-center',
                'text-gray-500 hover:text-gray-800'
              )}
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls={panelId}
            className={cn(
              'body-sm inline-flex items-center gap-2 rounded-md border px-3 py-2',
              'border-gray-300 text-gray-700 hover:bg-gray-50'
            )}
          >
            <FilterIcon className="h-4 w-4" />
            필터
            <span
              className={cn(
                'bg-primary-100 text-primary-700 body-xs ml-1 rounded-full px-1.5 py-0.5',
                totalActiveCount === 0 && 'invisible' // 카운터 공간 유지 → 레이아웃 점프/깜빡임 방지
              )}
            >
              {totalActiveCount || 0}
            </span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={cn(
              'body-sm inline-flex items-center gap-1 rounded-md border px-3 py-2',
              'border-gray-300 text-gray-700 hover:bg-gray-50',
              totalActiveCount === 0 && 'invisible'
            )}
            aria-label={`${totalActiveCount}개 필터 초기화`}
          >
            <XIcon className="h-4 w-4" />
            초기화
          </button>
        </div>
        {/* 데스크톱: 코어 드롭다운 & 초기화 버튼 */}
        <div className="hidden shrink-0 items-end gap-2 sm:flex">
          {statusDropdownOptions.length > 0 && (
            <div className="w-40 shrink-0">
              {showCoreLabels && (
                <label className="mb-1.5 block text-sm font-semibold text-gray-600">
                  {statusLabel}
                </label>
              )}
              <Dropdown
                options={statusDropdownOptions}
                value={query.status || ''}
                onChange={handleStatusChange}
                placeholder={statusPlaceholder}
                classes={{ button: 'w-full' }}
                aria-label="상태 필터"
              />
            </div>
          )}
          {/* 권한 필터는 옵션이 있는 페이지에서만 노출됨 */}
          {roleDropdownOptions.length > 0 && (
            <div className="w-40 shrink-0">
              {showCoreLabels && (
                <label className="mb-1.5 block text-sm font-semibold text-gray-600">
                  {roleLabel}
                </label>
              )}
              <Dropdown
                options={roleDropdownOptions}
                value={query.role || ''}
                onChange={handleRoleChange}
                placeholder={rolePlaceholder}
                classes={{ button: 'w-full' }}
                aria-label="권한 필터"
              />
            </div>
          )}
          {totalActiveCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className={cn(
                'body-sm inline-flex items-center gap-1 rounded-md border px-3 py-2',
                'border-gray-300 text-gray-700 hover:bg-gray-50'
              )}
              aria-label={`${totalActiveCount}개 필터 초기화`}
            >
              <XIcon className="h-4 w-4" />
              초기화
              <span
                className={cn(
                  'bg-primary-100 text-primary-700 body-xs ml-1 rounded-full px-1.5 py-0.5'
                )}
              >
                {totalActiveCount}
              </span>
            </button>
          )}
        </div>
      </div>
      {/* 모바일 접이식 패널 */}
      <div
        id={panelId}
        className={cn(
          'mt-2 grid grid-cols-1 gap-2 sm:hidden',
          mobileOpen ? 'block' : 'hidden'
        )}
      >
        {/* 모바일: 상태/권한 블록 분리 (버그 수정) */}
        {statusDropdownOptions.length > 0 && (
          <div>
            {showCoreLabels && (
              <label className="mb-1.5 block text-sm font-semibold text-gray-600">
                {statusLabel}
              </label>
            )}
            <Dropdown
              options={statusDropdownOptions}
              value={query.status || ''}
              onChange={handleStatusChange}
              placeholder={statusPlaceholder}
              classes={{ button: 'w-full' }}
              aria-label="상태 필터(모바일)"
            />
          </div>
        )}
        {roleDropdownOptions.length > 0 && (
          <div>
            {showCoreLabels && (
              <label className="mb-1.5 block text-sm font-semibold text-gray-600">
                {roleLabel}
              </label>
            )}
            <Dropdown
              options={roleDropdownOptions}
              value={query.role || ''}
              onChange={handleRoleChange}
              placeholder={rolePlaceholder}
              classes={{ button: 'w-full' }}
              aria-label="권한 필터(모바일)"
            />
          </div>
        )}
        {/* children도 모바일 패널 안으로 이동 */}
        {includeChildrenInMobilePanel && children && (
          <div className="mt-2">{children}</div>
        )}
      </div>
      {children && (
        <div
          className={cn(
            'mt-2 pt-2',
            showChildrenDivider && 'border-t border-gray-200',
            includeChildrenInMobilePanel && 'hidden sm:block'
          )}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {children}
          </div>
        </div>
      )}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {totalActiveCount > 0
          ? `${totalActiveCount}개의 필터가 적용되었습니다.`
          : '모든 필터가 해제되었습니다.'}
        {query.q && ` 검색어: ${query.q}`}
        {query.status &&
          ` 상태: ${statusOptions.find((opt) => opt.value === query.status)?.label ?? query.status}`}
        {query.role &&
          ` 권한: ${roleOptions.find((opt) => opt.value === query.role)?.label ?? query.role}`}
      </div>
    </section>
  )
}
