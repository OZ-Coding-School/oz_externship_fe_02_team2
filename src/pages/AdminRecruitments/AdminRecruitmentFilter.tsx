import { useEffect, useMemo, useState } from 'react'
import type {
  AdminRecruitmentsFiltersProps,
  RecruitmentStatusFilter,
  SortKey,
} from './AdminRecruitments.types'
import { Input } from '@/components/ui/input/Input'
import Dropdown from '@/components/ui/Dropdown/Dropdown'

/** 상태 드롭다운 옵션(라벨은 화면 표시용, value는 API 파라미터로 사용) */
const statusOptions = [
  { value: 'ALL', label: '전체' },
  { value: 'OPEN', label: '모집중' },
  { value: 'CLOSED', label: '마감' },
] as const

/** 정렬 드롭다운 옵션 */
const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'created_desc', label: '최신순' },
  { value: 'created_asc', label: '오래된 순' },
  { value: 'views_desc', label: '조회수 순' },
  { value: 'bookmarks_desc', label: '북마크 순' },
]

/**
 * 필터바(검색어 + 상태 + 정렬)
 * - 검색어는 인풋 변경 시 300ms 디바운스로 부모에 반영(불필요한 API 호출 방지)
 * - 상태/정렬은 즉시 부모에 반영
 */
export default function AdminRecruitmentsFilters({
  value,
  onChange,
}: AdminRecruitmentsFiltersProps) {
  const { queryText, status, sortKey } = value

  /** 검색 인풋의 로컬 상태(디바운싱을 위해 부모값과 분리) */
  const [internalQueryText, setInternalQueryText] = useState(queryText)

  /** 부모에서 queryText가 외부 요인으로 바뀐 경우(리셋 등) 로컬 인풋도 동기화 */
  useEffect(() => setInternalQueryText(queryText), [queryText])

  /**
   * 디바운스: 타이핑 중에는 API 호출하지 않다가 300ms 입력이 멈추면 부모에 반영
   * - 부모 onChange는 부분 업데이트를 받기 때문에 { queryText }만 전달
   */

  const DELAY = 300

  useEffect(() => {
    const timer = setTimeout(() => {
      if (internalQueryText !== queryText) {
        onChange({ queryText: internalQueryText })
      }
    }, DELAY)
    return () => clearTimeout(timer)
  }, [internalQueryText, queryText, onChange])

  /** 드롭다운의 현재 선택값(언컨트롤 이슈 방지를 위한 기본값 보정) */
  const statusValue = useMemo(() => status ?? 'ALL', [status])
  const sortValue = useMemo(() => sortKey ?? 'created_desc', [sortKey])

  return (
    <div className="mb-4 flex flex-wrap items-end gap-2">
      {/* 검색어 인풋: 입력은 로컬 상태에만 즉시 반영 → 300ms 후 부모로 전달 */}
      <div className="min-w-[280px] flex-1">
        <Input
          label="검색어"
          placeholder="제목으로 검색"
          value={internalQueryText}
          onChange={(event) => setInternalQueryText(event.currentTarget.value)}
        />
      </div>

      {/* 상태 드롭다운: 선택 즉시 부모 onChange 호출 → 목록 API의 status 파라미터로 사용 */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-600">
          상태
        </label>
        <Dropdown
          options={statusOptions}
          value={statusValue}
          onChange={(nextValue) =>
            onChange({ status: nextValue as RecruitmentStatusFilter })
          }
        />
      </div>

      {/* 정렬 드롭다운: 선택 즉시 부모 onChange 호출 → 테이블 헤더 정렬과도 동기화됨 */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-600">
          정렬
        </label>
        <Dropdown
          options={sortOptions}
          value={sortValue}
          onChange={(nextValue) => onChange({ sortKey: nextValue as SortKey })}
        />
      </div>
    </div>
  )
}
