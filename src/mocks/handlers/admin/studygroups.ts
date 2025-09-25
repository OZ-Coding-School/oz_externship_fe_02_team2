/* eslint-disable no-console */
import { http as mswHttp, HttpResponse, delay, passthrough } from 'msw'
import { studyGroupsDb } from '@/mocks/seeds/studygroups.seed'
import type { StudyGroupDetail } from '@/components/ui/Modal/feature/Study/Study.types'
import type { StudyGroupRow } from '@/components/table/Table.types'
import { like, paginate, sortByKey, toInt } from '@/mocks/utils'

// 유틸 함수들 (실제 프로젝트에서는 utils에서 import)
const ADMIN = '/api/v1/admin'

// 추가 타입 정의
interface StudyGroupsParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  q?: string
  status?: string
  isCompleted?: string
}

// DB 초기화
studyGroupsDb.init()

// DRF 스타일 파라미터를 FE 스타일로 변환
function parseParams(url: URL): StudyGroupsParams {
  // FE 스타일 파라미터 우선, DRF 스타일을 fallback으로 사용
  const page = toInt(url.searchParams.get('page'), 1)
  const pageSize = toInt(
    url.searchParams.get('pageSize') || url.searchParams.get('page_size'),
    20
  )
  const sortBy =
    url.searchParams.get('sortBy') ||
    parseOrderingField(url.searchParams.get('ordering')) ||
    'latest'
  const sortOrder = (url.searchParams.get('sortOrder') ||
    parseOrderingDirection(url.searchParams.get('ordering')) ||
    'desc') as 'asc' | 'desc'
  const q =
    url.searchParams.get('q') || url.searchParams.get('search') || undefined
  const status = url.searchParams.get('status') as string | undefined
  const isCompleted = url.searchParams.get('isCompleted') as string | undefined

  return { page, pageSize, sortBy, sortOrder, q, status, isCompleted }
}

// DRF ordering 파라미터 파싱
function parseOrderingField(ordering: string | null): string | undefined {
  if (!ordering) return undefined
  const field = ordering.startsWith('-') ? ordering.slice(1) : ordering

  // 필드명 매핑
  const fieldMap: Record<string, string> = {
    created_at: 'createdAt',
    updated_at: 'updatedAt',
    name: 'title',
    title: 'title',
  }

  return fieldMap[field] || field
}

function parseOrderingDirection(
  ordering: string | null
): 'asc' | 'desc' | undefined {
  if (!ordering) return undefined
  return ordering.startsWith('-') ? 'desc' : 'asc'
}

// StudyGroupDetail을 StudyGroupRow로 변환
function toListItem(detail: StudyGroupDetail): StudyGroupRow {
  return {
    id: detail.id,
    coverImageUrl: detail.coverImageUrl,
    title: detail.title,
    enrolled: detail.enrolled,
    capacity: detail.capacity,
    period: detail.period,
    status: detail.status,
    createdAt: detail.createdAt.slice(0, 16).replace('T', ' '), // YYYY-MM-DD HH:MM 형식
    updatedAt: detail.updatedAt.slice(0, 16).replace('T', ' '), // YYYY-MM-DD HH:MM 형식
  }
}

// 검색 및 필터링 함수
function searchAndFilter(
  studyGroups: StudyGroupDetail[],
  params: StudyGroupsParams
): StudyGroupDetail[] {
  let results = [...studyGroups]

  // 검색어 필터 (그룹명 기준)
  if (params.q) {
    results = results.filter((sg) => like(`${sg.title} ${sg.id}`, params.q!))
  }

  // 상태 필터
  if (params.status) {
    results = results.filter((sg) => sg.status === params.status)
  }

  // 종료 여부 필터
  if (params.isCompleted) {
    const isCompleted = params.isCompleted === 'true'
    results = results.filter((sg) => {
      const isGroupCompleted = sg.status === '종료됨'
      return isCompleted ? isGroupCompleted : !isGroupCompleted
    })
  }

  return results
}

// 정렬 함수
function sortStudyGroups(
  studyGroups: StudyGroupDetail[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): StudyGroupDetail[] {
  const sorted = [...studyGroups]

  switch (sortBy) {
    case 'latest':
      return sorted.sort((a, b) => {
        const diff =
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        return sortOrder === 'desc' ? diff : -diff
      })
    case 'oldest':
      return sorted.sort((a, b) => {
        const diff =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        return sortOrder === 'desc' ? -diff : diff
      })
    case 'title_asc':
    case 'title':
      return sorted.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title)
        return sortOrder === 'desc' ? -comparison : comparison
      })
    case 'title_desc':
      return sorted.sort((a, b) => {
        const comparison = b.title.localeCompare(a.title)
        return sortOrder === 'desc' ? -comparison : comparison
      })
    case 'createdAt':
      return sortByKey(
        sorted as unknown as Record<string, unknown>[],
        'createdAt',
        sortOrder
      ) as unknown as StudyGroupDetail[]
    case 'updatedAt':
      return sortByKey(
        sorted as unknown as Record<string, unknown>[],
        'updatedAt',
        sortOrder
      ) as unknown as StudyGroupDetail[]
    default:
      // 기본값: 최신순
      return sorted.sort((a, b) => {
        const diff =
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        return sortOrder === 'desc' ? diff : -diff
      })
  }
}

export const studyGroupHandlers = [
  // GET /api/v1/admin/studygroups - 목록 조회
  mswHttp.get(`${ADMIN}/studygroups`, async ({ request }) => {
    // 바이패스 헤더가 있으면 실서버로 통과
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(150 + Math.random() * 100)

    const url = new URL(request.url)
    const params = parseParams(url)

    console.log('[MSW] StudyGroups 요청 파라미터:', params)

    // 검색 및 필터링
    let results = searchAndFilter(studyGroupsDb.studyGroups, params)

    // 정렬
    results = sortStudyGroups(
      results,
      params.sortBy || 'latest',
      params.sortOrder || 'desc'
    )

    // 페이지네이션
    const pageData = paginate(
      results.map(toListItem),
      params.page || 1,
      params.pageSize || 20
    )

    console.log(
      `[MSW] StudyGroups 목록 조회: ${results.length}개 결과, 페이지 ${pageData.page}/${pageData.totalPages}`
    )

    // 응답 형식을 컴포넌트가 기대하는 형태로 맞춤
    return HttpResponse.json({
      items: pageData.items, // StudyGroupRow[] 배열
      page: pageData.page,
      pageSize: pageData.pageSize,
      totalPages: pageData.totalPages,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    })
  }),

  // GET /api/admin/studygroups/:id - 상세 조회
  mswHttp.get(`${ADMIN}/studygroups/:id`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(80 + Math.random() * 40)

    const id = parseInt(params.id as string)
    const found = studyGroupsDb.find(id)

    if (!found) {
      console.log(`[MSW] StudyGroup ${id} not found`)
      return HttpResponse.json(
        { message: 'Study group not found' },
        { status: 404 }
      )
    }

    console.log(`[MSW] StudyGroup ${id} 상세 조회:`, found.title)
    return HttpResponse.json(found)
  }),

  // GET /api/admin/studygroups/uuid/:uuid - UUID로 상세 조회
  mswHttp.get(
    `${ADMIN}/studygroups/uuid/:uuid`,
    async ({ request, params }) => {
      if (request.headers.get('x-bypass-mock')) return passthrough()

      await delay(80 + Math.random() * 40)

      const uuid = params.uuid as string
      const found = studyGroupsDb.findByUuid(uuid)

      if (!found) {
        console.log(`[MSW] StudyGroup uuid:${uuid} not found`)
        return HttpResponse.json(
          { message: 'Study group not found' },
          { status: 404 }
        )
      }

      console.log(`[MSW] StudyGroup uuid:${uuid} 상세 조회:`, found.title)
      return HttpResponse.json(found)
    }
  ),

  // PATCH /api/admin/studygroups/:id - 스터디 그룹 수정
  mswHttp.patch(`${ADMIN}/studygroups/:id`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(120 + Math.random() * 60)

    try {
      const body = (await request.json()) as Partial<StudyGroupDetail>
      const id = parseInt(params.id as string)

      // updatedAt 자동 갱신
      const updateData = {
        ...body,
        updatedAt: new Date().toISOString(),
      }

      const updated = studyGroupsDb.patch(id, updateData)

      if (!updated) {
        console.log(`[MSW] StudyGroup ${id} not found for update`)
        return HttpResponse.json(
          { message: 'Study group not found' },
          { status: 404 }
        )
      }

      console.log(`[MSW] StudyGroup ${id} 수정 완료:`, {
        title: updated.title,
        changes: Object.keys(body).join(', '),
      })

      return HttpResponse.json(updated)
    } catch (error) {
      console.error('[MSW] StudyGroup update error:', error)
      return HttpResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      )
    }
  }),

  // DELETE /api/admin/studygroups/:id - 스터디 그룹 삭제
  mswHttp.delete(`${ADMIN}/studygroups/:id`, async ({ request, params }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(100 + Math.random() * 50)

    const id = parseInt(params.id as string)
    const found = studyGroupsDb.find(id)

    if (!found) {
      console.log(`[MSW] StudyGroup ${id} not found for deletion`)
      return HttpResponse.json(
        { message: 'Study group not found' },
        { status: 404 }
      )
    }

    const removed = studyGroupsDb.remove(id)

    if (removed) {
      console.log(`[MSW] StudyGroup ${id} 삭제 완료:`, found.title)
      return new HttpResponse(null, { status: 204 })
    }

    return HttpResponse.json(
      { message: 'Failed to delete study group' },
      { status: 500 }
    )
  }),

  // GET /api/admin/studygroups/search/autocomplete - 검색 자동완성
  mswHttp.get(
    `${ADMIN}/studygroups/search/autocomplete`,
    async ({ request }) => {
      if (request.headers.get('x-bypass-mock')) return passthrough()

      await delay(50 + Math.random() * 30)

      const url = new URL(request.url)
      const query =
        url.searchParams.get('query') || url.searchParams.get('q') || ''
      const limit = toInt(url.searchParams.get('limit'), 10)

      console.log(`[MSW] StudyGroups 자동완성 검색: "${query}"`)

      if (!query.trim()) {
        return HttpResponse.json([])
      }

      const searchTerm = query.toLowerCase()
      const suggestions = studyGroupsDb.studyGroups
        .filter((sg) => sg.title.toLowerCase().includes(searchTerm))
        .slice(0, limit)
        .map((sg) => ({
          id: sg.id,
          title: sg.title,
          status: sg.status,
          enrolled: sg.enrolled,
          capacity: sg.capacity,
        }))

      console.log(`[MSW] 자동완성 결과: ${suggestions.length}개`)
      return HttpResponse.json(suggestions)
    }
  ),

  // GET /api/admin/studygroups/statistics - 통계 정보
  mswHttp.get(`${ADMIN}/studygroups/statistics`, async ({ request }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(60 + Math.random() * 40)

    const stats = studyGroupsDb.status()

    console.log('[MSW] 스터디 그룹 통계 조회:', stats)

    return HttpResponse.json({
      total: stats.total,
      waiting: stats.byStatus.대기중,
      active: stats.byStatus.진행중,
      completed: stats.byStatus.종료됨,
      totalMembers: stats.totalMembers,
      averageGroupSize: stats.averageGroupSize,
      totalCourses: stats.totalCourses,
    })
  }),

  // POST /api/admin/study-groups - 새 스터디 그룹 생성 (추가 기능)
  mswHttp.post(`${ADMIN}/studygroups`, async ({ request }) => {
    if (request.headers.get('x-bypass-mock')) return passthrough()

    await delay(200 + Math.random() * 100)

    try {
      const body = (await request.json()) as Partial<StudyGroupDetail>

      // 새 스터디 그룹 생성
      const now = new Date().toISOString()
      const newStudyGroup: StudyGroupDetail = {
        id: Date.now(), // 임시 ID
        uuid: `temp-${Date.now()}`, // 임시 UUID
        title: body.title || '새 스터디 그룹',
        coverImageUrl:
          body.coverImageUrl ||
          `https://picsum.photos/400/300?random=${Date.now()}`,
        enrolled: body.enrolled || 0,
        capacity: body.capacity || 10,
        period: body.period || {
          start: new Date().toISOString().split('T')[0],
          end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        status: body.status || '대기중',
        createdAt: now,
        updatedAt: now,
        members: body.members || [],
        courses: body.courses || [],
      }

      studyGroupsDb.add(newStudyGroup)

      console.log(`[MSW] 새 스터디 그룹 생성:`, newStudyGroup.title)
      return HttpResponse.json(newStudyGroup, { status: 201 })
    } catch (error) {
      console.error('[MSW] StudyGroup creation error:', error)
      return HttpResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      )
    }
  }),

  // PUT /api/admin/studygroups/:id/status - 스터디 상태 변경
  mswHttp.put(
    `${ADMIN}/studygroups/:id/status`,
    async ({ request, params }) => {
      if (request.headers.get('x-bypass-mock')) return passthrough()

      await delay(120 + Math.random() * 60)

      try {
        const body = (await request.json()) as { status: string }
        const id = parseInt(params.id as string)

        const updated = studyGroupsDb.patch(id, {
          status: body.status,
          updatedAt: new Date().toISOString(),
        })

        if (!updated) {
          console.log(`[MSW] StudyGroup ${id} not found for status update`)
          return HttpResponse.json(
            { message: 'Study group not found' },
            { status: 404 }
          )
        }

        console.log(`[MSW] StudyGroup ${id} 상태 변경:`, {
          title: updated.title,
          status: updated.status,
        })

        return HttpResponse.json(updated)
      } catch (error) {
        console.error('[MSW] StudyGroup status update error:', error)
        return HttpResponse.json(
          { message: 'Invalid request data' },
          { status: 400 }
        )
      }
    }
  ),

  // POST /api/admin/studygroups/:id/members - 멤버 추가
  mswHttp.post(
    `${ADMIN}/studygroups/:id/members`,
    async ({ request, params }) => {
      if (request.headers.get('x-bypass-mock')) return passthrough()

      await delay(100 + Math.random() * 50)

      try {
        const body = (await request.json()) as {
          memberId: string
          memberName: string
        }
        const id = parseInt(params.id as string)

        const studyGroup = studyGroupsDb.find(id)
        if (!studyGroup) {
          return HttpResponse.json(
            { message: 'Study group not found' },
            { status: 404 }
          )
        }

        // 정원 초과 체크
        if (studyGroup.enrolled >= studyGroup.capacity) {
          return HttpResponse.json(
            { message: 'Study group is full' },
            { status: 400 }
          )
        }

        // 이미 참가 중인지 체크
        if (studyGroup.members.some((member) => member.id === body.memberId)) {
          return HttpResponse.json(
            { message: 'Member already exists' },
            { status: 400 }
          )
        }

        const newMember = {
          id: body.memberId,
          name: body.memberName,
          isLeader: false,
        }

        const updated = studyGroupsDb.patch(id, {
          members: [...studyGroup.members, newMember],
          enrolled: studyGroup.enrolled + 1,
          updatedAt: new Date().toISOString(),
        })

        console.log(`[MSW] StudyGroup ${id} 멤버 추가:`, body.memberName)
        return HttpResponse.json(updated)
      } catch (error) {
        console.error('[MSW] Add member error:', error)
        return HttpResponse.json(
          { message: 'Invalid request data' },
          { status: 400 }
        )
      }
    }
  ),

  // DELETE /api/admin/studygroups/:id/members/:memberId - 멤버 제거
  mswHttp.delete(
    `${ADMIN}/studygroups/:id/members/:memberId`,
    async ({ request, params }) => {
      if (request.headers.get('x-bypass-mock')) return passthrough()

      await delay(100 + Math.random() * 50)

      const id = parseInt(params.id as string)
      const memberId = params.memberId as string

      const studyGroup = studyGroupsDb.find(id)
      if (!studyGroup) {
        return HttpResponse.json(
          { message: 'Study group not found' },
          { status: 404 }
        )
      }

      const memberToRemove = studyGroup.members.find(
        (member) => member.id === memberId
      )
      if (!memberToRemove) {
        return HttpResponse.json(
          { message: 'Member not found' },
          { status: 404 }
        )
      }

      // 리더 제거 시 다른 멤버를 리더로 지정
      const updatedMembers = studyGroup.members.filter(
        (member) => member.id !== memberId
      )
      if (memberToRemove.isLeader && updatedMembers.length > 0) {
        updatedMembers[0] = { ...updatedMembers[0], isLeader: true }
      }

      const updated = studyGroupsDb.patch(id, {
        members: updatedMembers,
        enrolled: Math.max(0, studyGroup.enrolled - 1),
        updatedAt: new Date().toISOString(),
      })

      console.log(`[MSW] StudyGroup ${id} 멤버 제거:`, memberToRemove.name)
      return HttpResponse.json(updated)
    }
  ),
]

export { studyGroupsDb }
