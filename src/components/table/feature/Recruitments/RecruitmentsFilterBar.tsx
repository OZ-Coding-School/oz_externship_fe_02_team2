import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input/Input'
import Dropdown from '@/components/ui/Dropdown/Dropdown'
import { SearchIcon } from 'lucide-react'
import { XIcon } from '@/components/ui/icons'
import {
  getRecruitmentTags,
  type SortKey,
  type StatusFilter,
} from '@/api/modules/recruitments'

type Props = {
  value: {
    queryText: string
    status: StatusFilter
    sortKey: SortKey
    tagId?: string | null
  }
  onChange: (patch: Partial<Props['value']>) => void
  className?: string
}

type Option = { value: string; label: string }

// 상태 옵션(타입 안전 유지용 소스) → Dropdown용 Option으로 변환
const STATUS_SRC = [
  { value: 'ALL', label: '전체' },
  { value: 'OPEN', label: '모집중' },
  { value: 'CLOSED', label: '마감' },
] as const
const STATUS_OPTIONS: Option[] = STATUS_SRC.map((o) => ({
  value: o.value,
  label: o.label,
}))

// 정렬 옵션(타입 안전 유지용 소스) → Dropdown용 Option으로 변환
const SORT_SRC: { value: SortKey; label: string }[] = [
  { value: 'created_desc', label: '최신순' },
  { value: 'created_asc', label: '오래된 순' },
  { value: 'views_desc', label: '조회수 순' },
  { value: 'bookmarks_desc', label: '북마크 순' },
]
const SORT_OPTIONS: Option[] = SORT_SRC.map((o) => ({
  value: o.value,
  label: o.label,
}))

export default function RecruitmentsFilterBar({
  value,
  onChange,
  className,
}: Props) {
  const [draft, setDraft] = useState(value.queryText)
  const [tagOptions, setTagOptions] = useState<Option[]>([
    { value: '', label: '전체' },
  ])
  const inputRef = useRef<HTMLInputElement>(null)

  // 외부 값 변경 시 동기화
  useEffect(() => setDraft(value.queryText), [value.queryText])

  // 태그 옵션 로드 (MSW 사용 시 옵션 없이 호출하면 mock 응답 사용)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const list = await getRecruitmentTags() // <-- { mock: true } 제거
        if (!mounted) return
        setTagOptions([
          { value: '', label: '전체' },
          ...list.map((t) => ({ value: String(t.id), label: t.name })),
        ])
      } catch {
        // 실패 시 '전체'만 유지
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const commitSearch = (text: string) => onChange({ queryText: text })

  return (
    <section className={`w-full ${className ?? ''}`}>
      {/* sm 이상에서 4등분, 모바일 1열 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        {/* 검색 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            검색
          </label>
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={(e) => commitSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter')
                  commitSearch((e.target as HTMLInputElement).value)
              }}
              placeholder="공고명 검색..."
              leftIcon={<SearchIcon className="h-4 w-4 text-gray-400" />}
              className="w-full pr-8"
            />
            {draft && (
              <button
                type="button"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                onClick={() => {
                  setDraft('')
                  commitSearch('')
                  inputRef.current?.focus()
                }}
                aria-label="검색어 지우기"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* 공고 상태 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            공고 상태
          </label>
          <Dropdown
            options={STATUS_OPTIONS}
            value={value.status}
            onChange={(v) => onChange({ status: (v || 'ALL') as StatusFilter })}
            placeholder="전체"
            classes={{ wrapper: 'w-full', button: 'w-full !min-w-0' }}
          />
        </div>

        {/* 태그 필터 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            태그 필터
          </label>
          <Dropdown
            options={tagOptions}
            value={value.tagId ?? ''}
            onChange={(v) => onChange({ tagId: v || undefined })}
            placeholder="태그 선택..."
            classes={{ wrapper: 'w-full', button: 'w-full !min-w-0' }}
          />
        </div>

        {/* 정렬 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            정렬
          </label>
          <Dropdown
            options={SORT_OPTIONS}
            value={value.sortKey}
            onChange={(v) =>
              onChange({ sortKey: (v as SortKey) || 'created_desc' })
            }
            placeholder="정렬 선택"
            classes={{ wrapper: 'w-full', button: 'w-full !min-w-0' }}
          />
        </div>
      </div>
    </section>
  )
}
