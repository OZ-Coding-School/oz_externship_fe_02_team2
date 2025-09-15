import { useCallback, useMemo, useRef, useState } from 'react'

type EditFn<T> = (data: T) => Promise<void> | void
type Options<T> = {
  /** 저장 실행 로직 (예: API 호출) */
  onEdit?: EditFn<T>
  /** 저장 성공 후 후처리 (예: 목록 리패치, 토스트) */
  onEdited?: (data: T) => void

  /** 복구 실행/후처리 */
  onRestore?: (data: T) => Promise<void> | void
  onRestored?: (data: T) => void

  /** 삭제 실행/후처리 */
  onDelete?: (data: T) => Promise<void> | void
  onDeleted?: () => void

  /** 공용 닫기 액션(모달 등) */
  onClose?: () => void
}

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
  const opts = useMemo<Options<T>>(() => {
    if (typeof second === 'function') return { onEdit: second }
    return second ?? {}
  }, [second])

  const initialRef = useRef<T>(initialData)

  const [form, setForm] = useState<T>(initialData)
  const [editing, setEditing] = useState(false)
  const [restoring, setRestoring] = useState(false)

  // 공용 요청 상태/에러 (저장/삭제 등 공통으로 사용)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetForm = useCallback((next: T) => {
    initialRef.current = next
    setForm(next)
  }, [])

  const handleChange = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  /** 저장 */
  const handleSave = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      await opts.onEdit?.(form)
      opts.onEdited?.(form)
      setEditing(false)
      opts.onClose?.()
    } catch (err) {
      setError(`${err}`)
    } finally {
      setLoading(false)
    }
  }, [form, opts])

  /** 취소 → 최초 기준으로 되돌림 */
  const handleCancel = useCallback(() => {
    setForm(initialRef.current)
    setEditing(false)
  }, [])

  /** 복구(회원 탈퇴 → 복구 등) */
  const handleRestore = useCallback(async () => {
    if (restoring) return
    setRestoring(true)
    try {
      await opts.onRestore?.(form)
      opts.onRestored?.(form)
    } finally {
      setRestoring(false)
    }
  }, [form, opts, restoring])

  /** 삭제 */
  const handleDelete = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      await opts.onDelete?.(form)
      opts.onDeleted?.()
      opts.onClose?.()
    } catch (err) {
      setError(`${err}, 삭제 중 오류 발생!! 잠시 후 다시 시도해주세요.`)
    } finally {
      setLoading(false)
    }
  }, [form, opts])

  return {
    form,
    setForm,
    editing,
    setEditing,
    restoring,
    setRestoring,
    loading,
    setLoading,
    error,
    setError,
    handleChange,
    handleSave,
    handleCancel,
    resetForm,
    handleRestore,
    handleDelete,
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
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  error: string | null
  setError: React.Dispatch<React.SetStateAction<string | null>>
  handleChange: <K extends keyof T>(field: K, value: T[K]) => void
  handleSave: () => Promise<void>
  handleCancel: () => void
  resetForm: (next: T) => void
  handleRestore: () => Promise<void>
  handleDelete: () => Promise<void>
}
