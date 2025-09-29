import { useRef } from 'react'
import { useFormHandlers } from '@/hooks/useFormHandlers'
import type { UserDetail } from '@type/User.types'
import {
  deleteUser as deleteUserApi,
  getUserDetail,
  updateUser,
} from '@api/modules/users'
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

      // 클라이언트 필드 → 서버 필드 매핑
      const serverPatch: Record<string, unknown> = {}

      if ('name' in patch) serverPatch.name = patch.name
      if ('gender' in patch) serverPatch.gender = patch.gender
      if ('nickname' in patch) serverPatch.nickname = patch.nickname
      if ('phoneNumber' in patch) serverPatch.phone_number = patch.phoneNumber
      if ('profileImgUrl' in patch)
        serverPatch.profile_img_url = patch.profileImgUrl

      // status 매핑: ACTIVE/INACTIVE → active/inactive (소문자)
      if ('status' in patch) {
        const statusMap: Record<string, string> = {
          ACTIVE: 'active',
          INACTIVE: 'inactive',
        }
        serverPatch.status = statusMap[patch.status as string] ?? patch.status
      }

      await updateUser(draft.uuid, serverPatch, { mock: true })
    },

    /** 저장 완료 후: 최신 데이터로 동기화 + 부모 통지 + 토스트 */
    onEdited: async (draft) => {
      const latest = await getUserDetail(draft.uuid, { mock: true })
      initialRef.current = latest
      opts?.onServerUpdated?.(latest)
      triggerToast('success', '성공', '수정 반영 완료')
    },

    /** 삭제 */
    onDelete: async (data) => {
      await deleteUserApi(data.uuid, { mock: true })
    },

    onDeleted: () => {
      triggerToast('success', '삭제', '삭제 완료')
    },
  })
}
