// src/mocks/handlers/applyToStudy.handlers.ts  (MSW v2)
import { http, HttpResponse } from 'msw'
import { APPLY_TO_STUDY_MOCKS } from './ApplyToStudy.mock'

export const applyToStudyHandlers = [
  http.get('/api/admin/apply-to-study', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const size = Number(url.searchParams.get('size') ?? '10')
    const q = (url.searchParams.get('q') ?? '').toLowerCase().trim()
    const status = url.searchParams.get('status') ?? ''
    const sortBy = (url.searchParams.get('sortBy') ?? 'applied_at') as
      | 'applied_at'
      | 'updated_at'
    const sortOrder = (url.searchParams.get('sortOrder') ?? 'desc') as
      | 'asc'
      | 'desc'

    let list = APPLY_TO_STUDY_MOCKS.slice()

    if (q) {
      list = list.filter((it) =>
        [it.title, it.applicant.nickname, it.applicant.email]
          .join(' ')
          .toLowerCase()
          .includes(q)
      )
    }

    if (status) list = list.filter((it) => it.status === status)

    list.sort((a, b) => {
      const av = sortBy === 'updated_at' ? a.updatedAt : a.appliedAt
      const bv = sortBy === 'updated_at' ? b.updatedAt : b.appliedAt
      const cmp = new Date(av).getTime() - new Date(bv).getTime()
      return sortOrder === 'asc' ? cmp : -cmp
    })

    const total = list.length
    const start = (page - 1) * size
    const items = list.slice(start, start + size)
    const totalPages = Math.max(1, Math.ceil(total / Math.max(1, size)))

    return HttpResponse.json({ items, total, totalPages }, { status: 200 })
  }),
]
