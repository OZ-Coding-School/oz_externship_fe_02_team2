import { http, HttpResponse } from 'msw'
import {
  studyAppsDb,
  type ApplicationStatus,
  type SortKey,
} from '@/mocks/seeds/studyAssistance.seed'

// 안전한 숫자 파서
function toInt(value: string | null, def: number): number {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : def
}

// 상태 토큰 → 내부 코드 매핑 (영문/한글/공백 허용)
const STATUS_ALIAS: Record<string, ApplicationStatus> = {
  approved: 'approved',
  pending: 'pending',
  rejected: 'rejected',
  review: 'review',
  // 한글 별칭
  승인: 'approved',
  대기: 'pending',
  거절: 'rejected',
  검토중: 'review',
}

// 단일 상태 파싱 (시드 규격에 맞춤)
function parseStatus(url: URL): ApplicationStatus | '' {
  const raw = (url.searchParams.get('status') || '').trim()
  if (!raw) return ''
  const key = raw.toLowerCase().replace(/\s+/g, '')
  // 한글 키도 지원하기 위해 원문도 한 번 더 조회
  const mapped =
    STATUS_ALIAS[key] ?? STATUS_ALIAS[raw as keyof typeof STATUS_ALIAS] // 한글 그대로 들어온 경우
  return mapped ?? ''
}

export const studyApplicationsHandlers = [
  /**
   * 목록 조회 (시드 스펙에 맞춘 단일 상태 필터)
   * GET /api/v1/admin/study-applications?limit=&offset=&status=&sort=&q=
   *
   * - limit: number (기본 10)
   * - offset: number (기본 0)
   * - status: approved|pending|rejected|review (단일)
   * - sort: latest|oldest (기본 latest)
   * - q: 문자열 (공고명/닉네임/이메일 부분검색)
   */
  http.get('/api/v1/admin/study-applications', ({ request }) => {
    studyAppsDb.init()

    const url = new URL(request.url)
    const limit = toInt(url.searchParams.get('limit'), 10)
    const offset = toInt(url.searchParams.get('offset'), 0)
    const q = (url.searchParams.get('q') || '').trim()
    const sort = ((url.searchParams.get('sort') as SortKey) ||
      'latest') as SortKey
    const status = parseStatus(url) // ← 단일 상태만 전달

    const data = studyAppsDb.query({ limit, offset, q, sort, status })
    return HttpResponse.json(data)
  }),

  /**
   * 상세 조회
   * GET /api/v1/admin/study-applications/:id
   */
  http.get('/api/v1/admin/study-applications/:id', ({ params }) => {
    studyAppsDb.init()
    const id = String(params.id)
    const found = studyAppsDb.getById(id)
    if (!found) {
      return HttpResponse.json(
        { message: `Application ${id} not found` },
        { status: 404 }
      )
    }
    return HttpResponse.json(found)
  }),
]
