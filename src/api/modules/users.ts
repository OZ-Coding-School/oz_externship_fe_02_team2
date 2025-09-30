import { api, http, shouldUseMock, withBypass } from '../http'
import type {
  UserDetail,
  ServerUserList,
  ServerUserDetail,
  UsersParams,
  DjangoPageResponse,
  PageResponse,
  UserCreateRequest,
  UserUpdateRequest,
  UserPermissionUpdateRequest,
} from '@type/User.types'

const BASE = '/v1/admin/users'
const BASE1 = '/api/v1/admin/users/'
// ────────────────────────────────────────────────────────────────────────────
// 매퍼 함수
// ────────────────────────────────────────────────────────────────────────────

function mapUserList(u: ServerUserList): UserDetail {
  return {
    uuid: u.uuid,
    email: u.email,
    nickname: u.nickname,
    name: u.name,
    birthday: u.birthday,
    permission: u.permission,
    permissionDisplay: u.permission_display,
    status: u.status,
    createdAt: u.created_at,
    withdrawalsRequestDate: u.withdrawals_request_date,
  }
}

function mapUserDetail(u: ServerUserDetail): UserDetail {
  return {
    uuid: u.uuid,
    email: u.email,
    nickname: u.nickname,
    name: u.name,
    birthday: u.birthday,
    permission: u.permission,
    status: u.status,
    createdAt: u.created_at,
    gender: u.gender,
    phoneNumber: u.phone_number,
    profileImgUrl: u.profile_img_url,
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
 * 사용자 목록 조회
 */
export async function getUsers(
  params: UsersParams = {},
  opts?: { mock?: boolean }
): Promise<PageResponse<UserDetail>> {
  const useMock = shouldUseMock(opts?.mock)

  const queryParams: Record<string, string | number> = {}

  if (params.page) queryParams.page = params.page
  if (params.page_size) queryParams.page_size = params.page_size
  if (params.ordering) queryParams.ordering = params.ordering
  if (params.search) queryParams.search = params.search
  if (params.permission) queryParams.permission = params.permission
  if (params.status) queryParams.status = params.status

  const res = await api.get<DjangoPageResponse<ServerUserList>>(
    BASE1,
    withBypass({ params: queryParams }, useMock)
  )

  const page = params.page ?? 1
  const pageSize = params.page_size ?? 20

  console.log(res.data)
  return adaptDjangoPage(res.data, mapUserList, page, pageSize)
}

/**
 * 사용자 상세 조회
 */
export async function getUserDetail(
  uuid: string,
  opts?: { mock?: boolean }
): Promise<UserDetail> {
  const useMock = shouldUseMock(opts?.mock)

  const res = await api.get<ServerUserDetail>(
    `${BASE1}${uuid}/`,
    withBypass({}, useMock)
  )
  console.log(res.data)
  return mapUserDetail(res.data)
}

/**
 * 사용자 생성
 */
export async function createUser(
  data: UserCreateRequest,
  opts?: { mock?: boolean }
): Promise<UserDetail> {
  const useMock = shouldUseMock(opts?.mock)

  const res = await http.post<ServerUserList>(
    `${BASE}`,
    data,
    withBypass({}, useMock)
  )

  return mapUserList(res.data)
}

/**
 * 사용자 수정 (PATCH)
 */
export async function updateUser(
  uuid: string,
  data: UserUpdateRequest,
  opts?: { mock?: boolean }
): Promise<UserDetail> {
  const useMock = shouldUseMock(opts?.mock)

  const res = await api.patch<ServerUserDetail>(
    `${BASE1}${uuid}/`,
    data,
    withBypass({}, useMock)
  )

  return mapUserDetail(res.data)
}

/**
 * 사용자 전체 수정 (PUT)
 */
export async function replaceUser(
  uuid: string,
  data: UserUpdateRequest,
  opts?: { mock?: boolean }
): Promise<UserDetail> {
  const useMock = shouldUseMock(opts?.mock)

  const res = await api.put<ServerUserDetail>(
    `${BASE1}${uuid}/`,
    data,
    withBypass({}, useMock)
  )

  return mapUserDetail(res.data)
}

/**
 * 사용자 삭제
 */
export async function deleteUser(
  uuid: string,
  opts?: { mock?: boolean }
): Promise<void> {
  const useMock = shouldUseMock(opts?.mock)

  await api.delete(`${BASE1}${uuid}/`, withBypass({}, useMock))
}

/**
 * 사용자 권한 수정
 */
export async function updateUserPermission(
  uuid: string,
  data: UserPermissionUpdateRequest,
  opts?: { mock?: boolean }
): Promise<UserDetail> {
  const useMock = shouldUseMock(opts?.mock)

  const res = await api.patch<ServerUserDetail>(
    `${BASE1}${uuid}/permission/`,
    data,
    withBypass({}, useMock)
  )

  return mapUserDetail(res.data)
}
