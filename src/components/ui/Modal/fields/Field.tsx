import { useId } from 'react'
import { Input } from '../../input/Input'

type FieldKind = 'text' | 'select'

export type SmartFieldProps = {
  /** 라벨 */
  label: string
  /** 값 */
  value?: string | null
  /** 모달 전체 편집 모드 on/off */
  editing: boolean
  /** 이 필드가 편집 가능 여부 */
  editable?: boolean
  /** 필드 타입 */
  kind?: FieldKind
  /** kind='select'일 때 옵션 */
  options?: string[]
  /** 변경 핸들러 */
  onChange: (val: string) => void
  /** 접근성/테스트용 id (없으면 자동 생성) */
  id?: string
  /** 스타일 확장 */
  className?: string
}

export default function Field({
  label,
  value,
  editing,
  editable = false,
  kind = 'text',
  options,
  onChange,
  id,
  className,
}: SmartFieldProps) {
  const autoId = useId()
  const fieldId =
    id ?? `field-${label.replace(/\s+/g, '-').toLowerCase()}-${autoId}`
  const canEdit = editing && editable
  const val = value ?? ''

  // 공통: 읽기 전용 렌더
  const renderReadonly = () => (
    <Input
      id={fieldId}
      label={label}
      value={val || '-'}
      onChange={() => {}}
      readOnly
      disabled
      className={className}
    />
  )

  // SELECT
  if (kind === 'select') {
    if (canEdit && options?.length) {
      const CONTROL_BASE =
        'w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base leading-6 text-gray-900 ' +
        'focus:outline-none focus:ring-2 focus:ring-primary-200 appearance-none pr-8'

      return (
        <div className={className}>
          <label htmlFor={fieldId} className="mb-1 block text-sm text-gray-600">
            {label}
          </label>
          <div className="relative">
            <select
              id={fieldId}
              className={CONTROL_BASE}
              value={val}
              onChange={(e) => onChange(e.target.value)}
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {/* 드롭다운 아이콘 */}
            <svg
              className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-500"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                d="M5.5 7.5l4.5 4.5 4.5-4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      )
    }

    // 편집 불가일 땐 Input으로
    return (
      <Input
        id={fieldId}
        label={label}
        value={val || '-'}
        onChange={() => {}}
        readOnly
        disabled
        className={className}
      />
    )
  }

  // TEXT
  if (canEdit) {
    return (
      <Input
        id={fieldId}
        label={label}
        value={val}
        onChange={(e) => onChange(e.target.value)}
        className={className}
      />
    )
  }

  return renderReadonly()
}
