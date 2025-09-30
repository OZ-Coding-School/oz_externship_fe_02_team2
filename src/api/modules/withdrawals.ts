/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, shouldUseMock, withBypass } from '../http'
import type {
  ServerWithdrawalListItem,
  ServerWithdrawalDetail,
  WithdrawalListItem,
  WithdrawalDetail,
  WithdrawalsQueryParams,
  DjangoPageResponse,
  PageResponse,
  RestoreWithdrawalResponse,
} from '@/types/Withdrawal.types'

const BASE = '/v1/admin/withdrawals/'

// ────────────────────────────────────────────────────────────────────────────
// 매퍼 함수
// ────────────────────────────────────────────────────────────────────────────

function mapWithdrawalList(item: ServerWithdrawalListItem): WithdrawalListItem {
  return {
    id: item.id,
    email: item.email,
    name: item.name,
    permission: item.permission,
    birthday: item.birthday,
    reason: item.reason,
    createdAt: item.created_at,
  }
}

function mapWithdrawalDetail(detail: ServerWithdrawalDetail): WithdrawalDetail {
  return {
    id: detail.id,
    name: detail.name,
    gender: detail.gender,
    nickname: detail.nickname,
    email: detail.email,
    permission: detail.permission,
    birthday: detail.birthday,
    status: detail.status,
    userJoinedAt: detail.user_joined_at,
    profileImgUrl: detail.profile_img_url,
    createdAt: detail.created_at,
    reason: detail.reason,
    reasonDetail: detail.reason_detail,
    dueDate: detail.due_date,
  }
}

// DRF 페이지 → 클라이언트 페이지 변환
function adaptDjangoPage<TServer, TClient>(
  response: DjangoPageResponse<TServer>,
  mapper: (item: TServer) => TClient,
  page: number,
  pageSize: number
): PageResponse<TClient> {
  const total = response.count
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return {
    items: response.results.map(mapper),
    page,
    pageSize,
    total,
    totalPages,
  }
}

// ────────────────────────────────────────────────────────────────────────────
// API 함수들
// ────────────────────────────────────────────────────────────────────────────

/**
 * 탈퇴 요청 목록 조회
 */
export async function getWithdrawals(
  params: WithdrawalsQueryParams = {},
  opts?: { mock?: boolean }
): Promise<PageResponse<WithdrawalListItem>> {
  const useMock = shouldUseMock(opts?.mock)

  const queryParams: Record<string, string | number> = {}

  // page
  if (params.page) queryParams.page = params.page

  // page_size ← pageSize도 지원
  const finalPageSize = (params.page_size ?? params.pageSize) as
    | number
    | undefined
  if (finalPageSize) queryParams.page_size = finalPageSize

  // ordering ← sortBy/sortOrder도 지원
  if (params.ordering) {
    queryParams.ordering = params.ordering
  } else if (params.sortBy) {
    const field = params.sortBy
    const ord = params.sortOrder === 'asc' ? field : `-${field}`
    queryParams.ordering = ord
  }

  // search ← q도 지원
  const search = params.search ?? params.q
  if (search) queryParams.search = search

  // permission
  if (params.permission) queryParams.permission = params.permission

  // reason (호환 키 동시 전송)
  if (params.reason) {
    queryParams.reason = params.reason
    ;(queryParams as any).withdrawal_reason = params.reason
    ;(queryParams as any).reasonCode = params.reason
  }

  const res = await http.get<DjangoPageResponse<ServerWithdrawalListItem>>(
    `${BASE}`,
    withBypass({ params: queryParams }, useMock)
  )

  const page = params.page ?? 1
  const pageSize = finalPageSize ?? 20

  return adaptDjangoPage(res.data, mapWithdrawalList, page, pageSize)
}

/**
 * 탈퇴 요청 상세 조회
 */
export async function getWithdrawalDetail(
  id: number | string,
  opts?: { mock?: boolean }
): Promise<WithdrawalDetail> {
  const useMock = shouldUseMock(opts?.mock)

  const res = await http.get<ServerWithdrawalDetail>(
    `${BASE}${id}/`,
    withBypass({}, useMock)
  )

  return mapWithdrawalDetail(res.data)
}

/**
 * 탈퇴 회원 복구
 */
export async function restoreWithdrawal(
  id: number | string,
  opts?: { mock?: boolean }
): Promise<RestoreWithdrawalResponse> {
  const useMock = shouldUseMock(opts?.mock)

  const res = await http.post<RestoreWithdrawalResponse>(
    `${BASE}${id}/restore/`,
    {},
    withBypass({}, useMock)
  )

  return res.data
}
