import { useState } from 'react'
import Modal from '../../Modal'
import Badge from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button'

const AVAILABLE_TAGS = [
  'React',
  'Vue.js',
  'Angular',
  'JavaScript',
  'TypeScript',
  'Spring Boot',
  'Node.js',
  'Express',
  'NestJS',
  'Java',
  'Python',
  'Django',
  'FastAPI',
  'Flask',
  'PHP',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'Frontend',
  'Backend',
  'Full Stack',
  'DevOps',
]

export type TagFilterModalProps = {
  open: boolean
  onClose: () => void
  selectedTags: string[]
  onApply: (tags: string[]) => void
}

export default function TagFilterModal({
  open,
  onClose,
  selectedTags: initialSelectedTags,
  onApply,
}: TagFilterModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [localSelectedTags, setLocalSelectedTags] =
    useState<string[]>(initialSelectedTags)

  // open이 변경될 때마다 로컬 상태를 초기화
  useState(() => {
    if (open) {
      setLocalSelectedTags(initialSelectedTags)
      setSearchQuery('')
    }
  })

  const handleToggleTag = (tag: string) => {
    setLocalSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleRemoveTag = (tag: string) => {
    setLocalSelectedTags((prev) => prev.filter((t) => t !== tag))
  }

  const handleClearAll = () => {
    setLocalSelectedTags([])
  }

  const handleApply = () => {
    onApply(localSelectedTags)
    onClose()
  }

  const handleCancel = () => {
    setLocalSelectedTags(initialSelectedTags)
    onClose()
  }

  const filteredTags = AVAILABLE_TAGS.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      size="2xl"
      placement="center"
      maxHeightClass="max-h-[85vh]"
      showCloseIcon
    >
      <Modal.Header>
        <Modal.Title>태그 필터 선택</Modal.Title>
      </Modal.Header>

      <div className="border-b border-gray-200" />

      <Modal.Body scroll padded>
        {/* 검색 입력 */}
        <div className="mb-6">
          <div className="relative">
            <svg
              className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="태그 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>
        </div>

        {/* 선택된 태그 표시 */}
        {localSelectedTags.length > 0 && (
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">
                선택된 태그 ({localSelectedTags.length})
              </span>
              <button
                onClick={handleClearAll}
                className="text-sm font-medium text-yellow-600 hover:text-yellow-700"
              >
                전체 해제
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {localSelectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="warning"
                  size="md"
                  className="cursor-pointer"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1.5 inline-flex items-center"
                    aria-label={`${tag} 제거`}
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 태그 그리드 */}
        <div className="grid grid-cols-3 gap-3">
          {filteredTags.map((tag) => {
            const isSelected = localSelectedTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => handleToggleTag(tag)}
                className={`relative rounded-lg border px-4 py-3 text-left text-base font-medium transition-all ${
                  isSelected
                    ? 'border-yellow-400 bg-yellow-50 text-yellow-900'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <span>{tag}</span>
                {isSelected && (
                  <svg
                    className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            )
          })}
        </div>

        {filteredTags.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            검색 결과가 없습니다.
          </div>
        )}
      </Modal.Body>

      <div className="border-t border-gray-200" />

      <Modal.Footer className="bg-gray-50">
        <div className="flex w-full justify-end gap-3">
          <Button
            btnStyle="secondary"
            btnText="취소"
            btnSize="medium"
            onClick={handleCancel}
          />
          <Button
            btnStyle="primary"
            btnText="적용하기"
            btnSize="medium"
            onClick={handleApply}
          />
        </div>
      </Modal.Footer>
    </Modal>
  )
}
