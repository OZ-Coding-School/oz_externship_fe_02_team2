import type { StudyGroupRow } from '@/components/table/Table.types'
import { http, shouldUseMock, withBypass } from '../http'
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
const DEFAULT_PAGE_SIZE = 10

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
  const useMock = shouldUseMock(opts?.mock)
  const res = await http.get<PageResp<StudyGroupRow>>(
    BASE,
    withBypass({ params: buildParams(params) }, useMock)
  )
  return res.data
}

// 상세 조회(듀얼 모드) - ID 기준
export async function getStudyGroupDetail(
  id: string | number,
  opts?: { mock?: boolean }
) {
  const useMock = shouldUseMock(opts?.mock)
  const res = await http.get<StudyGroupDetail>(
    `${BASE}/${id}`,
    withBypass({}, useMock)
  )
  return res.data
}

// 상세 조회(듀얼 모드) - UUID 기준
export async function getStudyGroupByUuid(
  uuid: string,
  opts?: { mock?: boolean }
) {
  const useMock = shouldUseMock(opts?.mock)
  const res = await http.get<StudyGroupDetail>(
    `${BASE}/uuid/${uuid}`,
    withBypass({}, useMock)
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
