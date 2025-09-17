import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { TableFilterConfig, TableQuery } from '@/types/table'
import { XIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import { Input } from '@/components/ui/input/Input'
import { FilterIcon, SearchIcon } from 'lucide-react'
import Dropdown from '@/components/ui/Dropdown/Dropdown'

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
}

export function TableFilterBar({
  query,
  onQueryChange,
  config,
  className,
  children,
}: TableFilterBarProps) {
  const panelId = useId()
  const [draft, setDraft] = useState<string>(query.q ?? '')
  const composingRef = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const {
    searchPlaceholder = '검색어를 입력하세요',
    statusPlaceholder = '상태 선택',
    rolePlaceholder = '권한 선택',
    statusOptions = [],
    roleOptions = [],
  } = config

  const commitNow = useCallback(
    (value: string) => {
      onQueryChange.setSearch(value, true) // 즉시 커밋(디바운스 우회)
    },
    [onQueryChange]
  )
  // 입력 변화: draft만 갱신, 상위 쿼리는 건드리지 않음
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setDraft(v)
    const isComposing =
      (e.nativeEvent as any).isComposing || composingRef.current
    // 조합 중에는 상위로 커밋하지 않음
    // 조합이 아니면 '디바운스 경로'로만 반영 (즉시 커밋 금지)
    if (!isComposing) {
      onQueryChange.setSearch(v)
    }
  }

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
    if ((query.q ?? '').trim()) count++
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 일부 환경에서 첫 onChange가 compositionstart보다 먼저 발생하는 이슈 대응
    // key === 'Process' 또는 keyCode === 229면 IME 조합 시작 신호로 간주
    const anyEvt = e as any
    if (e.key === 'Process' || anyEvt.keyCode === 229) {
      composingRef.current = true
    }
    const composing = (e.nativeEvent as any).isComposing || composingRef.current
    if (e.key === 'Enter' && !composing) {
      e.preventDefault()
      commitNow((e.currentTarget as HTMLInputElement).value)
    }
  }

  const handleClearSearch = () => {
    setDraft('')
    commitNow('') // 즉시 초기화
    inputRef.current?.focus()
  }

  // 외부 `query.q`가 변경되면(예: 초기화 버튼, URL 변경) 로컬 상태에 반영
  useEffect(() => {
    // 외부 쿼리 변경을 입력창에 반영하되,
    // 조합 중이거나 포커스 중이면 건드리지 않는다(리셋 방지).
    if (composingRef.current) return
    const isFocused = inputRef.current === document.activeElement
    if (isFocused) return
    setDraft(query.q ?? '')
  }, [query.q])

  return (
    <section
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-3 sm:p-4',
        className
      )}
      role="search"
      aria-label="테이블 필터"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="relative min-w-0 flex-1">
          <Input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={onChange}
            onKeyDown={handleKeyDown} // Enter 키 이벤트 핸들러 추가
            onCompositionStart={() => {
              composingRef.current = true
            }}
            onCompositionEnd={(e) => {
              composingRef.current = false
              const finalValue = (e.currentTarget as HTMLInputElement).value
              // 일부 환경에서 compositionend가 value 반영보다 먼저 올 수 있음 → 다음 틱에 즉시 커밋
              setTimeout(() => commitNow(finalValue), 0)
            }}
            onBlur={(e) => {
              // 블러: 마지막 값 즉시 커밋
              const v = (e.currentTarget as HTMLInputElement).value
              if (v !== (query.q ?? '')) commitNow(v)
            }}
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
            {activeFilterCount > 0 && (
              <span className="bg-primary-100 text-primary-700 body-xs ml-1 rounded-full px-1.5 py-0.5">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onQueryChange.reset}
              className={cn(
                'body-sm inline-flex items-center gap-1 rounded-md border px-3 py-2',
                'border-gray-300 text-gray-700 hover:bg-gray-50'
              )}
              aria-label={`${activeFilterCount}개 필터 초기화`}
            >
              <XIcon className="h-4 w-4" />
              초기화
            </button>
          )}
        </div>
        {/* 데스크탑: 필터 즉시 노출 */}
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {statusDropdownOptions.length > 0 && (
            <Dropdown
              options={statusDropdownOptions}
              value={query.status || ''}
              onChange={handleStatusChange}
              placeholder={statusPlaceholder}
              classes={{ button: 'w-40' }}
              aria-label="상태 필터"
            />
          )}
          {roleDropdownOptions.length > 0 && (
            <Dropdown
              options={roleDropdownOptions}
              value={query.role || ''}
              onChange={handleRoleChange}
              placeholder={rolePlaceholder}
              classes={{ button: 'w-40' }}
              aria-label="권한 필터"
            />
          )}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onQueryChange.reset}
              className={cn(
                'body-sm inline-flex items-center gap-1 rounded-md border px-3 py-2',
                'border-gray-300 text-gray-700 hover:bg-gray-50'
              )}
              aria-label={`${activeFilterCount}개 필터 초기화`}
            >
              <XIcon className="h-4 w-4" />
              초기화
              <span className="bg-primary-100 text-primary-700 body-xs ml-1 rounded-full px-1.5 py-0.5">
                {activeFilterCount}
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
        {query.q && ` 검색어: ${query.q}`}
        {query.status &&
          ` 상태: ${statusOptions.find((opt) => opt.value === query.status)?.label ?? query.status}`}
        {query.role &&
          ` 권한: ${roleOptions.find((opt) => opt.value === query.role)?.label ?? query.role}`}
      </div>
    </section>
  )
}
