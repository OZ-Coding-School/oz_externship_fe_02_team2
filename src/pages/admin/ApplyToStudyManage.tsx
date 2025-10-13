import { useCallback, useMemo, useState } from 'react'
import { useTableFilters } from '@/hooks/useTableFilters'
import { useToast } from '@/hooks'
import type { ApplyToStudyRow } from '@/components/table/Table.types'
import type { EnhancedQueryChangeHandlers, EnhancedTableQuery } from '@/types'
import type { SortOrder } from '@/mocks/utils'
import { ApiError } from '@/api/http'

import ApplyToStudyTable from '@/components/table/feature/ApplyToStudy/ApplyToStudyTable'
import ApplyToStudyFilterBar from '@/components/table/feature/ApplyToStudy/ApplyToStudyFilter'
import type { ApplyToStudyDetail as ApplyToStudyDetailFull } from '@/components/ui/Modal/feature/ApplyToStudy/ApplyToStudy.types'
import ApplyToStudyModal from '@/components/ui/Modal/feature/ApplyToStudy/ApplyToStudyModal'
import type {
  ApplyToStudyDetail as ApplyToStudyDetailUI,
  Lecture as LectureUI,
  Tag as TagUI,
  Gender as GenderUI,
  ApplyToStudyStatus as StatusUI,
} from '@/components/ui/Modal/feature/ApplyToStudy/ApplyToStudy.types'

// ── studyassistance 어댑터 유틸 ─────────────────
const koFromEn: Record<string, '승인' | '검토 중' | '대기' | '거절'> = {
  approved: '승인',
  review: '검토 중',
  pending: '대기',
  rejected: '거절',
}
const enFromKo: Record<string, 'approved' | 'review' | 'pending' | 'rejected'> =
  {
    승인: 'approved',
    '검토 중': 'review',
    검토중: 'review',
    대기: 'pending',
    거절: 'rejected',
  }

// ── seed → UI Enum 매핑
const genderMap: Record<string, GenderUI> = {
  남성: 'MALE',
  여성: 'FEMALE',
  기타: 'OTHER',
}

const statusMap: Record<string, StatusUI> = {
  approved: 'APPROVED',
  review: 'INREVIEW',
  pending: 'PENDING',
  rejected: 'REJECTED',
}

const toAppIdString = (n: number | string) => `APP${String(n).padStart(4, '0')}`
const toIso = (s: string) => {
  if (!s) return ''
  const t = s.includes('T') ? s : s.replace(' ', 'T')
  return /\d{2}:\d{2}:\d{2}$/.test(t) ? t : `${t}:00`
}
const toDateOnly = (s: string) =>
  s ? (s.split(' ')[0] ?? s.split('T')[0] ?? '') : ''
const digits = (id: string) => Number(String(id).replace(/\D/g, '')) || 0

// ==== (임시) API 타입 & 모듈 ====
type ApplyToStudyDetail = {
  id: number
  title: string
  applicant: { nickname: string; email: string }
  status: '승인' | '검토 중' | '대기' | '거절'
  appliedAt: string // ISO
  updatedAt: string // ISO
}
type ApplyToStudyListRes = {
  items: ApplyToStudyDetail[]
  total: number
  totalPages: number
}

async function getApplyToStudyList(params: {
  page: number
  pageSize: number
  sortBy: string
  sortOrder: SortOrder
  q?: string
  status?: string // 한글(승인/검토 중/대기/거절) 들어옴
}): Promise<ApplyToStudyListRes> {
  // studyassistance 규격: limit/offset/sort(latest|oldest)/status(영문)/q
  const base = new URL('/api/v1/admin/studyassistance', window.location.origin)
  const limit = params.pageSize
  const offset = (params.page - 1) * params.pageSize
  const sort =
    params.sortBy.toLowerCase() === 'applied_at' && params.sortOrder === 'asc'
      ? 'oldest'
      : 'latest'
  base.searchParams.set('limit', String(limit))
  base.searchParams.set('offset', String(offset))
  base.searchParams.set('sort', sort)
  if (params.q) base.searchParams.set('q', params.q)
  if (params.status)
    base.searchParams.set('status', enFromKo[params.status] ?? '')

  const res = await fetch(base.toString())
  if (!res.ok) {
    const raw = (await res.text()) || ''
    let json: any = {}
    try {
      json = raw ? JSON.parse(raw) : {}
    } catch {}
    const message =
      (json &&
        typeof json === 'object' &&
        (json.message || json.error || json.detail)) ||
      raw.trim() ||
      res.statusText ||
      'Failed to fetch'
    throw new ApiError(String(res.status), { ...json, message })
  }

  // studyassistance 목록 응답 → 페이지가 쓰는 형태로 매핑
  const json = (await res.json()) as {
    items: Array<{
      id: string
      ad: { title: string }
      applicant: { nickname: string; email: string }
      status: 'approved' | 'review' | 'pending' | 'rejected'
      appliedAt: string
      updatedAt: string
    }>
    total: number
  }

  const items: ApplyToStudyDetail[] = json.items.map((a) => ({
    id: digits(a.id), // 'APP0001' → 1
    title: a.ad.title,
    applicant: a.applicant,
    status: koFromEn[a.status],
    appliedAt: toIso(a.appliedAt),
    updatedAt: toIso(a.updatedAt),
  }))
  const total = json.total
  const totalPages = Math.max(
    1,
    Math.ceil(total / Math.max(1, params.pageSize))
  )
  return { items, total, totalPages }
}

async function getApplyToStudyDetail(
  id: number
): Promise<ApplyToStudyDetailUI> {
  // 시드는 내부 키(예: 'APP0001')를 path로 받음
  const res = await fetch(`/api/v1/admin/studyassistance/${toAppIdString(id)}`)
  if (!res.ok) {
    const raw = (await res.text()) || ''
    let json: any = {}
    try {
      json = raw ? JSON.parse(raw) : {}
    } catch {}
    const message =
      (json &&
        typeof json === 'object' &&
        (json.message || json.error || json.detail)) ||
      raw.trim() ||
      res.statusText ||
      'Failed to fetch'
    throw new ApiError(String(res.status), { ...json, message })
  }

  const a = (await res.json()) as any
  // a: StudyApplicationDetail (seed)
  //  - a.id: 'APP0001'
  //  - a.ad: { id:'AD_1234', title:string }
  //  - a.adDetail: { headcount:number, lectures:[{title, teacher}], tags:string[], deadline:'YYYY-MM-DD HH:MM' }
  //  - a.applicant: { nickname, email, gender:'남성'|'여성'|'기타', avatarUrl? }
  //  - a.status: 'approved'|'pending'|'rejected'|'review'
  //  - a.appliedAt / a.updatedAt: 'YYYY-MM-DD HH:MM'
  //  - intro/motivation/goal/availableTime/hasExperience/experienceDetail

  const applicationId = `#${a.id}` // 예시 포맷: "#APP0001"

  // 태그: string[] → {id,name}[]
  const tags: TagUI[] = Array.isArray(a?.adDetail?.tags)
    ? a.adDetail.tags.map((name: string, i: number) => ({
        id: `${a?.ad?.id ?? a.id}-tag-${i}-${name}`,
        name,
      }))
    : []

  // 강의: {title, teacher} → {title, instructorName}
  const lectures: LectureUI[] = Array.isArray(a?.adDetail?.lectures)
    ? a.adDetail.lectures.map((l: any) => ({
        title: l?.title ?? '',
        instructorName: l?.teacher ?? l?.instructor ?? '',
      }))
    : []

  // 모집 요약
  const recruitment = {
    id: digits(a?.ad?.id ?? ''), // 시드엔 숫자 id 없음 → 숫자만 추출, 없으면 클릭한 id로 대체해도 됨
    uuid: String(a?.ad?.id ?? a.id), // 시드에 uuid 없음 → ad.id를 uuid로 사용
    title: a?.ad?.title ?? '',
    expectedHeadcount: Number(a?.adDetail?.headcount ?? 0),
    lectures,
    tags,
    deadlineDate: toDateOnly(a?.adDetail?.deadline ?? ''), // 'YYYY-MM-DD'
  }

  // 지원자
  const applicant = {
    userId: a?.applicant?.email ?? String(id), // 시드에 별도 userId 없음 → email 사용
    nickname: a?.applicant?.nickname ?? '',
    email: a?.applicant?.email ?? '',
    gender: a?.applicant?.gender ? genderMap[a.applicant.gender] : undefined,
    profileImageUrl: a?.applicant?.avatarUrl || undefined,
  }

  // 최종 UI 도메인
  const ui: ApplyToStudyDetailUI = {
    applicationId,
    recruitment,
    applicant,
    selfIntroduction: a?.intro ?? null,
    motivation: a?.motivation ?? null,
    goal: a?.goal ?? null,
    availableTimeDescription: a?.availableTime ?? null,
    hasStudyExperience: Boolean(a?.hasExperience),
    studyExperienceDetails: a?.hasExperience
      ? (a?.experienceDetail ?? null)
      : null,
    createdAt: toIso(a?.appliedAt),
    updatedAt: toIso(a?.updatedAt),
    status: statusMap[a?.status as keyof typeof statusMap], // 'APPROVED' | 'INREVIEW' | 'PENDING' | 'REJECTED'
  }

  return ui
}

// ==== 헬퍼 ====
const SORT_KEY_MAP: Record<string, string> = {
  id: 'id',
  title: 'title',
  status: 'status',
  appliedAt: 'applied_at',
  updatedAt: 'updated_at',
}

const toBackendSort = (sortKey?: string) => {
  // 최신순/오래된 순만 지원
  if (sortKey === 'created_asc')
    return { sortBy: 'applied_at', sortOrder: 'asc' as SortOrder }
  return { sortBy: 'applied_at', sortOrder: 'desc' as SortOrder }
}

// API → 테이블 로우
function mapToRow(a: ApplyToStudyDetail): ApplyToStudyRow {
  return {
    id: a.id,
    title: a.title,
    status: a.status,
    appliedAt: a.appliedAt,
    updatedAt: a.updatedAt,
    applicant: a.applicant,
  } as unknown as ApplyToStudyRow
}

export default function ApplyToStudyManage() {
  const { triggerToast } = useToast()

  // 서버 데이터 상태
  const [rows, setRows] = useState<ApplyToStudyRow[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortKeyUI, setSortKeyUI] = useState<'created_desc' | 'created_asc'>(
    'created_desc'
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<ApplyToStudyDetailFull | null>(
    null
  )
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)

  // 테이블 필터 훅 (URL 동기화 포함)
  const tableFilters = useTableFilters({
    initialQuery: {
      page: 1,
      pageSize: 10,
      search: '',
      status: undefined,
      sortBy: 'applied_at',
      sortDir: 'desc',
    },
    syncUrl: true,
    debounceMs: 300,
    onQueryChange: async (q) => {
      await loadList(q)
    },
  })

  // 목록 로드
  const loadList = useCallback(
    async (query: EnhancedTableQuery) => {
      try {
        setLoading(true)
        setError(null)
        const sortBy = query.sortBy
          ? (SORT_KEY_MAP[query.sortBy] ?? query.sortBy)
          : 'applied_at'
        const sortOrder: SortOrder = query.sortDir === 'asc' ? 'asc' : 'desc'
        const q = (query.search ?? '').trim()

        const data = await getApplyToStudyList({
          page: query.page,
          pageSize: query.pageSize,
          sortBy,
          sortOrder,
          ...(q && { q }),
          ...(query.status && { status: query.status }),
        })

        setRows(data.items.map(mapToRow))
        setTotal(data.total)
        setTotalPages(data.totalPages ?? 1)
      } catch (e: unknown) {
        const msg =
          e instanceof ApiError || e instanceof Error
            ? e.message
            : '알 수 없는 오류'
        setRows([])
        setTotal(0)
        setTotalPages(1)
        setError(msg)
        triggerToast('error', '데이터 로딩 실패', msg)
      } finally {
        setLoading(false)
      }
    },
    [triggerToast]
  )

  // DataTable에서 오는 상태 변경 (페이지/페이지사이즈/헤더정렬)
  const handleTableRequest = useCallback(
    ({
      page,
      pageSize,
      sort,
    }: {
      page: number
      pageSize: number
      sort?: { id: string; desc: boolean } | null
    }) => {
      if (page !== tableFilters.query.page) tableFilters.setPage(page)
      if (pageSize !== tableFilters.query.pageSize)
        tableFilters.setPageSize(pageSize)

      if (sort) {
        const sortBy = sort.id
        const sortDir = sort.desc ? 'desc' : 'asc'
        if (
          sortBy !== tableFilters.query.sortBy ||
          sortDir !== tableFilters.query.sortDir
        ) {
          tableFilters.setSort(sortBy, sortDir)
          if (sortBy === 'applied_at' || sortBy === 'appliedAt') {
            setSortKeyUI(sortDir === 'asc' ? 'created_asc' : 'created_desc')
          }
        }
      } else if (tableFilters.query.sortBy) {
        tableFilters.setSort(null)
        setSortKeyUI('created_desc')
      }
    },
    [tableFilters]
  )

  // FilterBar → TableFilters 연결 (정렬: 최신/오래된만)
  const enhancedOnQueryChange: EnhancedQueryChangeHandlers = useMemo(
    () => ({
      ...tableFilters.onQueryChange,
      setSort: (sortKey) => {
        const { sortBy, sortOrder } = toBackendSort(sortKey ?? undefined)
        tableFilters.setSort(sortBy, sortOrder)
        setSortKeyUI(
          (sortKey as 'created_desc' | 'created_asc') ?? 'created_desc'
        )
      },
      setStatus: (status) => {
        const newQuery = { ...tableFilters.query, status }
        tableFilters.updateQuery(newQuery)
        void loadList(newQuery)
      },
    }),
    [tableFilters, loadList]
  )

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">지원 내역 관리</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                데이터 로딩 오류
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => void loadList(tableFilters.query)}
                className="btn btn-sm btn-outline-error"
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-white shadow">
        <ApplyToStudyFilterBar
          query={
            {
              ...tableFilters.query,
              sortKey: sortKeyUI,
            } as unknown as any
          }
          onQueryChange={enhancedOnQueryChange as any}
          density="compact"
          tone="elevated"
          stickyTop={64}
          config={{
            sortOptions: [
              { label: '최신순', value: 'created_desc' },
              { label: '오래된 순', value: 'created_asc' },
            ],
            sortPlaceholder: '정렬',
            searchPlaceholder: '공고명, 지원자 닉네임, 이메일 검색...',
            statusPlaceholder: '전체',
          }}
        />
      </div>

      <div className="mt-7">
        <ApplyToStudyTable
          rows={rows}
          total={total}
          loading={loading}
          totalPages={totalPages}
          onRequest={handleTableRequest}
          onRowClick={async (row) => {
            setModalOpen(true)
            setModalLoading(true)
            setModalError(null)
            setModalData(null)
            try {
              const detail = await getApplyToStudyDetail((row as any).id)
              setModalData(detail)
            } catch (e: unknown) {
              const msg =
                e instanceof ApiError || e instanceof Error
                  ? e.message
                  : '상세 조회 실패'
              setModalError(msg)
              triggerToast('error', '상세 정보 로딩 실패', msg)
            } finally {
              setModalLoading(false)
            }
          }}
        />
      </div>
      <ApplyToStudyModal
        open={modalOpen}
        data={modalData ?? undefined}
        loading={modalLoading}
        errorText={modalError ?? undefined}
        onClose={() => {
          setModalOpen(false)
          setModalData(null)
          setModalError(null)
        }}
      />
    </div>
  )
}
