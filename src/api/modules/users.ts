import type { UserDetail } from '@/components/ui/Modal/feature/User/User.types'
import { http, withBypass } from '../http'
import { decideBypass } from '../toggles/mockToggle'

export type SortOrder = 'asc' | 'desc'

export type UsersParams = {
  page?: number // 1-based
  pageSize?: number
  sortBy?: string
  sortOrder?: SortOrder
  q?: string
  role?: string
  status?: '활성' | '비활성'
}

export type PageResp<T> = {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  sortBy?: string
  sortOrder?: SortOrder
}

// 목록 조회(듀얼 모드)
export async function getUsers(
  params: UsersParams = {},
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.get<PageResp<UserDetail>>(
    '/admin/users',
    withBypass({ params }, bypass)
  )
  return res.data
}

// 상세 조회(듀얼 모드)
export async function getUser(id: string, opts?: { mock?: boolean }) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.get<UserDetail>(
    `/admin/users/${id}`,
    withBypass({}, bypass)
  )
  return res.data
}

// 부분 수정(듀얼 모드)
export async function updateUser(
  id: string,
  patch: Partial<UserDetail>,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.patch<UserDetail>(
    `/admin/users/${id}`,
    patch,
    withBypass({}, bypass)
  )
  return res.data
}
