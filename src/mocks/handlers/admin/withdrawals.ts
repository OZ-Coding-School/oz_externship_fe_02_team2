/* eslint-disable no-console */
import { http as mswHttp, HttpResponse, delay, passthrough } from 'msw'
import { ADMIN, like, paginate, sortByKey, toInt } from '../../utils'
import { withdrawalsDb } from '@/mocks/seeds/withdrawals.seed'

import type {
  WithdrawalListItem,
  WithdrawalDetail,
  WithdrawalsParams,
} from '@/api/modules/withdrawals'

interface RejectRequestBody {
  reason?: string
}

// DB 초기화
withdrawalsDb.init()

// DRF 스타일 파라미터를 FE 스타일로 변환
function parseParams(url: URL): WithdrawalsParams {
  // FE 스타일 파라미터 우선, DRF 스타일을 fallback으로 사용
  const page = toInt(url.searchParams.get('page'), 1)
  const pageSize = toInt(
    url.searchParams.get('pageSize') || url.searchParams.get('page_size'),
    20
  )
  const sortBy =
    url.searchParams.get('sortBy') ||
    parseOrderingField(url.searchParams.get('ordering'))
  const sortOrder = (url.searchParams.get('sortOrder') ||
    parseOrderingDirection(url.searchParams.get('ordering'))) as
    | 'asc'
    | 'desc'
    | undefined
  const q =
    url.searchParams.get('q') || url.searchParams.get('search') || undefined
  const permission = url.searchParams.get('permission') as string | undefined

  // 탈퇴사유 파라미터 추가
  const reason = url.searchParams.get('reason') as string | undefined

  return { page, pageSize, sortBy, sortOrder, q, permission, reason }
}

// DRF ordering 파라미터 파싱
function parseOrderingField(ordering: string | null): string | undefined {
  if (!ordering) return undefined
  return ordering.startsWith('-') ? ordering.slice(1) : ordering
}

function parseOrderingDirection(
  ordering: string | null
): 'asc' | 'desc' | undefined {
  if (!ordering) return undefined
  return ordering.startsWith('-') ? 'desc' : 'asc'
}

// WithdrawalDetail을 WithdrawalListItem으로 변환
function toListItem(detail: WithdrawalDetail): WithdrawalListItem {
  return {
    id: detail.id,
    name: detail.name,
    email: detail.email,
    permission: detail.permission,
    birthday: detail.birthday,
    reason: detail.reason,
    created_at: detail.created_at,
  }
}

// 검색 및 필터링 함수
function searchAndFilter(
  withdrawals: WithdrawalDetail[],
  params: WithdrawalsParams
): WithdrawalDetail[] {
  let results = [...withdrawals]

  // 검색어 필터
  if (params.q) {
    results = results.filter((w) =>
      like(`${w.name} ${w.email} ${w.nickname} ${w.id}`, params.q!)
    )
  }

  // 권한 필터
  if (params.permission) {
    results = results.filter((w) => w.permission === params.permission)
  }

  // 탈퇴사유 필터링 로직 추가
  if (params.reason) {
    results = results.filter((w) => {
      // 대소문자 구분 없이 비교
      const reason = w.reason?.toLowerCase()
      const filterReason = params.reason?.toLowerCase()
      return reason === filterReason
    })
  }

  return results
}

export const withdrawalHandlers = [
  // GET /api/admin/withdrawals - 목록 조회
  mswHttp.get(`${ADMIN}/withdrawals`, async ({ request }) => {
    // 바이패스 헤더가 있으면 실서버로 통과
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(150 + Math.random() * 100)

    const url = new URL(request.url)
    const params = parseParams(url)

    console.log('🔍 [MSW] Withdrawals 요청 파라미터:', params)

    // 검색 및 필터링
    let results = searchAndFilter(withdrawalsDb.withdrawals, params)

    // 정렬
    if (params.sortBy) {
      results = sortByKey(
        results as unknown as Record<string, unknown>[],
        params.sortBy,
        params.sortOrder || 'desc'
      ) as unknown as WithdrawalDetail[]
    }

    // 페이지네이션
    const pageData = paginate(
      results.map(toListItem),
      params.page || 1,
      params.pageSize || 20
    )

    console.log(
      `[MSW] Withdrawals 목록 조회: ${results.length}개 결과, 페이지 ${pageData.page}/${pageData.totalPages}`
    )

    return HttpResponse.json({
      ...pageData,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    })
  }),

  // GET /api/admin/withdrawals/:id - 상세 조회
  mswHttp.get(`${ADMIN}/withdrawals/:id`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(80 + Math.random() * 40)

    const id = parseInt(params.id as string)
    const found = withdrawalsDb.find(id)

    if (!found) {
      console.log(`[MSW] Withdrawal ${id} not found`)
      return HttpResponse.json(
        { message: 'Withdrawal not found' },
        { status: 404 }
      )
    }

    console.log(`[MSW] Withdrawal ${id} 상세 조회:`, found.name)
    return HttpResponse.json(found)
  }),

  // PATCH /api/admin/withdrawals/:id - 상태 변경 등
  mswHttp.patch(`${ADMIN}/withdrawals/:id`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(120 + Math.random() * 60)

    try {
      const body = (await request.json()) as Partial<WithdrawalDetail>
      const id = parseInt(params.id as string)

      const updated = withdrawalsDb.patch(id, body)

      if (!updated) {
        console.log(`[MSW] Withdrawal ${id} not found for update`)
        return HttpResponse.json(
          { message: 'Withdrawal not found' },
          { status: 404 }
        )
      }

      console.log(`[MSW] Withdrawal ${id} 수정 완료:`, {
        name: updated.name,
        changes: Object.keys(body).join(', '),
      })

      return HttpResponse.json(updated)
    } catch (error) {
      console.error('[MSW] Withdrawal update error:', error)
      return HttpResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      )
    }
  }),

  // DELETE /api/admin/withdrawals/:id - 탈퇴 요청 취소/삭제
  mswHttp.delete(`${ADMIN}/withdrawals/:id`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(100 + Math.random() * 50)

    const id = parseInt(params.id as string)
    const found = withdrawalsDb.find(id)

    if (!found) {
      console.log(`[MSW] Withdrawal ${id} not found for deletion`)
      return HttpResponse.json(
        { message: 'Withdrawal not found' },
        { status: 404 }
      )
    }

    // 실제 삭제 대신 상태를 CANCELLED로 변경
    withdrawalsDb.patch(id, { status: 'CANCELLED' })

    console.log(`[MSW] Withdrawal ${id} 취소/삭제:`, found.name)

    return new HttpResponse(null, { status: 204 })
  }),

  // POST /api/admin/withdrawals/:id/approve - 탈퇴 승인
  mswHttp.post(
    `${ADMIN}/withdrawals/:id/approve`,
    async ({ request, params }) => {
      if (request.headers.get('x-bypass-mock')) return passthrough()

      await delay(150)

      const id = parseInt(params.id as string)
      const approved = withdrawalsDb.patch(id, { status: 'APPROVED' })

      if (!approved) {
        console.log(`[MSW] Withdrawal ${id} not found for approval`)
        return HttpResponse.json(
          { message: 'Withdrawal not found' },
          { status: 404 }
        )
      }

      console.log(`[MSW] Withdrawal ${id} 승인:`, approved.name)
      return HttpResponse.json(approved)
    }
  ),

  // POST /api/admin/withdrawals/:id/reject - 탈퇴 거절
  mswHttp.post(
    `${ADMIN}/withdrawals/:id/reject`,
    async ({ request, params }) => {
      if (request.headers.get('x-bypass-mock')) return passthrough()

      await delay(150)

      try {
        const body = (await request.json()) as RejectRequestBody
        const id = parseInt(params.id as string)

        const rejected = withdrawalsDb.patch(id, {
          status: 'REJECTED',
          reason_detail: body.reason || '관리자에 의한 거절',
        })

        if (!rejected) {
          console.log(`[MSW] Withdrawal ${id} not found for rejection`)
          return HttpResponse.json(
            { message: 'Withdrawal not found' },
            { status: 404 }
          )
        }

        console.log(`[MSW] Withdrawal ${id} 거절:`, rejected.name, body.reason)
        return HttpResponse.json(rejected)
      } catch (error) {
        console.error('[MSW] Withdrawal rejection error:', error)
        return HttpResponse.json(
          { message: 'Invalid request data' },
          { status: 400 }
        )
      }
    }
  ),

  // GET /api/admin/withdrawals/stats - 통계 정보
  mswHttp.get(`${ADMIN}/withdrawals/stats`, async ({ request }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(50)

    const stats = withdrawalsDb.status()

    console.log('[MSW] 탈퇴 요청 통계 조회:', stats)
    return HttpResponse.json({
      total: stats.total,
      active: stats.byStatus.ACTIVE,
      inactive: stats.byStatus.INACTIVE,
      withdrawn: stats.byStatus.WITHDRAWN,
      permissions: stats.byPermission,
      topReasons: stats.byReason,
    })
  }),
]

export { withdrawalsDb }
