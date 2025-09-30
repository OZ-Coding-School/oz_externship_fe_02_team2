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

    if (status) {
      // 한글/ENUM 모두 허용
      const toKo = (s: string) =>
        s === 'APPROVED'
          ? '승인'
          : s === 'REJECTED'
            ? '거절'
            : s === 'INREVIEW' || s === 'REVIEWING' || s === 'UNDER_REVIEW'
              ? '검토 중'
              : s === 'PENDING'
                ? '대기'
                : s
      const target = toKo(status)
      list = list.filter((it) => it.status === target)
    }

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

  http.get('/api/admin/apply-to-study/:id', ({ params }) => {
    const id = Number(params.id)
    const base = APPLY_TO_STUDY_MOCKS.find((x) => x.id === id)
    if (!base)
      return HttpResponse.json({ message: 'Not found' }, { status: 404 })

    const toEnum = (s: string) =>
      s === '승인'
        ? 'APPROVED'
        : s === '거절'
          ? 'REJECTED'
          : s === '검토 중'
            ? 'INREVIEW'
            : 'PENDING'
    const pad = (n: number, w = 3) => String(n).padStart(w, '0')

    const detail = {
      applicationId: `#APP${pad(base.id)}`,
      recruitment: {
        id: base.id,
        uuid: `uuid-${base.id}`,
        title: base.title,
        expectedHeadcount: 8,
        lectures: [
          { title: '오리엔테이션', instructorName: '홍길동' },
          { title: '실전 과제 리뷰', instructorName: '김코드' },
        ],
        tags: [
          { id: 't1', name: '주 2회' },
          { id: 't2', name: '온라인' },
        ],
        deadlineDate: base.appliedAt.slice(0, 10),
      },
      applicant: {
        userId: String(base.id),
        nickname: base.applicant.nickname,
        email: base.applicant.email,
        gender: 'OTHER',
        profileImageUrl: '',
      },
      selfIntroduction: '안녕하세요. 열심히 참여하겠습니다.',
      motivation: '실무 역량 향상',
      goal: '프로젝트 완주',
      availableTimeDescription: '평일 저녁 8시 이후',
      hasStudyExperience: true,
      studyExperienceDetails: '코테 스터디 2회 진행',
      createdAt: base.appliedAt,
      updatedAt: base.updatedAt,
      status: toEnum(base.status),
    }
    return HttpResponse.json(detail, { status: 200 })
  }),
]
