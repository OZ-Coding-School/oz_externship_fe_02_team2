/* eslint-disable @typescript-eslint/no-explicit-any */
import { http as mswHttp, HttpResponse, delay, passthrough } from 'msw'
import { like, sortByKey } from '../../utils'
import type { UserDetail } from '@type/User.types'
import { usersDb } from '@/mocks/seeds/users.seed'

// MSW 시작 시 DB 초기화
usersDb.init()

const MSW_BASE = '/api/v1/admin/users'

// ────────────────────────────────────────────────────────────────────────────
// 매퍼: DB(카멜) → 서버(스네이크)
// ────────────────────────────────────────────────────────────────────────────

function toServerUserList(u: UserDetail) {
  return {
    uuid: u.uuid,
    email: u.email,
    nickname: u.nickname,
    name: u.name,
    birthday: u.birthday,
    permission: u.permission,
    permission_display: u.permissionDisplay ?? null,
    status: u.status,
    created_at: u.createdAt,
    withdrawals_request_date: u.withdrawalsRequestDate ?? null,
  }
}

function toServerUserDetail(u: UserDetail) {
  return {
    uuid: u.uuid,
    name: u.name,
    gender: u.gender ?? '남성',
    nickname: u.nickname,
    birthday: u.birthday,
    phone_number: u.phoneNumber ?? null,
    email: u.email,
    permission: u.permission,
    status: u.status,
    created_at: u.createdAt,
    profile_img_url: u.profileImgUrl ?? null,
  }
}

// ────────────────────────────────────────────────────────────────────────────
// MSW 핸들러
// ────────────────────────────────────────────────────────────────────────────

export const usersHandlers = [
  // ──────────────────────────────────────────────────────────────────────────
  // GET /api/v1/admin/users/ - 목록 조회
  // ──────────────────────────────────────────────────────────────────────────
  mswHttp.get(`${MSW_BASE}/`, async ({ request }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(120 + Math.random() * 80)

    const url = new URL(request.url)
    console.log('[MSW] 🔵 Users 목록 요청:', url.search)

    // 페이지네이션
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1))
    const pageSize = Math.max(
      1,
      Number(url.searchParams.get('page_size') ?? 20)
    )

    // 검색/필터
    const search = url.searchParams.get('search') ?? ''
    const permission = url.searchParams.get('permission') ?? undefined
    const status = url.searchParams.get('status') ?? undefined
    const ordering = url.searchParams.get('ordering') ?? '-created_at'

    // 데이터 필터링
    let rows = [...usersDb.users]

    if (search) {
      rows = rows.filter((u) =>
        like(`${u.name} ${u.email} ${u.nickname}`, search)
      )
    }
    if (permission) {
      rows = rows.filter((u) => u.permission === permission)
    }
    if (status) {
      rows = rows.filter((u) => u.status === status)
    }

    // 정렬
    const isDesc = ordering.startsWith('-')
    const orderField = isDesc ? ordering.slice(1) : ordering
    // created_at → createdAt 매핑
    const sortKey = orderField === 'created_at' ? 'createdAt' : orderField

    rows = sortByKey(
      rows as Record<string, unknown>[],
      sortKey,
      isDesc ? 'desc' : 'asc'
    ) as UserDetail[]

    // 페이지네이션
    const start = (page - 1) * pageSize
    const pageRows = rows.slice(start, start + pageSize)
    const count = rows.length

    console.log(
      `[MSW] Users 목록: page=${page} size=${pageSize} count=${count}`
    )

    return HttpResponse.json({
      count,
      next: start + pageSize < count ? `?page=${page + 1}` : null,
      previous: page > 1 ? `?page=${page - 1}` : null,
      results: pageRows.map(toServerUserList),
    })
  }),

  // ──────────────────────────────────────────────────────────────────────────
  // GET /api/v1/admin/users/:uuid/ - 상세 조회
  // ──────────────────────────────────────────────────────────────────────────
  mswHttp.get(`${MSW_BASE}/:uuid/`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(60 + Math.random() * 40)

    const { uuid } = params
    const found = usersDb.users.find((u) => u.uuid === uuid)

    if (!found) {
      console.log(`[MSW] ❌ User ${uuid} not found`)
      return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    }

    console.log(`[MSW] User 상세 조회: ${uuid}`)
    return HttpResponse.json(toServerUserDetail(found))
  }),

  // ──────────────────────────────────────────────────────────────────────────
  // POST /api/v1/admin/users/ - 생성
  // ──────────────────────────────────────────────────────────────────────────
  mswHttp.post(`${MSW_BASE}/`, async ({ request }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(160)

    try {
      const body = (await request.json()) as any

      if (!body.name || !body.email) {
        return HttpResponse.json(
          { message: 'Name and email are required' },
          { status: 400 }
        )
      }

      const duplicate = usersDb.users.find((u) => u.email === body.email)
      if (duplicate) {
        return HttpResponse.json(
          { message: 'Email already exists' },
          { status: 409 }
        )
      }

      const newUser: UserDetail = {
        uuid: crypto.randomUUID(),
        email: body.email,
        nickname: body.nickname ?? '',
        name: body.name,
        birthday: body.birthday ?? '2000-01-01',
        permission: 'GENERAL',
        permissionDisplay: '일반회원',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        withdrawalsRequestDate: null,
        gender: '남성',
        phoneNumber: null,
        profileImgUrl: null,
      }

      usersDb.add(newUser)
      console.log(`[MSW] User 생성: ${newUser.uuid}`)
      return HttpResponse.json(toServerUserList(newUser), { status: 201 })
    } catch (e) {
      console.error('[MSW] User creation error:', e)
      return HttpResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      )
    }
  }),

  // ──────────────────────────────────────────────────────────────────────────
  // PATCH /api/v1/admin/users/:uuid/ - 부분 수정
  // ──────────────────────────────────────────────────────────────────────────
  mswHttp.patch(`${MSW_BASE}/:uuid/`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(120)

    try {
      const { uuid } = params
      const body = (await request.json()) as any

      const patch: Partial<UserDetail> = {}
      if ('name' in body) patch.name = body.name
      if ('gender' in body) patch.gender = body.gender
      if ('nickname' in body) patch.nickname = body.nickname
      if ('phone_number' in body) patch.phoneNumber = body.phone_number
      if ('profile_img_url' in body) patch.profileImgUrl = body.profile_img_url

      // status 매핑: 소문자 → 대문자
      if ('status' in body) {
        const statusMap: Record<string, UserDetail['status']> = {
          active: 'ACTIVE',
          inactive: 'INACTIVE',
        }
        patch.status = statusMap[body.status] ?? body.status
      }

      const updated = usersDb.patch(uuid as string, patch)

      if (!updated) {
        return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
      }

      console.log(`[MSW] User 수정: ${uuid}`)
      return HttpResponse.json(toServerUserDetail(updated))
    } catch (e) {
      console.error('[MSW] User update error:', e)
      return HttpResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      )
    }
  }),

  // ──────────────────────────────────────────────────────────────────────────
  // PUT /api/v1/admin/users/:uuid/ - 전체 교체
  // ──────────────────────────────────────────────────────────────────────────
  // ──────────────────────────────────────────────────────────────────────────
  // PUT /api/v1/admin/users/:uuid/ - 전체 교체
  // ──────────────────────────────────────────────────────────────────────────
  mswHttp.put(`${MSW_BASE}/:uuid/`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(150)

    try {
      const { uuid } = params
      const body = (await request.json()) as any

      const idx = usersDb.users.findIndex((u) => u.uuid === uuid)
      if (idx < 0) {
        return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
      }

      const patch: Partial<UserDetail> = {}
      if ('name' in body) patch.name = body.name
      if ('gender' in body) patch.gender = body.gender
      if ('nickname' in body) patch.nickname = body.nickname
      if ('phone_number' in body) patch.phoneNumber = body.phone_number
      if ('profile_img_url' in body) patch.profileImgUrl = body.profile_img_url
      if ('status' in body) {
        const statusMap: Record<string, UserDetail['status']> = {
          active: 'ACTIVE',
          inactive: 'INACTIVE',
        }
        patch.status = statusMap[body.status] ?? body.status
      }

      const updated = { ...usersDb.users[idx], ...patch }
      usersDb.users[idx] = updated

      console.log(`[MSW] User 전체 교체: ${uuid}`)
      return HttpResponse.json(toServerUserDetail(updated))
    } catch (e) {
      console.error('[MSW] User replacement error:', e)
      return HttpResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      )
    }
  }),

  // ──────────────────────────────────────────────────────────────────────────
  // DELETE /api/v1/admin/users/:uuid/ - 삭제
  // ──────────────────────────────────────────────────────────────────────────
  mswHttp.delete(`${MSW_BASE}/:uuid/`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()
    await delay(100)

    const { uuid } = params
    const removed = usersDb.remove(uuid as string)

    if (!removed) {
      return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    }

    console.log(`[MSW] User 삭제: ${uuid}`)
    return new HttpResponse(null, { status: 204 })
  }),

  // ──────────────────────────────────────────────────────────────────────────
  // PATCH /api/v1/admin/users/:uuid/permission/ - 권한 수정
  // ──────────────────────────────────────────────────────────────────────────
  mswHttp.patch(
    `${MSW_BASE}/:uuid/permission/`,
    async ({ request, params }) => {
      if (request.headers.get('x-bypass-mock')) return passthrough()
      await delay(120)

      try {
        const { uuid } = params
        const body = (await request.json()) as any

        if (!body.permission) {
          return HttpResponse.json(
            { message: 'Permission is required' },
            { status: 400 }
          )
        }

        const permissionDisplay =
          body.permission === 'ADMIN'
            ? '관리자'
            : body.permission === 'STAFF'
              ? '스태프'
              : '일반회원'

        const updated = usersDb.patch(uuid as string, {
          permission: body.permission,
          permissionDisplay,
        })

        if (!updated) {
          return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
        }

        console.log(`[MSW] User 권한 수정: ${uuid} → ${body.permission}`)
        return HttpResponse.json(toServerUserDetail(updated))
      } catch (e) {
        console.error('[MSW] Permission update error:', e)
        return HttpResponse.json(
          { message: 'Invalid request data' },
          { status: 400 }
        )
      }
    }
  ),
]
