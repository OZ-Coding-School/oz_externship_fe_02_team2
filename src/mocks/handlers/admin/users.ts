/* eslint-disable no-console */
import { http as mswHttp, HttpResponse, delay, passthrough } from 'msw'
import { ADMIN, like, paginate, sortByKey, toInt } from '../../utils'
import type { UserDetail } from '@/components/ui/Modal/feature/User/User.types'
import { usersDb } from '@/mocks/seeds/users.seed'

// MSW 시작 시 DB 초기화
usersDb.init()

export const usersHandlers = [
  // GET /api/admin/users/stats - 통계 정보 (추가 기능)
  mswHttp.get(`${ADMIN}/users/stats`, async ({ request }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(50)

    const stats = {
      total: usersDb.users.length,
      active: usersDb.users.filter((u) => u.status === '활성').length,
      inactive: usersDb.users.filter((u) => u.status === '비활성').length,
      withdrawn: usersDb.users.filter((u) => u.status === '탈퇴요청').length,

      roles: {
        일반회원: usersDb.users.filter((u) => u.role === '일반회원').length,
        스태프: usersDb.users.filter((u) => u.role === '스태프').length,
        관리자: usersDb.users.filter((u) => u.role === '관리자').length,
      },
    }

    console.log('[MSW] 유저 통계 조회:', stats)
    return HttpResponse.json(stats)
  }),
  // GET /api/admin/users - 목록 조회 (필터링/정렬/페이지네이션)
  mswHttp.get(`${ADMIN}/users`, async ({ request }) => {
    // 바이패스 헤더가 있으면 실서버로 통과
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(150 + Math.random() * 100) // 실제 서버처럼 약간의 지연

    const url = new URL(request.url)
    const page = toInt(url.searchParams.get('page'), 1)
    const pageSize = toInt(url.searchParams.get('pageSize'), 20)
    const sortBy = url.searchParams.get('sortBy') ?? 'joinedAt'
    const sortOrder = (url.searchParams.get('sortOrder') ?? 'desc') as
      | 'asc'
      | 'desc'
    const q = url.searchParams.get('q') ?? ''
    const role = url.searchParams.get('role')
    const status = url.searchParams.get('status')

    // 시드 DB에서 현재 데이터 가져오기
    let rows = [...usersDb.users]

    // 검색 필터
    if (q) {
      rows = rows.filter((r) =>
        like(`${r.name} ${r.email} ${r.nickname ?? ''} ${r.id}`, q)
      )
    }

    // 역할 필터
    if (role) {
      rows = rows.filter((r) => (r.role ?? '') === role)
    }

    // 상태 필터
    if (status) {
      rows = rows.filter((r) => (r.status ?? '') === status)
    }

    // 정렬
    rows = sortByKey(
      rows as Record<string, unknown>[],
      sortBy,
      sortOrder
    ) as UserDetail[]

    // 페이지네이션
    const pageData = paginate<UserDetail>(rows, page, pageSize)

    console.log(
      `[MSW] Users 목록 조회: ${rows.length}개 결과, 페이지 ${page}/${pageData.totalPages}`
    )

    return HttpResponse.json({
      ...pageData,
      sortBy,
      sortOrder,
    })
  }),

  // GET /api/admin/users/:id - 상세 조회
  mswHttp.get(`${ADMIN}/users/:id`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(80 + Math.random() * 40)

    const found = usersDb.users.find(
      (u: { id: string | readonly string[] | undefined }) => u.id === params.id
    )
    if (!found) {
      console.log(`[MSW] User ${params.id} not found`)
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }

    console.log(`[MSW] User ${params.id} 상세 조회:`, found.name)
    return HttpResponse.json(found)
  }),

  // PATCH /api/admin/users/:id - 부분 수정 (권한 변경 포함)
  mswHttp.patch(`${ADMIN}/users/:id`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(120 + Math.random() * 60)

    try {
      const body = (await request.json()) as Partial<UserDetail>
      const userId = params.id as string

      // 시드 DB에서 업데이트
      const updated = usersDb.patch(userId, body)

      if (!updated) {
        console.log(`[MSW] User ${userId} not found for update`)
        return HttpResponse.json({ message: 'User not found' }, { status: 404 })
      }

      console.log(`[MSW] User ${userId} 수정 완료:`, {
        name: updated.name,
        changes: Object.keys(body).join(', '),
      })

      return HttpResponse.json(updated)
    } catch (error) {
      console.error('[MSW] User update error:', error)
      return HttpResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      )
    }
  }),

  // DELETE /api/admin/users/:id - 소프트 삭제 (상태를 '비활성'으로)
  mswHttp.delete(`${ADMIN}/users/:id`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(100 + Math.random() * 50)

    const userId = params.id as string

    // 실제 삭제 대신 상태를 '비활성'으로 변경
    const updated = usersDb.patch(userId, { status: '비활성' })

    if (!updated) {
      console.log(`[MSW] User ${userId} not found for deletion`)
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }

    console.log(`[MSW] User ${userId} 소프트 삭제 (비활성화):`, updated.name)

    // 하드 삭제를 원한다면 아래 코드 사용:
    // const deleted = usersDb.remove(userId)
    // if (!deleted) return HttpResponse.json({ message: 'User not found' }, { status: 404 })

    return new HttpResponse(null, { status: 204 })
  }),

  // POST /api/admin/users/:id/restore - 복구 (상태를 '활성'으로)
  mswHttp.post(`${ADMIN}/users/:id/restore`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(100)

    const userId = params.id as string
    const restored = usersDb.patch(userId, { status: '활성' })

    if (!restored) {
      console.log(`[MSW] User ${userId} not found for restore`)
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }

    console.log(`[MSW] User ${userId} 복구 완료:`, restored.name)
    return HttpResponse.json(restored)
  }),

  // POST /api/admin/users - 새 유저 생성 (필요시)
  mswHttp.post(`${ADMIN}/users`, async ({ request }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(200)

    try {
      const body = (await request.json()) as Partial<UserDetail>

      // 필수 필드 검증
      if (!body.name || !body.email) {
        return HttpResponse.json(
          { message: 'Name and email are required' },
          { status: 400 }
        )
      }

      // 이메일 중복 체크
      const existingUser = usersDb.users.find(
        (u: { email: string | undefined }) => u.email === body.email
      )
      if (existingUser) {
        return HttpResponse.json(
          { message: 'Email already exists' },
          { status: 409 }
        )
      }

      // 새 유저 생성
      const newUser: UserDetail = {
        id: `u_${Date.now()}`,
        name: body.name,
        email: body.email,
        gender: body.gender || '남성',
        nickname: body.nickname || '',
        birth: body.birth || '',
        phone: body.phone || '',
        role: body.role || '일반회원',
        status: body.status || '활성',
        joinedAt: new Date().toISOString(),
        avatarUrl: body.avatarUrl || '',
      }

      usersDb.add(newUser)

      console.log(`[MSW] 새 유저 생성:`, newUser.name)
      return HttpResponse.json(newUser, { status: 201 })
    } catch (error) {
      console.error('[MSW] User creation error:', error)
      return HttpResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      )
    }
  }),

  // PUT /api/admin/users/:id - 전체 교체 (필요시)
  mswHttp.put(`${ADMIN}/users/:id`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(150)

    try {
      const body = (await request.json()) as UserDetail
      const userId = params.id as string

      // 기존 유저가 있는지 확인
      const existingIndex = usersDb.users.findIndex(
        (u: { id: string }) => u.id === userId
      )
      if (existingIndex === -1) {
        return HttpResponse.json({ message: 'User not found' }, { status: 404 })
      }

      // ID는 변경하지 않음
      const updatedUser = { ...body, id: userId }
      usersDb.users[existingIndex] = updatedUser

      console.log(`[MSW] User ${userId} 전체 교체:`, updatedUser.name)
      return HttpResponse.json(updatedUser)
    } catch (error) {
      console.error('[MSW] User replacement error:', error)
      return HttpResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      )
    }
  }),
]
