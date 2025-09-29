import { useRef } from 'react'
import { useFormHandlers } from '@/hooks/useFormHandlers'
import type { UserDetail } from '@type/User.types'
import {
  deleteUser as deleteUserApi,
  getUserDetail,
  updateUser,
} from '@api/modules/users'
import { useToast } from '@/hooks'

// 변경 필드만 추출
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

      // 수정 불가능한 필드는 제외
      const readOnlyFields = [
        'uuid',
        'email',
        'birthday',
        'phoneNumber',
        'createdAt',
        'permission',
        'permissionDisplay',
        'withdrawalsRequestDate',
      ]

      // 클라이언트 필드 → 서버 필드 매핑 (수정 가능한 필드만)
      const serverPatch: Record<string, unknown> = {}

      if ('name' in patch && !readOnlyFields.includes('name')) {
        serverPatch.name = patch.name
      }

      // gender 매핑: '남성'/'여성' → 'male'/'female'
      if ('gender' in patch && !readOnlyFields.includes('gender')) {
        const genderMap: Record<string, string> = {
          남성: 'male',
          여성: 'female',
          male: 'male',
          female: 'female',
        }
        serverPatch.gender = genderMap[patch.gender as string] ?? patch.gender
      }

      if ('nickname' in patch && !readOnlyFields.includes('nickname')) {
        serverPatch.nickname = patch.nickname
      }

      if (
        'profileImgUrl' in patch &&
        !readOnlyFields.includes('profileImgUrl')
      ) {
        serverPatch.profile_img_url = patch.profileImgUrl
      }

      // status 매핑: 한글 그대로 서버로 전송 (서버가 '활성화' 형식으로 받음)
      if ('status' in patch && !readOnlyFields.includes('status')) {
        serverPatch.status = patch.status
      }

      console.log('📤 서버로 전송할 데이터:', serverPatch)
      console.log('📝 변경된 필드:', Object.keys(patch))

      if (Object.keys(serverPatch).length === 0) {
        console.log('⚠️ 전송할 수정 가능한 필드가 없습니다')
        return
      }

      await updateUser(draft.uuid, serverPatch, { mock: false })
    },

    /** 저장 완료 후: 최신 데이터로 동기화 + 부모 통지 + 토스트 */
    onEdited: async (draft) => {
      const latest = await getUserDetail(draft.uuid, { mock: false })
      initialRef.current = latest
      opts?.onServerUpdated?.(latest)
      triggerToast('success', '성공', '수정 반영 완료')
    },

    /** 삭제 */
    onDelete: async (data) => {
      await deleteUserApi(data.uuid, { mock: false })
    },

    onDeleted: () => {
      triggerToast('success', '삭제', '삭제 완료')
    },
  })
}
