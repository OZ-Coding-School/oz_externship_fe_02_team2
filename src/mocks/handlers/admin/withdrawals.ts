/* eslint-disable @typescript-eslint/no-explicit-any */
// ────────────────────────────────────────────────────────────────────────────
// MSW Withdrawals Handlers - 최신 API 스키마 반영
// OpenAPI Path: /api/v1/admin/withdrawals
// ────────────────────────────────────────────────────────────────────────────

/* eslint-disable no-console */
import { http, HttpResponse, delay, passthrough } from 'msw'
import { withdrawalsDb } from '@/mocks/seeds/withdrawals.seed'
import type {
  ServerWithdrawalListItem,
  ServerWithdrawalDetail,
  DjangoPageResponse,
  PermissionType,
} from '@/types/Withdrawal.types'

// ────────────────────────────────────────────────────────────────────────────
// 설정
// ────────────────────────────────────────────────────────────────────────────
const BASE_URL = '/api/v1/admin/withdrawals'

// ────────────────────────────────────────────────────────────────────────────
// 타입 정의
// ────────────────────────────────────────────────────────────────────────────
interface QueryParams {
  page?: number
  page_size?: number
  ordering?: string
  search?: string
  permission?: PermissionType
}

// ────────────────────────────────────────────────────────────────────────────
// 유틸리티 함수
// ────────────────────────────────────────────────────────────────────────────

/**
 * URL에서 쿼리 파라미터 추출
 */
function parseParams(url: URL): QueryParams {
  const page = parseInt(url.searchParams.get('page') || '1', 10)
  const page_size = parseInt(url.searchParams.get('page_size') || '20', 10)
  const ordering = url.searchParams.get('ordering') || undefined
  const search = url.searchParams.get('search') || undefined
  const permission = (url.searchParams.get('permission') || undefined) as
    | PermissionType
    | undefined

  return { page, page_size, ordering, search, permission }
}

/**
 * Detail → ListItem 변환
 */
function toListItem(detail: ServerWithdrawalDetail): ServerWithdrawalListItem {
  return {
    id: detail.id,
    email: detail.email,
    name: detail.name,
    permission: detail.permission,
    birthday: detail.birthday,
    reason: detail.reason,
    created_at: detail.created_at,
  }
}

/**
 * 검색 기능 (이름, 이메일, 닉네임 검색)
 */
function searchFilter(
  items: ServerWithdrawalDetail[],
  searchTerm?: string
): ServerWithdrawalDetail[] {
  if (!searchTerm) return items

  const term = searchTerm.toLowerCase()
  return items.filter((item) => {
    const searchableText =
      `${item.name} ${item.email} ${item.nickname} ${item.id}`.toLowerCase()
    return searchableText.includes(term)
  })
}

/**
 * 권한 필터링
 */
function permissionFilter(
  items: ServerWithdrawalDetail[],
  permission?: PermissionType
): ServerWithdrawalDetail[] {
  if (!permission) return items
  return items.filter((item) => item.permission === permission)
}

/**
 * 정렬 (ordering 파라미터 기준)
 * - 'created_at': 오래된순
 * - '-created_at': 최신순 (기본값)
 */
function sortItems(
  items: ServerWithdrawalDetail[],
  ordering?: string
): ServerWithdrawalDetail[] {
  if (!ordering) return items

  const isDescending = ordering.startsWith('-')
  const field = isDescending ? ordering.slice(1) : ordering

  return [...items].sort((a, b) => {
    let aVal: unknown = a[field as keyof ServerWithdrawalDetail]
    let bVal: unknown = b[field as keyof ServerWithdrawalDetail]

    // 날짜 필드 처리
    if (field === 'created_at' || field === 'user_joined_at') {
      aVal = new Date(aVal as string).getTime()
      bVal = new Date(bVal as string).getTime()
    }

    // 문자열 비교
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return isDescending ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
    }

    // 숫자 비교
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return isDescending ? bVal - aVal : aVal - bVal
    }

    return 0
  })
}

/**
 * DRF 스타일 페이지네이션
 */
function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
  baseUrl: string
): DjangoPageResponse<T> {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const results = items.slice(start, end)

  const hasNext = end < items.length
  const hasPrevious = page > 1

  return {
    count: items.length,
    next: hasNext ? `${baseUrl}?page=${page + 1}` : null,
    previous: hasPrevious ? `${baseUrl}?page=${page - 1}` : null,
    results,
  }
}

/**
 * 바이패스 체크
 */
function shouldBypass(request: Request): boolean {
  return request.headers.get('X-Mock-Bypass') === 'true'
}

// ────────────────────────────────────────────────────────────────────────────
// MSW 핸들러
// ────────────────────────────────────────────────────────────────────────────

// DB 초기화
withdrawalsDb.init()

export const withdrawalHandlers = [
  /**
   * GET /api/v1/admin/withdrawals/ - 탈퇴 요청 목록 조회
   */
  http.get(`${BASE_URL}/`, async ({ request }) => {
    if (shouldBypass(request)) return passthrough()
    await delay(150 + Math.random() * 100)

    const url = new URL(request.url)
    const params = parseParams(url)

    // ✅ reason 파라미터 여러 이름 모두 지원
    const reasonParam =
      url.searchParams.get('reason') ??
      url.searchParams.get('withdrawal_reason') ??
      url.searchParams.get('reasonCode') ??
      url.searchParams.get('withdrawalReason')

    // ✅ 코드/동의어 정규화
    const canonReason = (v?: string | null) => {
      if (!v) return ''
      const x = v.toUpperCase().replace(/\s+/g, '_')
      const alias: Record<string, string> = {
        NO_LONGER_NEEDED: 'LOW_USAGE',
        LACK_OF_INTEREST: 'LOW_USAGE',
        TOO_DIFFICULT: 'SERVICE_DISSATISFACTION',
        POOR_SERVICE_QUALITY: 'SERVICE_DISSATISFACTION',
        TECHNICAL_ISSUES: 'SERVICE_DISSATISFACTION',
        LACK_OF_CONTENT: 'SERVICE_DISSATISFACTION',
        FOUND_BETTER_SERVICE: 'COMPETITOR_SERVICE',
        // 한글 라벨 대비(옵션)
        서비스_불만족: 'SERVICE_DISSATISFACTION',
        개인정보_우려: 'PRIVACY_CONCERNS',
        사용_빈도_낮음: 'LOW_USAGE',
        경쟁_서비스_이용: 'COMPETITOR_SERVICE',
      }
      return alias[x] ?? x
    }

    console.log('📋 [MSW] GET /api/v1/admin/withdrawals/', {
      ...params,
      reasonParam,
    })

    // 검색/필터/정렬
    let items = withdrawalsDb.withdrawals
    items = searchFilter(items, params.search)
    items = permissionFilter(items, params.permission)

    // ✅ reason 필터 적용 (요청에 들어온 경우에만)
    if (reasonParam) {
      const want = canonReason(reasonParam)
      items = items.filter((it: any) => canonReason(it.reason) === want)
    }

    // 정렬 (기본값: -created_at)
    items = sortItems(items, params.ordering || '-created_at')

    // 목록 아이템 변환 + 페이지네이션
    const listItems = items.map(toListItem)
    const response = paginate(
      listItems,
      params.page || 1,
      params.page_size || 10,
      BASE_URL
    )

    console.log(
      `✅ [MSW] Withdrawals 목록: ${response.count}개 (페이지 ${params.page})`
    )
    return HttpResponse.json(response)
  }),

  /**
   * GET /api/v1/admin/withdrawals/{id}/ - 탈퇴 요청 상세 조회
   */
  http.get(`${BASE_URL}/:id/`, async ({ request, params }) => {
    if (shouldBypass(request)) return passthrough()

    await delay(80 + Math.random() * 40)

    const id = parseInt(params.id as string, 10)
    const item = withdrawalsDb.find(id)

    console.log(`🔍 [MSW] GET /api/v1/admin/withdrawals/${id}/`)

    if (!item) {
      console.log(`❌ [MSW] Withdrawal ${id} not found`)
      return HttpResponse.json(
        { detail: 'Withdrawal not found' },
        { status: 404 }
      )
    }

    console.log(`✅ [MSW] Withdrawal ${id} 상세:`, item.name)
    return HttpResponse.json(item)
  }),

  /**
   * POST /api/v1/admin/withdrawals/{id}/restore/ - 탈퇴 회원 복구
   */
  http.post(`${BASE_URL}/:id/restore/`, async ({ request, params }) => {
    if (shouldBypass(request)) return passthrough()

    await delay(150 + Math.random() * 50)

    const id = parseInt(params.id as string, 10)
    const item = withdrawalsDb.find(id)

    console.log(`🔄 [MSW] POST /api/v1/admin/withdrawals/${id}/restore/`)

    if (!item) {
      console.log(`❌ [MSW] Withdrawal ${id} not found`)
      return HttpResponse.json(
        { detail: 'Withdrawal not found' },
        { status: 404 }
      )
    }

    // 상태를 'ACTIVE'로 변경하고 탈퇴 요청 삭제 (실제로는 DB에서 제거)
    withdrawalsDb.remove(id)

    console.log(`✅ [MSW] Withdrawal ${id} 복구 완료:`, item.name)

    return HttpResponse.json({
      message: '유저 복구가 완료 되었습니다.',
    })
  }),

  /**
   * GET /api/v1/admin/withdrawals/stats/ - 통계 (선택적)
   */
  http.get(`${BASE_URL}/stats/`, async ({ request }) => {
    if (shouldBypass(request)) return passthrough()

    await delay(50)

    const stats = withdrawalsDb.status()

    console.log('📊 [MSW] GET /api/v1/admin/withdrawals/stats/', stats)

    return HttpResponse.json(stats)
  }),
]

export { withdrawalsDb }
