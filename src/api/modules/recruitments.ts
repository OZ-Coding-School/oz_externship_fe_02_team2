/* eslint-disable @typescript-eslint/no-explicit-any */
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
    tags: r.tags || [], // 태그가 없을 경우 빈 배열
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

// 서버 응답 그대로
interface ServerRecruitmentDetail {
  id: number
  uuid: string
  title: string
  content: string
  close_at: string | null
  status: string
  views_count: number
  bookmark_count: number
  estimated_fee: number | null
  created_at: string
  updated_at: string | null
  tags: { id: number; name: string }[]
  attachments: { id: number; file_name: string; file_url: string }[]
  lectures: any[]
  applications: any[]
}

// UI 타입
interface RecruitmentDetailData {
  id: number
  uuid: string
  title: string
  content: string
  closeAt: string | null
  status: 'OPEN' | 'CLOSED' | 'UNKNOWN'
  viewsCount: number
  bookmarkCount: number
  estimatedFee: number | null
  createdAt: string
  updatedAt: string | null
  tags: { id: number; name: string }[]
  attachments: { id: number; fileName: string; fileUrl: string }[]
  lectures: any[]
  applications: any[]
}

// 상태 매핑 유틸
function toUiStatus(raw: string): RecruitmentDetailData['status'] {
  if (!raw) return 'UNKNOWN'
  const v = raw.toLowerCase()
  if (v === 'recruiting' || v === 'open') return 'OPEN'
  if (v === 'closed') return 'CLOSED'
  return 'UNKNOWN'
}

// 매핑 함수
function adaptRecruitmentDetail(
  dto: ServerRecruitmentDetail
): RecruitmentDetailData {
  return {
    id: dto.id,
    uuid: dto.uuid,
    title: dto.title,
    content: dto.content,
    closeAt: dto.close_at,
    status: toUiStatus(dto.status),
    viewsCount: dto.views_count,
    bookmarkCount: dto.bookmark_count,
    estimatedFee: dto.estimated_fee,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    tags: dto.tags,
    attachments: dto.attachments.map((a) => ({
      id: a.id,
      fileName: a.file_name,
      fileUrl: a.file_url,
    })),
    lectures: dto.lectures,
    applications: dto.applications.map((app) => ({
      applicantNickname: app.applicant_nickname,
      applicantEmail: app.applicant_email,
      appliedAt: app.applied_at,
      status: app.status,
    })),
  }
}

/**
 * 관리자용 구인 공고 상세 조회
 * GET /api/v1/admin/recruitments/{recruitment_id}
 */
export async function getAdminRecruitmentDetail(
  recruitmentId: number,
  opts?: { mock?: boolean }
): Promise<RecruitmentDetailData> {
  const useMock = shouldUseMock(opts?.mock)

  const res = await api.get<ServerRecruitmentDetail>(
    `${BASE}/${recruitmentId}`,
    withBypass({}, useMock)
  )

  // applications 변환 포함
  return adaptRecruitmentDetail(res.data)
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
