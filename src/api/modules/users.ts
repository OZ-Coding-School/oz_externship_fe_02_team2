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
  status?: string | undefined
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

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20

// undefined/null 제거 + 기본값 채우기
function buildParams(p: UsersParams = {}): Record<string, string | number> {
  const params: Record<string, string | number | undefined> = {
    page: p.page ?? DEFAULT_PAGE,
    pageSize: p.pageSize ?? DEFAULT_PAGE_SIZE,
    sortBy: p.sortBy,
    sortOrder: p.sortOrder,
    q: p.q,
    role: p.role,
    status: p.status,
  }

  // 빈 값 제거
  const filteredParams: Record<string, string | number> = {}
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      filteredParams[key] = value
    }
  })

  return filteredParams
}

/* ------------------ 엔드포인트 ------------------ */
const BASE = '/v1/admin/users/'

// 목록 조회(듀얼 모드)
export async function getUsers(
  params: UsersParams = {},
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.get<PageResp<UserDetail>>(
    BASE,
    withBypass({ params: buildParams(params) }, bypass)
  )
  return res.data
}

// 상세 조회(듀얼 모드)
export async function getUserDetail(id: string, opts?: { mock?: boolean }) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.get<UserDetail>(
    `${BASE}/${id}`,
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
    `${BASE}/${id}`,
    patch,
    withBypass({}, bypass)
  )
  return res.data
}

// 복구(듀얼 모드)
export async function restoreUser(id: string, opts?: { mock?: boolean }) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.post<UserDetail>(
    `${BASE}/${id}/restore`,
    {},
    withBypass({}, bypass)
  )
  return res.data
}

// 삭제(듀얼 모드)
export async function deleteUser(id: string, opts?: { mock?: boolean }) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.delete<void>(`${BASE}/${id}`, withBypass({}, bypass))
  return res.data // axios는 void면 undefined 반환 → 호출부에선 await만 하면 됨
}
