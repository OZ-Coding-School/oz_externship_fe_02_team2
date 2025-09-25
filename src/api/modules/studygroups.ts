import type { StudyGroupRow } from '@/components/table/Table.types'
import { http, withBypass } from '../http'
import { decideBypass } from '../toggles/mockToggle'
import type { StudyGroupDetail } from '@/components/ui/Modal/feature/Study/Study.types'

export type SortOrder = 'asc' | 'desc'

export type StudyGroupsParams = {
  page?: number // 1-based
  pageSize?: number
  sortBy?: string
  sortOrder?: SortOrder
  q?: string
  status?: string
  isCompleted?: string | boolean
}

export type PageResp<T> = {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  sortBy?: string
  sortOrder?: SortOrder
}

export type StudyGroupStats = {
  total: number
  waiting: number
  active: number
  completed: number
  totalMembers: number
  averageGroupSize: number
  totalCourses: number
  byCategory?: Record<string, number>
}

export type StudyGroupSuggestion = {
  id: number
  title: string
  status: string
  enrolled: number
  capacity: number
}

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20

// undefined/null 제거 + 기본값 채우기
function buildParams(
  p: StudyGroupsParams = {}
): Record<string, string | number> {
  const params: Record<string, string | number | undefined> = {
    page: p.page ?? DEFAULT_PAGE,
    pageSize: p.pageSize ?? DEFAULT_PAGE_SIZE,
    sortBy: p.sortBy,
    sortOrder: p.sortOrder,
    q: p.q,
    status: p.status,
    isCompleted:
      typeof p.isCompleted === 'boolean'
        ? String(p.isCompleted)
        : p.isCompleted,
  }

  // 빈 값 제거
  const filteredParams: Record<string, string | number> = {}
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      filteredParams[key] = value
    }
  })

  return filteredParams
}

/* ------------------ 엔드포인트 ------------------ */
const BASE = '/v1/admin/studygroups'

// 목록 조회(듀얼 모드)
export async function getStudyGroups(
  params: StudyGroupsParams = {},
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.get<PageResp<StudyGroupRow>>(
    BASE,
    withBypass({ params: buildParams(params) }, bypass)
  )
  return res.data
}

// 상세 조회(듀얼 모드) - ID 기준
export async function getStudyGroupDetail(
  id: string | number,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.get<StudyGroupDetail>(
    `${BASE}/${id}`,
    withBypass({}, bypass)
  )
  return res.data
}

// 상세 조회(듀얼 모드) - UUID 기준
export async function getStudyGroupByUuid(
  uuid: string,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.get<StudyGroupDetail>(
    `${BASE}/uuid/${uuid}`,
    withBypass({}, bypass)
  )
  return res.data
}

// 부분 수정(듀얼 모드)
export async function updateStudyGroup(
  id: string | number,
  patch: Partial<StudyGroupDetail>,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.patch<StudyGroupDetail>(
    `${BASE}/${id}`,
    patch,
    withBypass({}, bypass)
  )
  return res.data
}

// 스터디 그룹 생성(듀얼 모드)
export async function createStudyGroup(
  data: Partial<StudyGroupDetail>,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.post<StudyGroupDetail>(
    BASE,
    data,
    withBypass({}, bypass)
  )
  return res.data
}

// 삭제(듀얼 모드)
export async function deleteStudyGroup(
  id: string | number,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.delete<void>(`${BASE}/${id}`, withBypass({}, bypass))
  return res.data // axios는 void면 undefined 반환 → 호출부에선 await만 하면 됨
}

// 상태 변경(듀얼 모드)
export async function updateStudyGroupStatus(
  id: string | number,
  status: string,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.put<StudyGroupDetail>(
    `${BASE}/${id}/status`,
    { status },
    withBypass({}, bypass)
  )
  return res.data
}

// 멤버 추가(듀얼 모드)
export async function addStudyGroupMember(
  id: string | number,
  memberData: { memberId: string; memberName: string },
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.post<StudyGroupDetail>(
    `${BASE}/${id}/members`,
    memberData,
    withBypass({}, bypass)
  )
  return res.data
}

// 멤버 제거(듀얼 모드)
export async function removeStudyGroupMember(
  id: string | number,
  memberId: string,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.delete<StudyGroupDetail>(
    `${BASE}/${id}/members/${memberId}`,
    withBypass({}, bypass)
  )
  return res.data
}

// 검색 자동완성(듀얼 모드)
export async function getStudyGroupSuggestions(
  query: string,
  limit: number = 10,
  opts?: { mock?: boolean }
) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.get<StudyGroupSuggestion[]>(
    `${BASE}/search/autocomplete`,
    withBypass(
      {
        params: {
          query,
          q: query, // MSW에서 둘 다 지원
          limit,
        },
      },
      bypass
    )
  )
  return res.data
}

// 통계 정보(듀얼 모드)
export async function getStudyGroupStats(opts?: { mock?: boolean }) {
  const bypass = decideBypass(opts?.mock)
  const res = await http.get<StudyGroupStats>(
    `${BASE}/statistics`,
    withBypass({}, bypass)
  )
  return res.data
}
