/* eslint-disable no-console */
import { http as mswHttp, HttpResponse, delay, passthrough } from 'msw'
import { ADMIN, like, paginate, sortByKey, toInt } from '../../utils'
import type {
  WithdrawalListItem,
  WithdrawalDetail,
  WithdrawalsParams,
  AdminPermission,
} from '@/api/modules/withdrawals'

// 추가 타입 정의
type WithdrawalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELLED'

interface WithdrawalDetailExtended extends Omit<WithdrawalDetail, 'status'> {
  status: WithdrawalStatus
}

interface RejectRequestBody {
  reason?: string
}

// 더미 데이터 생성
const withdrawalsDb = {
  withdrawals: [] as WithdrawalDetailExtended[],

  init() {
    if (this.withdrawals.length > 0) return // 이미 초기화됨

    const perms: AdminPermission[] = ['admin', 'staff', 'general']
    const statuses: WithdrawalStatus[] = [
      'PENDING',
      'APPROVED',
      'REJECTED',
      'COMPLETED',
    ]

    this.withdrawals = Array.from({ length: 58 }).map((_, i) => {
      const id = i + 1
      const baseDate = new Date()

      return {
        id,
        name: `회원${String(id).padStart(3, '0')}`,
        gender: i % 2 ? '남성' : '여성',
        nickname: `user${id}`,
        email: `user${String(id).padStart(3, '0')}@example.com`,
        permission: perms[i % perms.length],
        status: statuses[i % statuses.length],
        user_joined_at: new Date(
          baseDate.getTime() - (i + 50) * 86400_000
        ).toISOString(),
        profile_img_url:
          i % 3 === 0 ? `https://picsum.photos/seed/w${id}/80/80` : null,
        created_at: new Date(baseDate.getTime() - i * 3600_000).toISOString(),
        reason:
          i % 5 === 0
            ? 'NO_LONGER_NEEDED'
            : i % 5 === 1
              ? 'LACK_OF_INTEREST'
              : i % 5 === 2
                ? 'TOO_DIFFICULT'
                : i % 5 === 3
                  ? 'FOUND_BETTER_SERVICE'
                  : 'OTHER',
        reason_detail: i % 3 === 0 ? `탈퇴 사유 상세 내용 ${id}` : null,
        due_date: new Date(baseDate.getTime() + ((i % 10) + 7) * 86400_000)
          .toISOString()
          .slice(0, 10),
      } as WithdrawalDetailExtended
    })

    console.log(
      '[MSW] Withdrawals DB 초기화 완료:',
      this.withdrawals.length,
      '건'
    )
  },

  find(id: number): WithdrawalDetailExtended | undefined {
    return this.withdrawals.find((w) => w.id === id)
  },

  search(params: WithdrawalsParams) {
    let results = [...this.withdrawals]

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

    return results
  },

  update(
    id: number,
    updates: Partial<WithdrawalDetailExtended>
  ): WithdrawalDetailExtended | null {
    const index = this.withdrawals.findIndex((w) => w.id === id)
    if (index === -1) return null

    this.withdrawals[index] = { ...this.withdrawals[index], ...updates }
    return this.withdrawals[index]
  },
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
  const permission = url.searchParams.get('permission') as
    | AdminPermission
    | undefined

  return { page, pageSize, sortBy, sortOrder, q, permission }
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

// WithdrawalDetailExtended을 WithdrawalListItem으로 변환
function toListItem(detail: WithdrawalDetailExtended): WithdrawalListItem {
  return {
    id: detail.id,
    name: detail.name,
    email: detail.email,
    permission: detail.permission,
    status: detail.status as WithdrawalDetail['status'], // 타입 호환성을 위한 변환
    created_at: detail.created_at,
  }
}

export const withdrawalHandlers = [
  // GET /api/admin/withdrawals - 목록 조회
  mswHttp.get(`${ADMIN}/withdrawals`, async ({ request }) => {
    // 바이패스 헤더가 있으면 실서버로 통과
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(150 + Math.random() * 100)

    const url = new URL(request.url)
    const params = parseParams(url)

    // 검색 및 필터링
    let results = withdrawalsDb.search(params)

    // 정렬
    if (params.sortBy) {
      results = sortByKey(
        results as unknown as Record<string, unknown>[],
        params.sortBy,
        params.sortOrder || 'desc'
      ) as unknown as WithdrawalDetailExtended[]
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
      const body = (await request.json()) as Partial<WithdrawalDetailExtended>
      const id = parseInt(params.id as string)

      const updated = withdrawalsDb.update(id, body)

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
    withdrawalsDb.update(id, { status: 'CANCELLED' })

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
      const approved = withdrawalsDb.update(id, { status: 'APPROVED' })

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

        const rejected = withdrawalsDb.update(id, {
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

    const stats = {
      total: withdrawalsDb.withdrawals.length,
      pending: withdrawalsDb.withdrawals.filter((w) => w.status === 'PENDING')
        .length,
      approved: withdrawalsDb.withdrawals.filter((w) => w.status === 'APPROVED')
        .length,
      rejected: withdrawalsDb.withdrawals.filter((w) => w.status === 'REJECTED')
        .length,
      completed: withdrawalsDb.withdrawals.filter(
        (w) => w.status === 'COMPLETED'
      ).length,
      permissions: {
        admin: withdrawalsDb.withdrawals.filter((w) => w.permission === 'admin')
          .length,
        staff: withdrawalsDb.withdrawals.filter((w) => w.permission === 'staff')
          .length,
        general: withdrawalsDb.withdrawals.filter(
          (w) => w.permission === 'general'
        ).length,
      },
      topReasons: {
        NO_LONGER_NEEDED: withdrawalsDb.withdrawals.filter(
          (w) => w.reason === 'NO_LONGER_NEEDED'
        ).length,
        LACK_OF_INTEREST: withdrawalsDb.withdrawals.filter(
          (w) => w.reason === 'LACK_OF_INTEREST'
        ).length,
        TOO_DIFFICULT: withdrawalsDb.withdrawals.filter(
          (w) => w.reason === 'TOO_DIFFICULT'
        ).length,
        FOUND_BETTER_SERVICE: withdrawalsDb.withdrawals.filter(
          (w) => w.reason === 'FOUND_BETTER_SERVICE'
        ).length,
        OTHER: withdrawalsDb.withdrawals.filter((w) => w.reason === 'OTHER')
          .length,
      },
    }

    console.log('[MSW] 탈퇴 요청 통계 조회:', stats)
    return HttpResponse.json(stats)
  }),
]
