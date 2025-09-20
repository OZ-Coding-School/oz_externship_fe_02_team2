import { useFormHandlers } from '@/hooks/useFormHandlers'
import type { UserDetail } from './User.types'
import { deleteUser, restoreUser, updateUser } from '@/api/modules/users'
import { useToast } from '@/hooks'

// UserDetail 전용 핸들러 팩토리
export function useUserFormHandlers(initialData: UserDetail) {
  const { triggerToast } = useToast()

  return useFormHandlers<UserDetail>(initialData, {
    onEdit: async (data) => {
      // 변경된 필드만 patch
      const patch = makePatch(initialData, data)
      await updateUser(data.id, patch, { mock: true }) // MSW ↔ 실서버 교체만 하면 됨
    },
    onEdited: () => {
      triggerToast('success', '성공', '수정 반영 완료')
    },
    onRestore: async (data) => {
      await restoreUser(data.id, { mock: true })
    },
    onRestored: () => {
      triggerToast('success', '성공', '복구 완료')
    },
    onDelete: async (data) => {
      await deleteUser(data.id, { mock: true })
    },
    onDeleted: () => {
      triggerToast('success', '삭제', '삭제 완료')
    },
  })
}

// 변경 필드만 추출
function makePatch<T extends Record<string, unknown>>(prev: T, next: T) {
  const patch: Partial<T> = {}

  for (const k of Object.keys(next) as Array<keyof T>) {
    if (next[k] !== prev[k]) patch[k] = next[k]
  }
  return patch
}
