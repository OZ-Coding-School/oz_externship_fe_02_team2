import { useRef } from 'react'
import { useFormHandlers } from '@/hooks/useFormHandlers'
import type { UserDetail } from './User.types'
import {
  deleteUser as deleteUserApi,
  getUserDetail,
  restoreUser,
  updateUser,
} from '@/api/modules/users'
import { useToast } from '@/hooks'

// 변경 필드만 추출 (any 금지)
export function makePatch<T extends Record<string, unknown>>(prev: T, next: T) {
  const patch: Partial<T> = {}
  for (const k of Object.keys(next) as Array<keyof T>) {
    if (next[k] !== prev[k]) patch[k] = next[k]
  }
  return patch
}

/** 저장/복구 후 최신 객체를 부모로 넘겨 테이블을 갱신하고 싶을 때 사용 */
export type AfterServerUpdated = (updated: UserDetail) => void

export function useUserFormHandlers(
  initialData: UserDetail,
  opts?: { onServerUpdated?: AfterServerUpdated }
) {
  const { triggerToast } = useToast()
  // 다음 diff 기준이 되도록 최신 스냅샷 유지
  const initialRef = useRef<UserDetail>(initialData)

  return useFormHandlers<UserDetail>(initialData, {
    /** 저장: 서버 반영만 (void 반환!) */
    onEdit: async (draft) => {
      const patch = makePatch<UserDetail>(initialRef.current, draft)
      if (Object.keys(patch).length === 0) return
      await updateUser(draft.id, patch, { mock: true })
    },
    /** 저장 완료 후: 최신 데이터로 동기화 + 부모 통지 + 토스트 */
    onEdited: async (draft) => {
      const latest = await getUserDetail(draft.id, { mock: true })
      initialRef.current = latest
      opts?.onServerUpdated?.(latest)
      triggerToast('success', '성공', '수정 반영 완료')
    },

    /** 복구 */
    onRestore: async (data) => {
      await restoreUser(data.id, { mock: true })
    },
    onRestored: async (data) => {
      const latest = await getUserDetail(data.id, { mock: true })
      initialRef.current = latest
      opts?.onServerUpdated?.(latest)
      triggerToast('success', '성공', '복구 완료')
    },

    /** 삭제 */
    onDelete: async (data) => {
      await deleteUserApi(data.id, { mock: true })
    },
    onDeleted: () => {
      triggerToast('success', '삭제', '삭제 완료')
    },
  })
}
