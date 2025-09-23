import { http, HttpResponse } from 'msw'
import { recruitmentSeeds } from '@/mocks/seeds/recruitment.seed'
import type {
  RecruitmentListRes,
  SortKey,
} from '@/pages/AdminRecruitments/AdminRecruitments.types'

export const recruitmentHandlers = [
  // 목록
  http.get('/api/v1/recruiting-posts', ({ request }) => {
    const u = new URL(request.url)
    const page = Number(u.searchParams.get('page') || '1')
    const size = Number(u.searchParams.get('size') || '10')
    const query = (u.searchParams.get('query') || '').toLowerCase()
    const status = u.searchParams.get('status') as
      | 'ALL'
      | 'OPEN'
      | 'CLOSED'
      | null
    const tagIds = (u.searchParams.get('tagIds') || '')
      .split(',')
      .filter(Boolean)
    const sortKey = (u.searchParams.get('sortKey') || 'created_desc') as SortKey

    let list = [...recruitmentSeeds]
    if (query)
      list = list.filter((it) => it.title.toLowerCase().includes(query))
    if (status && status !== 'ALL')
      list = list.filter((it) => it.status === status)
    if (tagIds.length)
      list = list.filter((it) => it.tags.some((t) => tagIds.includes(t.id)))

    list.sort((a, b) => {
      switch (sortKey) {
        case 'created_asc':
          return a.created_at.localeCompare(b.created_at)
        case 'views_desc':
          return b.views_count - a.views_count
        case 'bookmarks_desc':
          return b.bookmarks_count - a.bookmarks_count
        default:
          return b.created_at.localeCompare(a.created_at)
      }
    })

    const start = (page - 1) * size
    const items = list.slice(start, start + size).map((d) => ({
      id: d.id,
      title: d.title,
      tags: d.tags,
      deadline: d.deadline,
      status: d.status,
      views_count: d.views_count,
      bookmarks_count: d.bookmarks_count,
      created_at: d.created_at,
      updated_at: d.updated_at,
    }))

    const body: RecruitmentListRes = { total: list.length, page, size, items }
    return HttpResponse.json(body)
  }),

  // 상세
  http.get('/api/v1/recruiting-posts/:id', ({ params }) => {
    const item = recruitmentSeeds.find((v) => v.id === String(params.id))
    if (!item)
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 })
    return HttpResponse.json(item)
  }),
]
