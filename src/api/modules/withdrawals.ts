import type { Maybe } from '@/types'
import { http, withBypass } from '../http'
import { decideBypass } from '../toggles/mockToggle'

export type SortOrder = 'asc' | 'desc'

/** FE 공통 파라미터(Users와 동일 포맷) */
export type WithdrawalsParams = {
  page?: number // 1-based
  pageSize?: number
  sortBy?: string // e.g. 'created_at'
  sortOrder?: SortOrder // 'asc' | 'desc'
  q?: string // 검색어
  permission?: Maybe<string>
  reason?: Maybe<string>
}

/** 공통 페이지 응답(Users와 동일 포맷) */
export type PageResp<T> = {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  sortBy?: string
  sortOrder?: SortOrder
}

/** 리스트 아이템 */
export type WithdrawalListItem = {
  id: number
  name: string
  email: string
  permission: Maybe<string>
  birthday?: string
  reason: string
  created_at: string // ISO
  profileImgUrl?: string | null
}

/** 상세 */
export type WithdrawalDetail = {
  id: number
  name: string
  gender: string
  nickname: string
  email: string
  permission: string
  birthday?: string
  status: string
  user_joined_at: string
  profile_img_url: string | null
  created_at: string
  reason: string
  reason_detail: string | null
  due_date: string // YYYY-MM-DD
}

/* ------------------ 내부 유틸 ------------------ */

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20

/** FE → FE (빈 값 제거) */
function buildParams(
  p: WithdrawalsParams = {}
): Record<string, string | number> {
  const params: Record<string, string | number | undefined> = {
    page: p.page ?? DEFAULT_PAGE,
    pageSize: p.pageSize ?? DEFAULT_PAGE_SIZE,
    sortBy: p.sortBy,
    sortOrder: p.sortOrder,
    q: p.q,
    permission: p.permission,
    reason: p.reason,
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

/** FE → 서버(DRF) 파라미터 변환 */
function buildServerParams(
  p: WithdrawalsParams = {}
): Record<string, string | number> {
  const page = p.page ?? DEFAULT_PAGE
  const page_size = p.pageSize ?? DEFAULT_PAGE_SIZE
  const ordering = p.sortBy
    ? p.sortOrder === 'desc'
      ? `-${p.sortBy}`
      : p.sortBy
    : undefined

  const params: Record<string, string | number | undefined> = {
    page,
    page_size,
    ordering,
    search: p.q,
    permission: p.permission,
    reason: p.reason,
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
/** 프로젝트 내 URL 컨벤션 유지(Users와 맞춤) */
const BASE = '/v1/admin/withdrawals/'

/** 목록(듀얼 모드) */
export async function getWithdrawals(
  params: WithdrawalsParams = {},
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  // MSW일 때는 FE 포맷 유지, 서버일 때는 DRF 포맷으로 변환
  const reqParams = bypass ? buildParams(params) : buildServerParams(params)

  const res = await http.get<PageResp<WithdrawalListItem>>(
    BASE,
    withBypass({ params: reqParams }, bypass)
  )
  return res.data
}

/** 상세(듀얼 모드) */
export async function getWithdrawalDetail(
  id: number | string,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.get<WithdrawalDetail>(
    `${BASE}/${id}`,
    withBypass({}, bypass)
  )
  return res.data
}

/** (승인/거절/삭제 같은 액션이 생기면 동일 패턴으로 아래 확장)
export async function approveWithdrawal(id: number | string, opts?: { mock?: boolean }) { ... }
export async function rejectWithdrawal(id: number | string, reason: string, opts?: { mock?: boolean }) { ... }
export async function deleteWithdrawal(id: number | string, opts?: { mock?: boolean }) { ... }
*/
