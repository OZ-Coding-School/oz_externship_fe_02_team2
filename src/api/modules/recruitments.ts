import { api, shouldUseMock, withBypass } from '../http'
import type {
  ServerAdminRecruitment,
  AdminRecruitment,
  DjangoPageResponse,
  PageResponse,
  AdminRecruitmentsParams,
} from '@/types/AdminRecruitments.types'

// ────────────────────────────────────────────────────────────────────────────
// 매퍼 함수
// ────────────────────────────────────────────────────────────────────────────

function mapAdminRecruitment(r: ServerAdminRecruitment): AdminRecruitment {
  return {
    id: r.id,
    uuid: r.uuid,
    title: r.title,
    tags: r.tags,
    closeAt: r.close_at,
    status: r.status,
    viewsCount: r.views_count,
    bookmarkCount: r.bookmark_count,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
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

const BASE = '/api/v1/admin/recruitments'

/**
 * 관리자용 구인 공고 목록 조회
 * GET /api/v1/admin/recruitments/
 */
export async function getAdminRecruitments(
  params: AdminRecruitmentsParams = {},
  opts?: { mock?: boolean }
): Promise<PageResponse<AdminRecruitment>> {
  const useMock = shouldUseMock(opts?.mock)

  const queryParams: Record<string, number> = {}
  if (params.page) queryParams.page = params.page

  const res = await api.get<DjangoPageResponse<ServerAdminRecruitment>>(
    BASE,
    withBypass({ params: queryParams }, useMock)
  )

  // DRF는 기본적으로 page_size가 서버에서 설정됨
  // 응답에서 실제 pageSize 계산
  const page = params.page ?? 1
  const itemCount = res.data.results.length
  const pageSize = itemCount > 0 ? itemCount : 10 // 기본값 10

  return adaptDjangoPage(res.data, mapAdminRecruitment, page, pageSize)
}

/**
 * 관리자용 구인 공고 상세 조회
 * GET /api/v1/admin/recruitments/{recruitment_id}
 */
export async function getAdminRecruitmentDetail(
  recruitmentId: number,
  opts?: { mock?: boolean }
): Promise<void> {
  const useMock = shouldUseMock(opts?.mock)

  const res = await api.get(`${BASE}/${recruitmentId}`, withBypass({}, useMock))

  return res.data
}

/**
 * 관리자용 구인 공고 삭제
 * GET /api/v1/admin/recruitments/{recruitment_id}/delete
 *
 * Note: OpenAPI 스키마상 GET 메서드로 정의되어 있음
 */
export async function deleteAdminRecruitment(
  recruitmentId: number,
  opts?: { mock?: boolean }
): Promise<void> {
  const useMock = shouldUseMock(opts?.mock)

  await api.get(`${BASE}/${recruitmentId}/delete`, withBypass({}, useMock))
}
