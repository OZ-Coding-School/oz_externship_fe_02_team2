// MSW StudyApplications 목업 데이터 — 결정적(재현 가능) 시드 + 퍼시스트(localStorage) 옵션
// - Users 시드와 동일한 패턴(LCG RNG, 분포 기반 생성, 퍼시스트)
// - faker 미사용: 한국어 프리셋 + 간단 로직
// - 검색 대상: 공고명 / 지원자 닉네임 / 지원자 이메일
// -----------------------------------------------------------------------------

// ── 타입 ─────────────────────────────────────────────────────────────────────
export type ApplicationStatus = 'approved' | 'pending' | 'rejected' | 'review'

export interface StudyAdSummary {
  id: string
  title: string // 공고명
}

export interface ApplicantSummary {
  nickname: string
  email: string
  gender: '남성' | '여성' | '기타'
  avatarUrl?: string
}

export interface StudyApplicationListItem {
  id: string // 고유 ID (PK) e.g. APP0001
  ad: StudyAdSummary
  applicant: ApplicantSummary
  status: ApplicationStatus
  appliedAt: string // YYYY-MM-DD HH:MM
  updatedAt: string // YYYY-MM-DD HH:MM
}

export interface StudyLecture {
  title: string // 강의명
  teacher: string // 강사명
}

export interface StudyApplicationDetail extends StudyApplicationListItem {
  adDetail: {
    headcount: number // 모집 인원
    lectures: StudyLecture[] // 강의 목록
    tags: string[] // 사용자 정의 태그
    deadline: string // YYYY-MM-DD HH:MM
  }
  intro: string // 자기소개
  motivation: string // 지원 동기
  goal: string // 스터디 목표
  availableTime: string // 가능한 시간대
  hasExperience: boolean // 스터디 경험 유무
  experienceDetail?: string // 구체적 경험
}

// ── 설정값 ───────────────────────────────────────────────────────────────────
const APP_COUNT = Number(import.meta.env.VITE_MSW_STUDY_APPS ?? 120)
const PERSIST_KEY = '__msw_study_apps__'
const ENABLE_PERSIST = true

// 상태 분포(%) — 합계 100
const STATUS_DIST: Record<ApplicationStatus, number> = {
  approved: 38,
  pending: 22,
  rejected: 18,
  review: 22,
}

// ── RNG(결정적) ──────────────────────────────────────────────────────────────
function lcg(seed = 123456789) {
  let s = seed >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0
    return s / 0xffffffff
  }
}
const rnd = lcg(20250926) // 날짜/버전에 맞춰 고정
const rndInt = (min: number, max: number) =>
  Math.floor(rnd() * (max - min + 1)) + min

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rnd() * arr.length)]
}
function pickByDist<T extends string>(dist: Record<T, number>): T {
  const keys = Object.keys(dist) as T[]
  const total = keys.reduce((s, k) => s + (dist[k] ?? 0), 0) || 1
  let r = rnd() * total
  for (const k of keys) {
    const v = dist[k] ?? 0
    if (r < v) return k
    r -= v
  }
  return keys[0]
}

// ── 프리셋 ───────────────────────────────────────────────────────────────────
const adTitles = [
  'React 마스터 스터디 모집',
  'Python Django 웹개발 스터디',
  '데이터 사이언스 기초 스터디',
  'Node.js 백엔드 개발 스터디',
  '알고리즘/코테 스터디',
  'TypeScript 심화 스터디',
  '프론트엔드 마스터 클래스',
] as const

const lastNames = [
  '김',
  '이',
  '박',
  '최',
  '정',
  '강',
  '조',
  '윤',
  '장',
  '임',
] as const
const firstLeft = [
  '민',
  '서',
  '지',
  '하',
  '도',
  '준',
  '연',
  '시',
  '예',
  '수',
] as const
const firstRight = [
  '우',
  '민',
  '윤',
  '아',
  '율',
  '호',
  '진',
  '원',
  '빈',
  '현',
] as const
const nickSuffix = [
  '_dev',
  '_fe',
  '_be',
  '_oz',
  '_pro',
  '_01',
  '_02',
  '_kr',
] as const
const domains = ['oz.com', 'ozdev.kr', 'ozschool.io', 'example.com'] as const
const genders: Array<ApplicantSummary['gender']> = ['남성', '여성', '기타']
const tagPool = [
  'React',
  'Vue.js',
  'Angular',
  'JavaScript',
  'Node.js',
  'TypeScript',
  'GCP',
  'Frontend',
  'Spring Boot',
  'Express',
  'Java',
  'Python',
  'Django',
  'FastAPI',
  'Flask',
  'PHP',
  'SQL',
  'Docker',
  'AWS',
  'Next.js',
  'NestJS',
  '알고리즘',
  '데이터',
  'Kubernetes',
  'Azure',
  'Backend',
  'Full Stack',
  'DevOps',
] as const
const lectureTitleLeft = ['입문', '중급', '심화', '프로', '가속'] as const
const lectureTitleRight = [
  '웹',
  '알고리즘',
  '데이터',
  '백엔드',
  '프론트엔드',
] as const

// ── 날짜/유틸 ────────────────────────────────────────────────────────────────
let uid = 0
function newId(): string {
  uid += 1
  return `APP${String(uid).padStart(4, '0')}`
}
function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}
function formatYmdHm(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = pad2(d.getMonth() + 1)
  const dd = pad2(d.getDate())
  const hh = pad2(d.getHours())
  const mi = pad2(d.getMinutes())
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`
}
function dateNDaysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(rndInt(8, 21), rndInt(0, 59), 0, 0)
  return d
}
function dateAfter(base: Date, minDays: number, maxDays: number): Date {
  const d = new Date(base)
  d.setDate(d.getDate() + rndInt(minDays, maxDays))
  d.setHours(rndInt(8, 21), rndInt(0, 59), 0, 0)
  return d
}

// ── 시드 생성기 ───────────────────────────────────────────────────────────────
function makeApplicant(): ApplicantSummary {
  const full = `${pick(lastNames)}${pick(firstLeft)}${pick(firstRight)}`
  const nick = `${full.slice(1).toLowerCase()}${pick(nickSuffix)}`
  const email = `${nick.replace(/[^a-z0-9_]/g, '')}${rndInt(100, 999)}@${pick(domains)}`
  return {
    nickname: nick,
    email,
    gender: pick(genders),
    avatarUrl: '', // 필요 시 정적 이미지 경로 매핑
  }
}

function makeLectures(): StudyLecture[] {
  const n = rndInt(2, 4)
  return Array.from({ length: n }, () => ({
    title: `${pick(lectureTitleLeft)} ${pick(lectureTitleRight)}`,
    teacher: `${pick(lastNames)}${pick(firstLeft)}${pick(firstRight)}`,
  }))
}

export function makeApplication(): StudyApplicationDetail {
  const id = newId()
  const status = pickByDist(STATUS_DIST)
  const ad: StudyAdSummary = {
    id: `AD_${rndInt(1000, 9999)}`,
    title: pick(adTitles),
  }
  const applicant = makeApplicant()

  const applied = dateNDaysAgo(rndInt(0, 30))
  const updated = dateAfter(applied, 0, 5)
  const deadline = dateAfter(applied, 1, 20)

  const tags = Array.from(
    new Set(Array.from({ length: rndInt(3, 6) }, () => pick(tagPool)))
  )

  return {
    id,
    ad,
    applicant,
    status,
    appliedAt: formatYmdHm(applied),
    updatedAt: formatYmdHm(updated),
    adDetail: {
      headcount: rndInt(3, 12),
      lectures: makeLectures(),
      tags: tags as string[],
      deadline: formatYmdHm(deadline),
    },
    intro: '안녕하세요. 웹 개발과 협업에 관심이 많습니다.',
    motivation: '체계적으로 공부하며 포트폴리오를 강화하고 싶습니다.',
    goal: '매주 실습 중심으로 과제를 진행하고 코드 리뷰를 받는 것이 목표입니다.',
    availableTime: pick([
      '평일 저녁 8-10시',
      '주말 오전 10-12시',
      '주말 오후 2-5시',
      '탄력 근무, 평일 야간 가능',
    ]),
    hasExperience: rnd() > 0.5,
    experienceDetail:
      '소규모 스터디에서 알고리즘 문제 풀이를 진행한 경험이 있습니다.',
  }
}

export function makeApplications(count = APP_COUNT): StudyApplicationDetail[] {
  return Array.from({ length: count }, () => makeApplication())
}

// ── 퍼시스트 ────────────────────────────────────────────────────────────────
function loadPersisted(): StudyApplicationDetail[] | null {
  if (!ENABLE_PERSIST) return null
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}
function persist(rows: StudyApplicationDetail[]) {
  if (!ENABLE_PERSIST) return
  try {
    localStorage.setItem(PERSIST_KEY, JSON.stringify(rows))
  } catch {
    // ignore quota
  }
}

// ── 정렬/검색/페이지 공용 유틸 ───────────────────────────────────────────────
export type SortKey = 'latest' | 'oldest'

export function searchHit(a: StudyApplicationDetail, q: string): boolean {
  const hay =
    `${a.ad.title} ${a.applicant.nickname} ${a.applicant.email}`.toLowerCase()
  return hay.includes(q.toLowerCase())
}

export function sortByAppliedAt(
  arr: StudyApplicationDetail[],
  order: SortKey = 'latest'
) {
  arr.sort((a, b) => {
    // 문자열 비교(YYYY-MM-DD HH:MM) — 사전순으로도 시간 순서 보장
    if (order === 'latest')
      return a.appliedAt > b.appliedAt ? -1 : a.appliedAt < b.appliedAt ? 1 : 0
    return a.appliedAt > b.appliedAt ? 1 : a.appliedAt < b.appliedAt ? -1 : 0
  })
}

export function toListItem(
  a: StudyApplicationDetail
): StudyApplicationListItem {
  const { id, ad, applicant, status, appliedAt, updatedAt } = a
  return { id, ad, applicant, status, appliedAt, updatedAt }
}

// ── 공개 DB API ─────────────────────────────────────────────────────────────
export const studyAppsDb = {
  rows: [] as StudyApplicationDetail[],
  init(force = false) {
    if (!force) {
      const saved = loadPersisted()
      if (saved) {
        this.rows = saved
        return
      }
    }
    this.rows = makeApplications()
    persist(this.rows)
  },
  reset(count = APP_COUNT) {
    this.rows = makeApplications(count)
    persist(this.rows)
  },
  getById(id: string) {
    return this.rows.find((r) => r.id === id) ?? null
  },
  // 목록 조회 헬퍼(필터/검색/정렬/페이징)
  query(params: {
    limit: number
    offset: number
    status?: ApplicationStatus | ''
    sort?: SortKey
    q?: string
  }) {
    let list = [...this.rows]
    if (params.status) {
      list = list.filter((r) => r.status === params.status)
    }
    if (params.q) {
      list = list.filter((r) => searchHit(r, params.q!))
    }
    sortByAppliedAt(list, params.sort ?? 'latest')
    const total = list.length
    const items = list
      .slice(params.offset, params.offset + params.limit)
      .map(toListItem)
    return {
      items,
      total,
      limit: params.limit,
      offset: params.offset,
      hasMore: params.offset + params.limit < total,
    }
  },
}
