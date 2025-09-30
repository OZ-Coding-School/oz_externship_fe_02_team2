import { http, HttpResponse } from 'msw'
import {
  studyAppsDb,
  sortByAppliedAt,
  searchHit,
  type ApplicationStatus,
} from '@/mocks/seeds/studyAssistance.seed'

const toInt = (v: string | null, d: number) =>
  Number.isFinite(Number(v)) && Number(v) >= 0 ? Number(v) : d
const toNumId = (id: string) => Number(String(id).replace(/\D/g, '')) || 0
const toIso = (s: string) => {
  const t = s.includes('T') ? s : s.replace(' ', 'T')
  return /\d{2}:\d{2}:\d{2}$/.test(t) ? t : `${t}:00`
}
const KO_FROM_EN: Record<
  ApplicationStatus,
  '승인' | '검토 중' | '대기' | '거절'
> = {
  approved: '승인',
  review: '검토 중',
  pending: '대기',
  rejected: '거절',
}
const EN_FROM_ANY: Record<string, ApplicationStatus> = {
  approved: 'approved',
  review: 'review',
  pending: 'pending',
  rejected: 'rejected',
  승인: 'approved',
  검토중: 'review',
  '검토 중': 'review',
  대기: 'pending',
  거절: 'rejected',
}

export const applyToStudyList = http.get(
  '/api/admin/apply-to-study',
  ({ request }) => {
    studyAppsDb.init()
    const url = new URL(request.url)
    const page = Math.max(1, toInt(url.searchParams.get('page'), 1))
    const size = Math.max(1, toInt(url.searchParams.get('size'), 10))
    const sortBy = (
      url.searchParams.get('sortBy') || 'applied_at'
    ).toLowerCase()
    const sortOrder = (
      url.searchParams.get('sortOrder') || 'desc'
    ).toLowerCase()
    const q = (url.searchParams.get('q') || '').trim()
    const rawStatus = (url.searchParams.get('status') || '').trim()
    const status = EN_FROM_ANY[rawStatus] || ''

    const order =
      sortBy === 'applied_at' && sortOrder === 'asc'
        ? 'oldest'
        : ('latest' as const)

    let list = [...studyAppsDb.rows]
    if (status) list = list.filter((r) => r.status === status)
    if (q) list = list.filter((r) => searchHit(r, q))
    sortByAppliedAt(list, order)

    const total = list.length
    const offset = (page - 1) * size
    const items = list.slice(offset, offset + size).map((a) => ({
      id: toNumId(a.id),
      title: a.ad.title,
      applicant: { nickname: a.applicant.nickname, email: a.applicant.email },
      status: KO_FROM_EN[a.status],
      appliedAt: toIso(a.appliedAt),
      updatedAt: toIso(a.updatedAt),
    }))
    const totalPages = Math.max(1, Math.ceil(total / size))
    return HttpResponse.json({ items, total, totalPages })
  }
)

export const applyToStudyDetail = http.get(
  '/api/admin/apply-to-study/:id',
  ({ params }) => {
    studyAppsDb.init()
    const idNum = Number(params.id)
    if (!Number.isFinite(idNum) || idNum <= 0) {
      return HttpResponse.json({ message: 'Invalid id' }, { status: 400 })
    }
    const found = studyAppsDb.rows.find((r) => toNumId(r.id) === idNum)
    if (!found)
      return HttpResponse.json(
        { message: `Application ${idNum} not found` },
        { status: 404 }
      )

    return HttpResponse.json({
      ...found,
      id: idNum,
      status: KO_FROM_EN[found.status],
      appliedAt: toIso(found.appliedAt),
      updatedAt: toIso(found.updatedAt),
      adDetail: { ...found.adDetail, deadline: toIso(found.adDetail.deadline) },
    })
  }
)

export const applyToStudyHandlers = [applyToStudyList, applyToStudyDetail]
