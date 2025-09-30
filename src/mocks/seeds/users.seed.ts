// MSW Users 시드 데이터 - 최신 스웨거 스키마 반영
import type { UserDetail } from '@/types/User.types'

// ── 설정값 ───────────────────────────────────────────────────────────────────
const USER_COUNT = Number(import.meta.env.VITE_MSW_USERS ?? 128)
const PERSIST_KEY = '__msw_users__'
const ENABLE_PERSIST = true

// 서버 enum 값으로 변경
const PERMISSION_DIST: Record<'GENERAL' | 'STAFF' | 'ADMIN', number> = {
  GENERAL: 82,
  STAFF: 12,
  ADMIN: 6,
}

const STATUS_DIST: Record<'ACTIVE' | 'INACTIVE' | 'WITHDRAWN', number> = {
  ACTIVE: 62,
  INACTIVE: 12,
  WITHDRAWN: 26,
}

// ── RNG(결정적) ──────────────────────────────────────────────────────────────
function lcg(seed = 123456789) {
  let s = seed >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0
    return s / 0xffffffff
  }
}
const rnd = lcg(20250918)

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
const genders = ['남성', '여성', '기타'] as const

// 분포 기반 라벨 선택
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

// ── 아이디/날짜/유틸 ─────────────────────────────────────────────────────────
let uid = 1000
function newId(): string {
  uid += 1
  // UUID 형식으로 변경
  const hex = uid.toString(16).padStart(8, '0')
  return `${hex.slice(0, 8)}-${hex.slice(0, 4)}-4${hex.slice(1, 4)}-a${hex.slice(1, 4)}-${hex.slice(0, 12)}`
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
  const uuid = newId()

  const permission = pickByDist(PERMISSION_DIST)
  const status = pickByDist(STATUS_DIST)
  const gender = pick(genders)

  const phone = `${pick(carriers)}-${pad2(Math.floor(rnd() * 90) + 10)}${pad2(
    Math.floor(rnd() * 90) + 10
  )}-${pad2(Math.floor(rnd() * 90) + 10)}${pad2(Math.floor(rnd() * 90) + 10)}`

  // YYYY-MM-DD 형식
  const year = 1980 + Math.floor(rnd() * 25) // 1980-2004
  const month = Math.floor(rnd() * 12) + 1
  const day = Math.floor(rnd() * 28) + 1
  const birthday = `${year}-${pad2(month)}-${pad2(day)}`

  const emailLocal = `${fn.toLowerCase()}${Math.floor(rnd() * 900 + 100)}`
  const email = `${emailLocal}@${pick(domains)}`

  const createdAt = isoNDaysAgo(Math.floor(rnd() * 365))

  // 탈퇴 요청일 (WITHDRAWN 상태일 때만)
  const withdrawalsRequestDate =
    status === 'WITHDRAWN' ? isoNDaysAgo(Math.floor(rnd() * 30)) : null

  const user: UserDetail = {
    uuid,
    email,
    nickname,
    name,
    birthday,
    permission,
    permissionDisplay:
      permission === 'ADMIN'
        ? '관리자'
        : permission === 'STAFF'
          ? '스태프'
          : '일반회원',
    status,
    createdAt,
    withdrawalsRequestDate,
    gender,
    phoneNumber: phone,
    profileImgUrl: null,
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

  patch(uuid: string, patch: Partial<UserDetail>) {
    const idx = this.users.findIndex((u) => u.uuid === uuid)
    if (idx >= 0) {
      this.users[idx] = { ...this.users[idx], ...patch }
      persist(this.users)
      return this.users[idx]
    }
    return null
  },

  remove(uuid: string) {
    const idx = this.users.findIndex((u) => u.uuid === uuid)
    if (idx >= 0) {
      this.users.splice(idx, 1)
      persist(this.users)
      return true
    }
    return false
  },
}
