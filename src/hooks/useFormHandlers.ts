import { useCallback, useMemo, useRef, useState } from 'react'

type EditFn<T> = (data: T) => void
type Options<T> = { onEdit?: EditFn<T>; onRestore?: EditFn<T> }

// ── Overloads ────────────────────────────────────────────────────────────────
export function useFormHandlers<T>(initialData: T, onEdit: EditFn<T>): Return<T>
export function useFormHandlers<T>(
  initialData: T,
  options?: Options<T>
): Return<T>

// ── Impl ────────────────────────────────────────────────────────────────────
export function useFormHandlers<T>(
  initialData: T,
  second?: EditFn<T> | Options<T>
): Return<T> {
  // 옵션 정규화 (함수/객체 모두 허용)
  const opts = useMemo<Options<T>>(() => {
    if (typeof second === 'function') return { onEdit: second }
    return second ?? {}
  }, [second])

  // 최초 props를 보관 (취소 시 되돌릴 기준)
  const initialRef = useRef<T>(initialData)

  const [form, setForm] = useState<T>(initialData)
  const [editing, setEditing] = useState(false)
  const [restoring, setRestoring] = useState(false)

  /** 외부로부터 초기값이 바뀐 경우, 기준값 갱신 + 폼 리셋 */
  const resetForm = useCallback((next: T) => {
    initialRef.current = next
    setForm(next)
  }, [])

  /** 필드 변경 (타입 안전) */
  const handleChange = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  /** 저장 */
  const handleSave = useCallback(() => {
    opts.onEdit?.(form)
    setEditing(false)
  }, [form, opts])

  /** 취소 → 최초 기준으로 되돌림 */
  const handleCancel = useCallback(() => {
    setForm(initialRef.current)
    setEditing(false)
  }, [])

  /** 복구(회원 탈퇴 → 복구 등) */
  const handleRestore = useCallback(() => {
    if (restoring) return
    setRestoring(true)
    try {
      opts.onRestore?.(form)
    } finally {
      setRestoring(false)
    }
  }, [form, opts, restoring])

  return {
    form,
    setForm,
    editing,
    setEditing,
    restoring,
    setRestoring,
    handleChange,
    handleSave,
    handleCancel,
    resetForm,
    handleRestore,
  }
}

// 반환 타입 유틸 (추론 편의)
type Return<T> = {
  form: T
  setForm: React.Dispatch<React.SetStateAction<T>>
  editing: boolean
  setEditing: React.Dispatch<React.SetStateAction<boolean>>
  restoring: boolean
  setRestoring: React.Dispatch<React.SetStateAction<boolean>>
  handleChange: <K extends keyof T>(field: K, value: T[K]) => void
  handleSave: () => void
  handleCancel: () => void
  resetForm: (next: T) => void
  handleRestore: () => void
}
