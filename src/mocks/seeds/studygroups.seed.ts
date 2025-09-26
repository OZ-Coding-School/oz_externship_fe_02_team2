// MSW StudyGroups 목업 데이터 시드 — 결정적(재현 가능) + 퍼시스트 옵션
// - 스터디 그룹 데이터를 실제 서비스처럼 생성
// - 다양한 상태와 멤버 분포
// - localStorage 퍼시스트로 새로고침 유지
// -----------------------------------------------------------------------------

import type {
  StudyGroupDetail,
  Member,
  Course,
} from '@components/ui/Modal/feature/Study/Study.types.ts'

// ── 설정값 ───────────────────────────────────────────────────────────────────
const STUDY_GROUPS_COUNT = Number(import.meta.env.VITE_MSW_STUDY_GROUPS ?? 50)
const PERSIST_KEY = '__msw_study_groups__'
const ENABLE_PERSIST = true

// 상태 분포(%)
const STATUS_DIST: Record<string, number> = {
  대기중: 25,
  진행중: 45,
  종료됨: 30,
}

// 스터디 카테고리 분포(%)
const CATEGORY_DIST: Record<string, number> = {
  프론트엔드: 30,
  백엔드: 25,
  풀스택: 20,
  데이터분석: 10,
  DevOps: 8,
  기타: 7,
}

// ── RNG(결정적) ──────────────────────────────────────────────────────────────
function lcg(seed = 987654321) {
  let s = seed >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0
    return s / 0xffffffff
  }
}
const rnd = lcg(20241001) // 시드 고정

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rnd() * arr.length)]
}

function pickByDist<T extends string>(dist: Record<T, number>): T {
  const keys = Object.keys(dist) as T[]
  const total = keys.reduce((sum, k) => sum + (dist[k] ?? 0), 0)

  if (total <= 0) return keys[0]

  let r = rnd() * total
  for (const k of keys) {
    const v = dist[k] ?? 0
    if (r < v) return k
    r -= v
  }
  return keys[0]
}

// ── 프리셋 데이터 ────────────────────────────────────────────────────────────
const studyTitles = [
  '프론트엔드 마스터 클래스',
  'JavaScript 심화 스터디',
  'React 프로젝트 스터디',
  '알고리즘 정복하기',
  '백엔드 개발 입문',
  'TypeScript로 견고한 앱 만들기',
  '데이터베이스 설계 스터디',
  'AWS 자격증 준비반',
  '개발자 취업 준비 스터디',
  'Python 데이터 사이언스',
  '모바일 앱 개발 스터디',
  'DevOps 엔지니어링',
  '웹 성능 최적화 스터디',
  '클린 코드 작성법',
  '오픈소스 기여하기',
  'Vue.js 완벽 가이드',
  'Spring Boot 실전 프로젝트',
  '머신러닝 입문',
  'Docker & Kubernetes',
  'GraphQL API 개발',
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
  '한',
  '오',
  '서',
  '신',
  '권',
  '황',
  '안',
  '송',
  '류',
  '전',
  '홍',
  '고',
  '문',
  '양',
  '손',
  '배',
  '백',
  '허',
  '남',
  '심',
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
  '은',
  '태',
  '현',
  '주',
  '성',
  '영',
  '소',
  '정',
  '미',
  '경',
  '우',
  '진',
  '희',
  '나',
  '다',
  '혜',
  '원',
  '빈',
  '찬',
  '아',
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
  '정',
  '혜',
  '영',
  '준',
  '희',
  '나',
  '리',
  '은',
  '서',
  '연',
  '석',
  '식',
  '수',
  '완',
  '용',
  '인',
  '일',
  '자',
  '재',
  '제',
] as const

const courseTemplates = [
  {
    title: 'JavaScript 기초부터 심화까지',
    teacher: '김개발',
    category: '프론트엔드',
  },
  {
    title: 'React로 만드는 현대적 웹앱',
    teacher: '이프론트',
    category: '프론트엔드',
  },
  {
    title: 'TypeScript 완전정복',
    teacher: '박타입',
    category: '프론트엔드',
  },
  {
    title: 'Node.js 백엔드 개발',
    teacher: '최백엔드',
    category: '백엔드',
  },
  {
    title: 'Python 데이터 분석',
    teacher: '정데이터',
    category: '데이터분석',
  },
  {
    title: '알고리즘과 자료구조',
    teacher: '윤알고리즘',
    category: '기타',
  },
  {
    title: 'AWS 클라우드 아키텍처',
    teacher: '장클라우드',
    category: 'DevOps',
  },
  {
    title: 'Docker & Kubernetes',
    teacher: '홍컨테이너',
    category: 'DevOps',
  },
  {
    title: 'Spring Boot 실전',
    teacher: '서스프링',
    category: '백엔드',
  },
  {
    title: 'Vue.js 완벽 가이드',
    teacher: '안뷰',
    category: '프론트엔드',
  },
] as const

// ── 유틸 함수 ─────────────────────────────────────────────────────────────────
let studyId = 1000
function newId(): number {
  studyId += 1
  return studyId
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.floor(rnd() * 16)
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function randomDateBetween(startDays: number, endDays: number): Date {
  const start = Date.now() - startDays * 24 * 60 * 60 * 1000
  const end = Date.now() - endDays * 24 * 60 * 60 * 1000
  const randomTime = start + rnd() * (end - start)
  return new Date(randomTime)
}

function futureDateDays(days: number): Date {
  const future = Date.now() + days * 24 * 60 * 60 * 1000
  return new Date(future)
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0] // YYYY-MM-DD
}

function formatDateTime(date: Date): string {
  return date.toISOString().slice(0, 16).replace('T', ' ') // YYYY-MM-DD HH:MM
}

// ── 시드 생성기 ───────────────────────────────────────────────────────────────
function generateRandomName(): string {
  const ln = pick(lastNames)
  const fn = pick(firstLeft) + pick(firstRight)
  return `${ln}${fn}`
}

function generateMembers(count: number): Member[] {
  return Array.from({ length: count }, (_, index) => ({
    id: String(1000 + index + studyId * 100), // 고유 ID 보장
    name: generateRandomName(),
    isLeader: index === 0, // 첫 번째 멤버를 리더로 설정
  }))
}

function generateCourses(count: number, category?: string): Course[] {
  // 카테고리가 주어진 경우 해당 카테고리 강의를 우선적으로 선택
  let availableCourses = [...courseTemplates]
  if (category && category !== '기타') {
    const categoryCourses = courseTemplates.filter(
      (c) => c.category === category
    )
    const otherCourses = courseTemplates.filter((c) => c.category !== category)
    // 카테고리 강의 70%, 다른 강의 30% 비율로 섞기
    availableCourses = [
      ...categoryCourses,
      ...categoryCourses, // 카테고리 강의 비중 높이기
      ...otherCourses,
    ]
  }

  const shuffled = availableCourses.sort(() => rnd() - 0.5)
  const selected = shuffled.slice(0, count)

  return selected.map((template, index) => ({
    id: `course-${studyId}-${index}`,
    title: template.title,
    teacher: template.teacher,
    thumbnailUrl: `https://picsum.photos/300/200?random=${studyId * 10 + index}`,
    externalUrl: `https://example.com/course/${template.title.toLowerCase().replace(/\s+/g, '-')}`,
  }))
}

export function makeStudyGroup(): StudyGroupDetail {
  const id = newId()
  const uuid = generateUUID()

  // 기본 정보 생성
  const capacity = 5 + Math.floor(rnd() * 16) // 5-20명
  const enrolled = 1 + Math.floor(rnd() * capacity) // 1명 이상
  const category = pickByDist(CATEGORY_DIST)
  const baseTitle = pick(studyTitles)
  const title = `${baseTitle} ${Math.floor(rnd() * 10) + 1}기`

  // 날짜 생성
  const createdAt = randomDateBetween(180, 0) // 6개월 이내 생성
  const updatedAt = randomDateBetween(
    Math.floor((Date.now() - createdAt.getTime()) / (24 * 60 * 60 * 1000)),
    0
  ) // createdAt 이후 업데이트

  // 스터디 기간 설정
  const startOffset = Math.floor(rnd() * 120) - 60 // -60일 ~ +60일
  const startDate = futureDateDays(startOffset)
  const duration = 30 + Math.floor(rnd() * 150) // 30~180일
  const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000)

  // 상태 결정 (분포 기반)
  const status = pickByDist(STATUS_DIST)

  // 멤버와 강의 생성
  const members = generateMembers(enrolled)
  const courseCount = 1 + Math.floor(rnd() * 4) // 1-4개 강의
  const courses = generateCourses(courseCount, category)

  return {
    id,
    uuid,
    title,
    coverImageUrl: `https://picsum.photos/400/300?random=${id}`,
    enrolled,
    capacity,
    period: {
      start: formatDate(startDate),
      end: formatDate(endDate),
    },
    status,
    createdAt: formatDateTime(updatedAt),
    updatedAt: formatDateTime(updatedAt),
    members,
    courses,
  }
}

export function makeStudyGroups(
  count = STUDY_GROUPS_COUNT
): StudyGroupDetail[] {
  return Array.from({ length: count }, () => makeStudyGroup())
}

// ── 퍼시스트 ─────────────────────────────────────────────────────────────────
function loadPersisted(): StudyGroupDetail[] | null {
  if (!ENABLE_PERSIST) return null
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StudyGroupDetail[]
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export function persist(studyGroups: StudyGroupDetail[]) {
  if (!ENABLE_PERSIST) return
  try {
    localStorage.setItem(PERSIST_KEY, JSON.stringify(studyGroups))
  } catch {
    // ignore quota errors
  }
}

// ── 공개 API ─────────────────────────────────────────────────────────────────
export const studyGroupsDb = {
  studyGroups: [] as StudyGroupDetail[],

  init(force = false) {
    if (!force) {
      const existing = loadPersisted()
      if (existing) {
        this.studyGroups = existing
        return
      }
    }
    this.studyGroups = makeStudyGroups()
    persist(this.studyGroups)
  },

  reset(count = STUDY_GROUPS_COUNT) {
    this.studyGroups = makeStudyGroups(count)
    persist(this.studyGroups)
  },

  add(studyGroup: StudyGroupDetail) {
    this.studyGroups.unshift(studyGroup)
    persist(this.studyGroups)
  },

  patch(id: number, patch: Partial<StudyGroupDetail>) {
    const idx = this.studyGroups.findIndex((sg) => sg.id === id)
    if (idx >= 0) {
      this.studyGroups[idx] = { ...this.studyGroups[idx], ...patch }
      persist(this.studyGroups)
      return this.studyGroups[idx]
    }
    return null
  },

  remove(id: number) {
    const idx = this.studyGroups.findIndex((sg) => sg.id === id)
    if (idx >= 0) {
      this.studyGroups.splice(idx, 1)
      persist(this.studyGroups)
      return true
    }
    return false
  },

  find(id: number): StudyGroupDetail | undefined {
    return this.studyGroups.find((sg) => sg.id === id)
  },

  findByUuid(uuid: string): StudyGroupDetail | undefined {
    return this.studyGroups.find((sg) => sg.uuid === uuid)
  },

  findByStatus(status: string): StudyGroupDetail[] {
    return this.studyGroups.filter((sg) => sg.status === status)
  },

  status() {
    const total = this.studyGroups.length
    return {
      total,
      byStatus: {
        대기중: this.studyGroups.filter((sg) => sg.status === '대기중').length,
        진행중: this.studyGroups.filter((sg) => sg.status === '진행중').length,
        종료됨: this.studyGroups.filter((sg) => sg.status === '종료됨').length,
      },
      totalMembers: this.studyGroups.reduce((sum, sg) => sum + sg.enrolled, 0),
      averageGroupSize: Math.round(
        this.studyGroups.reduce((sum, sg) => sum + sg.enrolled, 0) / total
      ),
      totalCourses: this.studyGroups.reduce(
        (sum, sg) => sum + sg.courses.length,
        0
      ),
    }
  },
}
