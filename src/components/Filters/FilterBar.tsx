import { useDebounce } from '@/hooks'
import type { CommonFilterBarProps } from '@/types/filter'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Input } from '../ui/input/Input'
import Dropdown from '../ui/Dropdown/Dropdown'
import { cn } from '@/lib'

export default function FilterBar<Status extends string, Sort extends string>({
  value,
  onChange,
  statusOptions,
  sortOptions,
  searchLabel = '검색어',
  statusLabel = '상태',
  sortLabel = '정렬',
  debounceMs = 300,
  className,
}: CommonFilterBarProps<Status, Sort>) {
  const { queryText, status, sortKey } = value

  // 검색어는 디바운스 적용을 위해 로컬 상태로 들고 있다가, 멈추면 부모로 반영
  const [internalQueryText, setInternalQueryText] = useState(queryText)
  const debouncedQueryText = useDebounce(internalQueryText, debounceMs)

  // 외부에서 queryText가 리셋되거나 바뀐 경우 인풋 동기화
  useEffect(() => setInternalQueryText(queryText), [queryText])

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange // 매 렌더링마다 최신 함수를 참조

  // 디바운스 완료 시 부모에게 반영
  useEffect(() => {
    if (debouncedQueryText !== queryText)
      onChangeRef.current({ queryText: debouncedQueryText })
  }, [debouncedQueryText, queryText])

  // 드롭다운 value 안전 보정
  const statusValue = useMemo(
    () => status ?? statusOptions[0]?.value,
    [status, statusOptions]
  )
  const sortValue = useMemo(
    () => sortKey ?? sortOptions[0]?.value,
    [sortKey, sortOptions]
  )

  return (
    <div className={cn('mb-4 flex flex-wrap items-end gap-2', className)}>
      {/* 검색어 인풋 */}
      <div className="min-w-[280px] flex-1">
        <Input
          label={searchLabel}
          placeholder="제목으로 검색"
          value={internalQueryText}
          onChange={(e) => setInternalQueryText(e.currentTarget.value)}
        />
      </div>

      {/* 상태 드롭다운 */}
      <div>
        <label className={cn('body-sm mb-1.5 block text-gray-600')}>
          {statusLabel}
        </label>
        <Dropdown
          options={statusOptions}
          value={statusValue}
          onChange={(nextValue) => onChange({ status: nextValue as Status })}
        />
      </div>

      {/* 정렬 드롭다운 */}
      <div>
        <label className={cn('body-sm mb-1.5 block text-gray-600')}>
          {sortLabel}
        </label>
        <Dropdown
          options={sortOptions}
          value={sortValue}
          onChange={(nextValue) => onChange({ sortKey: nextValue as Sort })}
        />
      </div>
    </div>
  )
}
