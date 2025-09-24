/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, withBypass } from '@/api/http'
import { decideBypass } from '@/api/toggles/mockToggle'

export type SortOrder = 'asc' | 'desc'

/** Admin 테이블에서 쓰는 정렬 키 → 백엔드 ordering 매핑용 */
export type SortKey =
  | 'created_desc'
  | 'created_asc'
  | 'views_desc'
  | 'bookmarks_desc'

/** 목록 항목 (Swagger: RecruitmentList) */
export type RecruitmentListItem = {
  id: number
  uuid: string
  title: string
  img: string
  expected_headcount: number
  lectures: { title: string; instructor: string }[]
  tags: string[]
  close_at: string
  views_count: number
  bookmarks_count: number
}

/** 상세 (Swagger: RecruitmentDetail) */
export type RecruitmentDetail = {
  id: number
  uuid: string
  author: { id: number; nickname: string }
  title: string
  content: string
  expected_headcount: number
  estimated_fee: number
  study_lectures: {
    title: string
    url_link: string
    instructor: string
    thumbnail_img_url?: string | null
  }[]
  tags: { id: number; name: string }[] // ← 배열로 유지
  attachments: { id: number; file_name: string; file_url: string }[]
  created_at: string
  updated_at: string | null
  close_at: string
  is_closed: boolean
  views_count: number
  bookmark_count: number
}

export type PageResp<T> = {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  /** users 모듈과 맞추기 위해 제공 (ordering 역매핑 결과) */
  sortBy?: string
  sortOrder?: SortOrder
}

export type RecruitmentsParams = {
  page?: number // 1-based (required in API, default 1)
  pageSize?: number // API 'size'
  search?: string // API 'search'
  tag?: string // API 'tag'
  sortKey?: SortKey // API 'ordering'로 변환
}

export type MyRecruitmentsParams = {
  page?: number
  pageSize?: number
  is_closed?: boolean
  ordering?: string // 필요 시 직접 지정 (예: "-created_at")
}

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10 // Swagger 기본이 10개

/** ─────────────────────────────────────────────────────────────
 *  v1 우선 호출 후 404/405면 레거시(/v1 없는) 경로로 재시도하는 안전망
 *  path 인자는 반드시 '/recruitments/...' 처럼 v1 없는 경로로 줄 것.
 *  ───────────────────────────────────────────────────────────── */
function withV1(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `/v1${p}`
}
function is404or405(e: any) {
  const s = e?.response?.status
  return s === 404 || s === 405
}
async function getV1OrLegacy<T>(pathNoV1: string, config?: any) {
  try {
    return await http.get<T>(withV1(pathNoV1), config)
  } catch (e: any) {
    if (is404or405(e)) {
      // 개발 편의 로그
      // eslint-disable-next-line no-console
      console.warn('[recruitments] v1 GET 404/405 → legacy 재시도:', pathNoV1)
      return await http.get<T>(pathNoV1, config)
    }
    throw e
  }
}
async function postV1OrLegacy<T>(pathNoV1: string, data?: any, config?: any) {
  try {
    return await http.post<T>(withV1(pathNoV1), data, config)
  } catch (e: any) {
    if (is404or405(e)) {
      console.warn('[recruitments] v1 POST 404/405 → legacy 재시도:', pathNoV1)
      return await http.post<T>(pathNoV1, data, config)
    }
    throw e
  }
}
async function patchV1OrLegacy<T>(pathNoV1: string, data?: any, config?: any) {
  try {
    return await http.patch<T>(withV1(pathNoV1), data, config)
  } catch (e: any) {
    if (is404or405(e)) {
      console.warn('[recruitments] v1 PATCH 404/405 → legacy 재시도:', pathNoV1)
      return await http.patch<T>(pathNoV1, data, config)
    }
    throw e
  }
}
async function deleteV1OrLegacy<T>(pathNoV1: string, config?: any) {
  try {
    return await http.delete<T>(withV1(pathNoV1), config)
  } catch (e: any) {
    if (is404or405(e)) {
      console.warn(
        '[recruitments] v1 DELETE 404/405 → legacy 재시도:',
        pathNoV1
      )
      return await http.delete<T>(pathNoV1, config)
    }
    throw e
  }
}

/** SortKey → ordering 매핑 */
function toOrdering(k?: SortKey): string | undefined {
  switch (k) {
    case 'created_asc':
      return 'created_at'
    case 'views_desc':
      return '-views_count'
    case 'bookmarks_desc':
      return '-bookmarks_count'
    case 'created_desc':
    default:
      return '-created_at'
  }
}

/** ordering → sortBy/sortOrder 역매핑 (PageResp 메타용) */
function fromOrdering(ordering?: string): {
  sortBy?: string
  sortOrder?: SortOrder
} {
  if (!ordering) return {}
  if (ordering.startsWith('-'))
    return { sortBy: ordering.slice(1), sortOrder: 'desc' }
  return { sortBy: ordering, sortOrder: 'asc' }
}

/** undefined/null/'' 제거 + 기본값 채우기 (목록 공용) */
function buildListParams(p: RecruitmentsParams = {}) {
  const params: Record<string, unknown> = {
    page: p.page ?? DEFAULT_PAGE,
    size: p.pageSize ?? DEFAULT_PAGE_SIZE,
    search: p.search,
    tag: p.tag,
    ordering: toOrdering(p.sortKey),
  }
  Object.keys(params).forEach((k) => {
    const v = (params as any)[k]
    if (v === undefined || v === null || v === '') delete (params as any)[k]
  })
  return params
}

/** API 페이징 응답 → PageResp 정규화 */
function normalizePage<T>(
  api: { count: number; results: T[] },
  page: number,
  size: number,
  ordering?: string
): PageResp<T> {
  const meta = fromOrdering(ordering)
  return {
    items: api.results ?? [],
    page,
    pageSize: size,
    total: api.count ?? 0,
    totalPages: Math.max(
      1,
      Math.ceil((api.count ?? 0) / (size || DEFAULT_PAGE_SIZE))
    ),
    ...meta,
  }
}

/** ─────────────────────────────────────────────────────────────
 *  구인 공고 목록 조회 (듀얼 모드) - GET /api(/v1)/recruitments
 *  ───────────────────────────────────────────────────────────── */
export async function getRecruitments(
  params: RecruitmentsParams = {},
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const built = buildListParams(params)
  const res = await getV1OrLegacy<{
    count: number
    next: string | null
    previous: string | null
    results: RecruitmentListItem[]
  }>('/recruitments', withBypass({ params: built }, bypass))
  const page = Number(built.page ?? DEFAULT_PAGE)
  const size = Number(built.size ?? DEFAULT_PAGE_SIZE)
  const ordering = (built.ordering as string | undefined) ?? undefined
  return normalizePage(res.data, page, size, ordering)
}

/** 구인 공고 상세 조회 - GET /api(/v1)/recruitments/{recruitment_uuid} */
export async function getRecruitmentDetail(
  recruitment_uuid: string,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await getV1OrLegacy<RecruitmentDetail>(
    `/recruitments/${recruitment_uuid}`,
    withBypass({}, bypass)
  )
  return res.data
}

/** 구인 공고 부분 수정 - PATCH /api(/v1)/recruitments/{recruitment_uuid} */
export async function updateRecruitment(
  recruitment_uuid: string,
  patch: Partial<RecruitmentDetail>,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await patchV1OrLegacy<RecruitmentDetail>(
    `/recruitments/${recruitment_uuid}`,
    patch,
    withBypass({}, bypass)
  )
  return res.data
}

/** 구인 공고 삭제 - DELETE /api(/v1)/recruitments/{recruitment_uuid} */
export async function deleteRecruitment(
  recruitment_uuid: string,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await deleteV1OrLegacy<void>(
    `/recruitments/${recruitment_uuid}`,
    withBypass({}, bypass)
  )
  return res.data
}

/** 내가 등록한 공고 목록 - GET /api(/v1)/recruitments/me */
export async function getMyRecruitments(
  params: MyRecruitmentsParams = {},
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const page = params.page ?? DEFAULT_PAGE
  const size = params.pageSize ?? DEFAULT_PAGE_SIZE
  const res = await getV1OrLegacy<{
    count: number
    next: string | null
    previous: string | null
    results: RecruitmentListItem[]
  }>(
    '/recruitments/me',
    withBypass(
      {
        params: {
          page,
          size,
          is_closed: params.is_closed,
          ordering: params.ordering, // 필요 시 '-created_at' 등 직접 지정
        },
      },
      bypass
    )
  )
  return normalizePage(res.data, page, size, params.ordering)
}

/** 태그 목록 - GET /api(/v1)/recruitments/tags */
export async function getRecruitmentTags(opts?: { mock?: boolean }) {
  const bypass = decideBypass(opts?.mock)
  const res = await getV1OrLegacy<{ id: number; name: string }[]>(
    '/recruitments/tags',
    withBypass({}, bypass)
  )
  return res.data
}

/** 태그 생성 - POST /api(/v1)/recruitments/tags */
export async function createRecruitmentTag(
  name: string,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await postV1OrLegacy<{ id: number; name: string }>(
    '/recruitments/tags',
    { name },
    withBypass({}, bypass)
  )
  return res.data
}

/** 첨부 업로드 - POST /api(/v1)/recruitments/attachments (multipart/form-data) */
export async function uploadRecruitmentAttachment(
  file: File,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const form = new FormData()
  form.append('file', file)
  const res = await postV1OrLegacy<{ file_url: string }>(
    '/recruitments/attachments',
    form,
    withBypass({ headers: { 'Content-Type': 'multipart/form-data' } }, bypass)
  )
  return res.data
}

/** 이미지 업로드 - POST /api(/v1)/recruitments/images (multipart/form-data) */
export async function uploadRecruitmentImage(
  file: File,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const form = new FormData()
  form.append('image', file)
  const res = await postV1OrLegacy<{ image_url: string }>(
    '/recruitments/images',
    form,
    withBypass({ headers: { 'Content-Type': 'multipart/form-data' } }, bypass)
  )
  return res.data
}

/** 지원자 목록 - GET /api(/v1)/recruitments/{recruitment_uuid}/applications */
export async function getRecruitmentApplications(
  recruitment_uuid: string,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  // 스펙은 200 with no schema라 any로 둠 (실제 백엔드 스키마 확정되면 타입 대체)
  const res = await getV1OrLegacy<any>(
    `/recruitments/${recruitment_uuid}/applications`,
    withBypass({}, bypass)
  )
  return res.data
}

/** 지원서 생성 - POST /api(/v1)/recruitments/{recruitment_uuid}/applications */
export async function createRecruitmentApplication(
  recruitment_uuid: string,
  payload: any,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await postV1OrLegacy<any>(
    `/recruitments/${recruitment_uuid}/applications`,
    payload,
    withBypass({}, bypass)
  )
  return res.data
}
