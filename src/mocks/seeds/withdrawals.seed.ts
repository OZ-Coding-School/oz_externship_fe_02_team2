// ────────────────────────────────────────────────────────────────────────────
// MSW Withdrawals 시드 데이터 - 최신 API 스키마 반영
// OpenAPI Schema: /api/v1/admin/withdrawals
// ────────────────────────────────────────────────────────────────────────────

import type {
  ServerWithdrawalDetail,
  PermissionType,
  WithdrawalReasonType,
} from '@/types/Withdrawal.types'

// ────────────────────────────────────────────────────────────────────────────
// 설정
// ────────────────────────────────────────────────────────────────────────────
const WITHDRAWAL_COUNT = Number(import.meta.env.VITE_MSW_WITHDRAWALS ?? 68)
const PERSIST_KEY = '__msw_withdrawals__'
const ENABLE_PERSIST = true

// ────────────────────────────────────────────────────────────────────────────
// 분포 설정 (%)
// ────────────────────────────────────────────────────────────────────────────

// 권한 분포
const PERMISSION_DIST: Record<PermissionType, number> = {
  GENERAL: 85,
  STAFF: 10,
  ADMIN: 5,
}

// 탈퇴 사유 분포 - OpenAPI ReasonEnum 기준
const REASON_DIST: Record<WithdrawalReasonType, number> = {
  NO_LONGER_NEEDED: 20,
  LACK_OF_INTEREST: 15,
  TOO_DIFFICULT: 10,
  FOUND_BETTER_SERVICE: 15,
  PRIVACY_CONCERNS: 15,
  POOR_SERVICE_QUALITY: 10,
  TECHNICAL_ISSUES: 5,
  LACK_OF_CONTENT: 5,
  OTHER: 5,
}

// 성별 분포
const GENDER_DIST: Record<string, number> = {
  MALE: 48,
  FEMALE: 50,
  OTHER: 2,
}

// ────────────────────────────────────────────────────────────────────────────
// 탈퇴 사유별 상세 설명
// ────────────────────────────────────────────────────────────────────────────
const REASON_DETAILS: Record<WithdrawalReasonType, string[]> = {
  NO_LONGER_NEEDED: [
    '서비스를 더 이상 이용할 시간이 없습니다',
    '필요성을 느끼지 못하게 되었습니다',
    '목표를 달성해서 더 이상 필요하지 않습니다',
    '환경이 변화하여 서비스가 불필요해졌습니다',
  ],
  LACK_OF_INTEREST: [
    '관심사가 변경되었습니다',
    '서비스 콘텐츠가 흥미롭지 않습니다',
    '더 이상 학습 의욕이 없습니다',
    '다른 분야에 집중하고 싶습니다',
  ],
  TOO_DIFFICULT: [
    '학습 난이도가 너무 높습니다',
    '인터페이스가 복잡해서 사용하기 어렵습니다',
    '시작하기가 너무 어렵습니다',
    '기술적 장벽이 높습니다',
  ],
  FOUND_BETTER_SERVICE: [
    '더 나은 대안 서비스를 발견했습니다',
    '기능이 더 좋은 다른 플랫폼을 찾았습니다',
    '가격 대비 효율이 더 좋은 곳이 있습니다',
    '경쟁 서비스가 더 편리합니다',
  ],
  PRIVACY_CONCERNS: [
    '개인정보 보호에 대한 우려가 있습니다',
    '데이터 수집 범위가 너무 넓습니다',
    '개인정보 처리 방침이 마음에 들지 않습니다',
    '보안에 대한 신뢰가 부족합니다',
  ],
  POOR_SERVICE_QUALITY: [
    '서비스 품질이 기대에 미치지 못합니다',
    '고객 지원이 불만족스럽습니다',
    '버그가 자주 발생합니다',
    '업데이트가 느리고 개선이 부족합니다',
  ],
  TECHNICAL_ISSUES: [
    '기술적 오류가 자주 발생합니다',
    '서비스가 불안정합니다',
    '앱이 자주 다운됩니다',
    '로딩 속도가 너무 느립니다',
  ],
  LACK_OF_CONTENT: [
    '원하는 콘텐츠가 부족합니다',
    '강의 종류가 다양하지 않습니다',
    '최신 콘텐츠 업데이트가 없습니다',
    '심화 학습 자료가 부족합니다',
  ],
  OTHER: [
    '개인적인 사정으로 인해 탈퇴합니다',
    '기타 개인적인 이유입니다',
    '특별한 이유 없이 탈퇴합니다',
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// 랜덤 생성 유틸리티
// ────────────────────────────────────────────────────────────────────────────
function lcg(seed = 987654321) {
  let s = seed >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

const rnd = lcg(20250929) // 시드 고정

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

// ────────────────────────────────────────────────────────────────────────────
// 이름 생성 데이터
// ────────────────────────────────────────────────────────────────────────────
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
  '진',
  '아',
  '은',
] as const

const nickSuffix = [
  '_dev',
  '_pro',
  '_user',
  '123',
  '456',
  '789',
  '2024',
  '2025',
  'kr',
  'oz',
] as const

const domains = [
  'gmail.com',
  'naver.com',
  'daum.net',
  'kakao.com',
  'hanmail.net',
  'oz.com',
] as const

// ────────────────────────────────────────────────────────────────────────────
// 유틸리티 함수
// ────────────────────────────────────────────────────────────────────────────
let wid = 5000

function newId(): number {
  wid += 1
  return wid
}

function randomDateBetween(startDays: number, endDays: number): string {
  const start = Date.now() - startDays * 24 * 60 * 60 * 1000
  const end = Date.now() - endDays * 24 * 60 * 60 * 1000
  const randomTime = start + rnd() * (end - start)
  return new Date(randomTime).toISOString()
}

function futureDateDays(days: number): string {
  const future = Date.now() + days * 24 * 60 * 60 * 1000
  return new Date(future).toISOString().split('T')[0] // YYYY-MM-DD
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

// ────────────────────────────────────────────────────────────────────────────
// 탈퇴 데이터 생성
// ────────────────────────────────────────────────────────────────────────────
export function makeWithdrawal(): ServerWithdrawalDetail {
  const id = newId()

  // 이름 생성
  const ln = pick(lastNames)
  const fn = pick(firstLeft) + pick(firstRight)
  const name = `${ln}${fn}`
  const nickname = `${fn.toLowerCase()}${pick(nickSuffix)}`

  // 권한 및 성별
  const permission = pickByDist(PERMISSION_DIST)
  const gender = pickByDist(GENDER_DIST)

  // 생년월일
  const birthYear = 1980 + Math.floor(rnd() * 26)
  const birthMonth = Math.floor(rnd() * 12) + 1
  const birthDay = Math.floor(rnd() * 28) + 1
  const birthday = `${birthYear}-${pad2(birthMonth)}-${pad2(birthDay)}`

  // 이메일
  const emailPrefix = `${fn.toLowerCase()}${Math.floor(rnd() * 1000)}`
  const email = `${emailPrefix}@${pick(domains)}`

  // 프로필 이미지 (30% 확률로 null)
  const profile_img_url =
    rnd() > 0.3 ? `https://i.pravatar.cc/150?u=${id}` : null

  // 상태 - 스키마에서는 string만 정의되어 있으므로 'WITHDRAWAL_REQUESTED' 사용
  const status = 'withdrawn'

  // 탈퇴 사유
  const reason = pickByDist(REASON_DIST)
  const reasonDetails = REASON_DETAILS[reason] || []
  const reason_detail = rnd() > 0.15 ? pick(reasonDetails) : null

  // 날짜 생성
  const user_joined_at = randomDateBetween(365 + Math.floor(rnd() * 365), 180)
  const created_at = randomDateBetween(180, 0)
  const due_date = futureDateDays(7 + Math.floor(rnd() * 30))

  return {
    id,
    name,
    gender,
    nickname,
    email,
    permission,
    birthday,
    status,
    user_joined_at,
    profile_img_url,
    created_at,
    reason,
    reason_detail,
    due_date,
  }
}

export function makeWithdrawals(
  count = WITHDRAWAL_COUNT
): ServerWithdrawalDetail[] {
  return Array.from({ length: count }, () => makeWithdrawal())
}

// ────────────────────────────────────────────────────────────────────────────
// 로컬스토리지 퍼시스트
// ────────────────────────────────────────────────────────────────────────────
function loadPersisted(): ServerWithdrawalDetail[] | null {
  if (!ENABLE_PERSIST) return null
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ServerWithdrawalDetail[]
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export function persist(withdrawals: ServerWithdrawalDetail[]) {
  if (!ENABLE_PERSIST) return
  try {
    localStorage.setItem(PERSIST_KEY, JSON.stringify(withdrawals))
  } catch {
    // ignore quota errors
  }
}

// ────────────────────────────────────────────────────────────────────────────
// DB 인터페이스
// ────────────────────────────────────────────────────────────────────────────
export const withdrawalsDb = {
  withdrawals: [] as ServerWithdrawalDetail[],

  init(force = false) {
    if (!force) {
      const existing = loadPersisted()
      if (existing) {
        this.withdrawals = existing
        console.log(
          `[MSW] Withdrawals DB loaded from localStorage: ${existing.length} items`
        )
        return
      }
    }
    this.withdrawals = makeWithdrawals()
    persist(this.withdrawals)
    console.log(
      `[MSW] Withdrawals DB initialized: ${this.withdrawals.length} items`
    )
  },

  reset(count = WITHDRAWAL_COUNT) {
    this.withdrawals = makeWithdrawals(count)
    persist(this.withdrawals)
    console.log(`[MSW] Withdrawals DB reset: ${count} items`)
  },

  add(withdrawal: ServerWithdrawalDetail) {
    this.withdrawals.unshift(withdrawal)
    persist(this.withdrawals)
  },

  patch(id: number, patch: Partial<ServerWithdrawalDetail>) {
    const idx = this.withdrawals.findIndex((w) => w.id === id)
    if (idx >= 0) {
      this.withdrawals[idx] = { ...this.withdrawals[idx], ...patch }
      persist(this.withdrawals)
      return this.withdrawals[idx]
    }
    return null
  },

  remove(id: number) {
    const idx = this.withdrawals.findIndex((w) => w.id === id)
    if (idx >= 0) {
      this.withdrawals.splice(idx, 1)
      persist(this.withdrawals)
      return true
    }
    return false
  },

  find(id: number): ServerWithdrawalDetail | undefined {
    return this.withdrawals.find((w) => w.id === id)
  },

  findByPermission(permission: PermissionType): ServerWithdrawalDetail[] {
    return this.withdrawals.filter((w) => w.permission === permission)
  },

  findByReason(reason: WithdrawalReasonType): ServerWithdrawalDetail[] {
    return this.withdrawals.filter((w) => w.reason === reason)
  },

  status() {
    const total = this.withdrawals.length
    return {
      total,
      byPermission: {
        ADMIN: this.withdrawals.filter((w) => w.permission === 'ADMIN').length,
        STAFF: this.withdrawals.filter((w) => w.permission === 'STAFF').length,
        GENERAL: this.withdrawals.filter((w) => w.permission === 'GENERAL')
          .length,
      },
      byReason: Object.keys(REASON_DIST).reduce(
        (acc, reason) => {
          acc[reason] = this.withdrawals.filter(
            (w) => w.reason === reason
          ).length
          return acc
        },
        {} as Record<string, number>
      ),
    }
  },
}
