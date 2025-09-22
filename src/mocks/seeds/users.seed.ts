// MSW Users 목업 데이터 — 결정적(재현 가능) 시드 + 퍼시스트(localStorage) 옵션
// - 기존 Users 전용 MSW 셋업과 호환됩니다.
// - faker 없이 간단한 RNG/프리셋으로 한국어 데이터 생성
// - 환경변수/상수로 레코드 수, 역할/상태 분포 조정 가능
// - 페이지 새로고침 유지: localStorage 퍼시스트(선택)
// -----------------------------------------------------------------------------

import type { UserDetail } from '@/components/ui/Modal/feature/User/User.types'

// ── 설정값 ───────────────────────────────────────────────────────────────────
const USER_COUNT = Number(import.meta.env.VITE_MSW_USERS ?? 128) // 생성할 사용자 수
const PERSIST_KEY = '__msw_users__' // localStorage 키(퍼시스트 켜면 사용)
const ENABLE_PERSIST = true // 새로고침해도 데이터 유지하고 싶으면 true

// 역할/상태 분포(%) — 합계가 100이 되도록 조정하세요
const ROLE_DIST: Record<string, number> = {
  일반회원: 82,
  스태프: 12,
  관리자: 6,
}
const STATUS_DIST: Record<'활성' | '비활성', number> = {
  활성: 88,
  비활성: 12,
}

// ── RNG(결정적) ──────────────────────────────────────────────────────────────
// 같은 seed로 항상 동일한 결과를 얻기 위한 간단한 LCG
function lcg(seed = 123456789) {
  let s = seed >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0
    return s / 0xffffffff
  }
}
const rnd = lcg(20250918) // 날짜 등으로 seed 고정

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rnd() * arr.length)]
}

// ── 프리셋 데이터 ────────────────────────────────────────────────────────────
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
const carriers = ['010', '011', '017'] as const
const domains = ['oz.com', 'ozdev.kr', 'ozschool.io', 'example.com'] as const
const genders: Array<UserDetail['gender']> = ['남성', '여성', '기타']

// 분포 기반 라벨 선택
function pickByDist<T extends string>(dist: Record<T, number>): T {
  const keys = Object.keys(dist) as T[] // T로 단언
  // 합계 계산은 키를 통해 안전하게 접근
  const total = keys.reduce((sum, k) => sum + (dist[k] ?? 0), 0)

  // 총합이 0이면 첫 키로 안전하게 폴백
  if (total <= 0) return keys[0]

  let r = rnd() * total
  for (const k of keys) {
    const v = dist[k] ?? 0
    if (r < v) return k
    r -= v
  }
  // 남는 경우가 없으면 첫 키 반환(부동소수 오차 대비)
  return keys[0]
}

// ── 아이디/날짜/유틸 ─────────────────────────────────────────────────────────
let uid = 1000
function newId(prefix: string): string {
  uid += 1
  return `${prefix}_${uid}`
}

function isoNDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

// ── 시드 생성기 ───────────────────────────────────────────────────────────────
export function makeUser(): UserDetail {
  const ln = pick(lastNames)
  const fn = pick(firstLeft) + pick(firstRight)
  const name = `${ln}${fn}`
  const nickname = `${fn.toLowerCase()}${pick(nickSuffix)}`
  const id = newId('u')

  const role = pickByDist(ROLE_DIST)
  const status = pickByDist(STATUS_DIST)
  const gender = pick(genders)
  const phone = `${pick(carriers)}-${pad2(Math.floor(rnd() * 90) + 10)}${pad2(
    Math.floor(rnd() * 90) + 10
  )}-${pad2(Math.floor(rnd() * 90) + 10)}${pad2(Math.floor(rnd() * 90) + 10)}`
  const birth = `199${Math.floor(rnd() * 10)}-${pad2(Math.floor(rnd() * 12) + 1)}-${pad2(
    Math.floor(rnd() * 28) + 1
  )}`

  const emailLocal = `${fn.toLowerCase()}${Math.floor(rnd() * 900 + 100)}`
  const email = `${emailLocal}@${pick(domains)}`

  const joinedAt = isoNDaysAgo(Math.floor(rnd() * 365))

  const user: UserDetail = {
    id,
    name,
    email,
    gender,
    nickname,
    birth,
    phone,
    role,
    status,
    joinedAt,
    avatarUrl: '',
  }
  return user
}

export function makeUsers(count = USER_COUNT): UserDetail[] {
  return Array.from({ length: count }, () => makeUser())
}

// ── 퍼시스트(선택) ───────────────────────────────────────────────────────────
function loadPersisted(): UserDetail[] | null {
  if (!ENABLE_PERSIST) return null
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as UserDetail[]
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export function persist(users: UserDetail[]) {
  if (!ENABLE_PERSIST) return
  try {
    localStorage.setItem(PERSIST_KEY, JSON.stringify(users))
  } catch {
    // ignore quota errors
  }
}

// ── 공개 API ─────────────────────────────────────────────────────────────────
export const usersDb = {
  users: [] as UserDetail[],
  init(force = false) {
    if (!force) {
      const existing = loadPersisted()
      if (existing) {
        this.users = existing
        return
      }
    }
    this.users = makeUsers()
    persist(this.users)
  },
  reset(count = USER_COUNT) {
    this.users = makeUsers(count)
    persist(this.users)
  },
  add(user: UserDetail) {
    this.users.unshift(user)
    persist(this.users)
  },
  patch(id: string, patch: Partial<UserDetail>) {
    const idx = this.users.findIndex((u) => u.id === id)
    if (idx >= 0) {
      this.users[idx] = { ...this.users[idx], ...patch }
      persist(this.users)
      return this.users[idx]
    }
    return null
  },
  remove(id: string) {
    const idx = this.users.findIndex((u) => u.id === id)
    if (idx >= 0) {
      this.users.splice(idx, 1)
      persist(this.users)
      return true
    }
    return false
  },
}

// ── MSW 핸들러에서 사용 예시 ────────────────────────────────────────────────
// import { usersDb } from '@/mocks/seeds/users.seed'
// usersDb.init()
// http.get(`${ADMIN}/users`, ... => {
//   let rows = [...usersDb.users]
//   // 필터/정렬/페이지네이션 적용
// })

// ── 핸들러 연동(예시) ────────────────────────────────────────────────────────
// mswHttp.get(`${ADMIN}/users`, async ({ request }) => {
//   if (request.headers.get('x-bypass-mock')) return passthrough()
//   usersDb.init()
//   const url = new URL(request.url)
//   const page = toInt(url.searchParams.get('page'), 1)
//   const pageSize = toInt(url.searchParams.get('pageSize'), 20)
//   const sortBy = url.searchParams.get('sortBy') ?? 'joinedAt'
//   const sortOrder = (url.searchParams.get('sortOrder') ?? 'desc') as 'asc' | 'desc'
//   const q = url.searchParams.get('q') ?? ''
//   const role = url.searchParams.get('role')
//   const status = url.searchParams.get('status') as '활성' | '비활성' | null
//   let rows = [...usersDb.users]
//   if (q) rows = rows.filter(r => `${r.name} ${r.email} ${r.nickname ?? ''}`.toLowerCase().includes(q.toLowerCase()))
//   if (role) rows = rows.filter(r => (r.role ?? '') === role)
//   if (status) rows = rows.filter(r => (r.status ?? '') === status)
//   rows = sortByKey(rows as Record<string, unknown>[], sortBy, sortOrder) as UserDetail[]
//   const pageData = paginate<UserDetail>(rows, page, pageSize)
//   return HttpResponse.json({ ...pageData, sortBy, sortOrder })
// })
