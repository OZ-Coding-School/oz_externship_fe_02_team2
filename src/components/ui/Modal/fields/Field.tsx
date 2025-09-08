import { useId } from 'react'
import { Input } from '../../input/Input'
import { formatPhoneKR, validatePhoneKR } from '@/lib/phone'

type FieldKind = 'text' | 'select' | 'phone'

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
      defaultValue={val || '-'}
      onChange={() => {}}
      readOnly
      disabled
      className={className}
    />
  )

  // SELECT
  if (kind === 'select') {
    if (canEdit && options?.length) {
      return (
        <div className={className}>
          <label htmlFor={fieldId} className="mb-1 block text-sm text-gray-600">
            {label}
          </label>
          <select
            id={fieldId}
            className="ring-primary-200 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:outline-none"
            value={val}
            onChange={(e) => onChange(e.target.value)}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )
    }
    return renderReadonly()
  }

  // PHONE
  if (kind === 'phone') {
    if (canEdit) {
      const error = val
        ? validatePhoneKR(val)
          ? ''
          : '올바른 전화번호 형식이 아닙니다'
        : ''
      return (
        <Input
          id={fieldId}
          label={label}
          value={val}
          onChange={(e) => onChange(formatPhoneKR(e.target.value))}
          type="tel"
          inputMode="numeric"
          pattern="[0-9\\-]*"
          maxLength={13} // 010-1234-5678
          error={error}
          className={className}
        />
      )
    }
    return renderReadonly()
  }

  // TEXT (기본)
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
