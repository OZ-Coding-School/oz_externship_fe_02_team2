import { http as mswHttp, HttpResponse, delay, passthrough } from 'msw'
import { ADMIN, like, paginate, sortByKey, toInt } from '../../utils'
import { db } from '../../db'
import type { UserDetail } from '@/components/ui/Modal/feature/User/User.types'

export const usersHandlers = [
  // GET /api/admin/users
  mswHttp.get(`${ADMIN}/users`, async ({ request }) => {
    // (중요) 바이패스 헤더가 있으면 실서버로 통과
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(120)
    const url = new URL(request.url)
    const page = toInt(url.searchParams.get('page'), 1)
    const pageSize = toInt(url.searchParams.get('pageSize'), 20)
    const sortBy = url.searchParams.get('sortBy') ?? 'joinedAt'
    const sortOrder = (url.searchParams.get('sortOrder') ?? 'desc') as
      | 'asc'
      | 'desc'
    const q = url.searchParams.get('q') ?? ''
    const role = url.searchParams.get('role')
    const status = url.searchParams.get('status') // '활성' | '비활성'

    let rows = [...db.users]
    if (q)
      rows = rows.filter((r) =>
        like(`${r.name} ${r.email} ${r.nickname ?? ''}`, q)
      )
    if (role) rows = rows.filter((r) => (r.role ?? '') === role)
    if (status) rows = rows.filter((r) => (r.status ?? '') === status)

    rows = sortByKey(
      rows as Record<string, unknown>[],
      sortBy,
      sortOrder
    ) as UserDetail[]
    const pageData = paginate<UserDetail>(rows, page, pageSize)
    return HttpResponse.json({ ...pageData, sortBy, sortOrder })
  }),

  // GET /api/admin/users/:id
  mswHttp.get(`${ADMIN}/users/:id`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(100)
    const found = db.users.find((u) => u.id === params.id)
    if (!found)
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(found)
  }),

  // PATCH /api/admin/users/:id
  mswHttp.patch(`${ADMIN}/users/:id`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(140)
    const body = (await request.json()) as Partial<UserDetail>
    const idx = db.users.findIndex((u) => u.id === params.id)
    if (idx < 0)
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    db.users[idx] = { ...db.users[idx], ...body }
    return HttpResponse.json(db.users[idx])
  }),
]
