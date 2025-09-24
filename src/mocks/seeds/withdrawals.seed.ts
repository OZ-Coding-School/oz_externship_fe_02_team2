// MSW Withdrawals 목업 데이터 시드 — 결정적(재현 가능) + 퍼시스트 옵션
// - 탈퇴 요청 데이터를 실제 서비스처럼 생성
// - 다양한 탈퇴 사유와 상태 분포
// - localStorage 퍼시스트로 새로고침 유지
// -----------------------------------------------------------------------------

import type { WithdrawalDetail } from '@/api/modules/withdrawals'

// ── 설정값 ───────────────────────────────────────────────────────────────────
const WITHDRAWAL_COUNT = Number(import.meta.env.VITE_MSW_WITHDRAWALS ?? 68)
const PERSIST_KEY = '__msw_withdrawals__'
const ENABLE_PERSIST = true

// 권한 분포(%)
const PERMISSION_DIST: Record<string, number> = {
  general: 85, // 일반회원이 대부분
  staff: 10, // 스태프
  admin: 5, // 관리자
}

// 상태 분포(%)
const STATUS_DIST: Record<string, number> = {
  PENDING: 45, // 대기중
  APPROVED: 25, // 승인됨
  REJECTED: 15, // 거절됨
  COMPLETED: 15, // 완료됨
}

// 탈퇴 사유 분포(%) - 5가지로 수정
const REASON_DIST: Record<string, number> = {
  SERVICE_DISSATISFACTION: 30, // 서비스 불만족
  PRIVACY_CONCERN: 25, // 개인정보 우려
  LOW_USAGE: 20, // 사용 빈도 낮음
  COMPETITOR_SERVICE: 15, // 경쟁 서비스 이용
  OTHER: 10, // 기타
}

// 성별 분포
const GENDER_DIST: Record<string, number> = {
  남성: 48,
  여성: 50,
  기타: 2,
}

// ── RNG(결정적) ──────────────────────────────────────────────────────────────
function lcg(seed = 987654321) {
  let s = seed >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0
    return s / 0xffffffff
  }
}
const rnd = lcg(20250923) // 시드 고정

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
  '_user',
  '_member',
  '_dev',
  '_pro',
  '_01',
  '_02',
  '_03',
  '_k',
  '123',
  '456',
  '789',
  '2024',
  '2025',
  'kr',
  'oz',
  'cool',
] as const

const domains = [
  'gmail.com',
  'naver.com',
  'daum.net',
  'kakao.com',
  'hanmail.net',
  'hotmail.com',
  'yahoo.com',
  'oz.com',
] as const

// 탈퇴 사유별 상세 내용 템플릿 - 수정된 사유에 맞게
const REASON_DETAILS: Record<string, string[]> = {
  SERVICE_DISSATISFACTION: [
    '서비스 품질이 기대에 미치지 못합니다',
    '고객 응대가 불만족스럽습니다',
    '서비스 속도나 안정성에 문제가 있습니다',
    '기능이 부족하거나 사용하기 어렵습니다',
    '업데이트가 느리고 개선사항이 반영되지 않습니다',
  ],
  PRIVACY_CONCERN: [
    '개인정보 보호가 우려됩니다',
    '데이터 수집 범위가 너무 넓은 것 같습니다',
    '보안 정책이 마음에 들지 않습니다',
    '개인정보 처리 방침에 동의하기 어렵습니다',
    '정보 보안에 대한 신뢰가 부족합니다',
  ],
  LOW_USAGE: [
    '서비스를 자주 사용하지 않게 되었습니다',
    '필요성을 느끼지 못하게 되었습니다',
    '시간이 부족해서 이용하기 어렵습니다',
    '관심이 줄어들어 사용 빈도가 낮아졌습니다',
    '더 이상 해당 서비스가 필요하지 않습니다',
  ],
  COMPETITOR_SERVICE: [
    '더 나은 대안 서비스를 발견했습니다',
    '기능이 더 좋은 다른 서비스를 찾았습니다',
    '가격 대비 더 효율적인 서비스가 있어서요',
    '주변에서 추천해준 더 좋은 서비스가 있습니다',
    '경쟁사 서비스가 더 편리하고 유용합니다',
  ],
  OTHER: [
    '개인적인 사정으로 인해 탈퇴합니다',
    '기타 개인적인 이유입니다',
    '환경 변화로 인해 서비스가 불필요해졌습니다',
    '다른 우선순위가 생겨서 이용을 중단합니다',
  ],
}

// ── 유틸 함수 ─────────────────────────────────────────────────────────────────
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

// ── 시드 생성기 ───────────────────────────────────────────────────────────────
export function makeWithdrawal(): WithdrawalDetail {
  const id = newId()

  const ln = pick(lastNames)
  const fn = pick(firstLeft) + pick(firstRight)
  const name = `${ln}${fn}`
  const nickname = `${fn.toLowerCase()}${pick(nickSuffix)}`

  const permission = pickByDist(PERMISSION_DIST)

  // 생년월일 생성 (1980~2005년 사이)
  const birthYear = 1980 + Math.floor(rnd() * 26) // 1980-2005
  const birthMonth = Math.floor(rnd() * 12) + 1
  const birthDay = Math.floor(rnd() * 28) + 1 // 28일까지로 안전하게
  const birthday = `${birthYear}-${pad2(birthMonth)}-${pad2(birthDay)}`

  const status = pickByDist(STATUS_DIST)
  const gender = pickByDist(GENDER_DIST)
  const reason = pickByDist(REASON_DIST)

  // 이메일 생성
  const emailPrefix = `${fn.toLowerCase()}${Math.floor(rnd() * 1000)}`
  const email = `${emailPrefix}@${pick(domains)}`

  // 프로필 이미지 (30% 확률로 null)
  const profile_img_url =
    rnd() > 0.3 ? `https://picsum.photos/seed/w${id}/100/100` : null

  // 날짜 생성 (탈퇴 요청은 최근 6개월 이내)
  const user_joined_at = randomDateBetween(365 + Math.floor(rnd() * 365), 180) // 6개월~2년 전 가입
  const created_at = randomDateBetween(180, 0) // 6개월 이내 탈퇴 요청
  const due_date = futureDateDays(7 + Math.floor(rnd() * 30)) // 1주일~1개월 후

  // 탈퇴 사유 상세 내용 (85% 확률로 있음)
  const reasonDetails = REASON_DETAILS[reason] || []
  const reason_detail = rnd() > 0.15 ? pick(reasonDetails) : null

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

export function makeWithdrawals(count = WITHDRAWAL_COUNT): WithdrawalDetail[] {
  return Array.from({ length: count }, () => makeWithdrawal())
}

// ── 퍼시스트 ─────────────────────────────────────────────────────────────────
function loadPersisted(): WithdrawalDetail[] | null {
  if (!ENABLE_PERSIST) return null
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as WithdrawalDetail[]
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export function persist(withdrawals: WithdrawalDetail[]) {
  if (!ENABLE_PERSIST) return
  try {
    localStorage.setItem(PERSIST_KEY, JSON.stringify(withdrawals))
  } catch {
    // ignore quota errors
  }
}

// ── 공개 API ─────────────────────────────────────────────────────────────────
export const withdrawalsDb = {
  withdrawals: [] as WithdrawalDetail[],

  init(force = false) {
    if (!force) {
      const existing = loadPersisted()
      if (existing) {
        this.withdrawals = existing
        return
      }
    }
    this.withdrawals = makeWithdrawals()
    persist(this.withdrawals)
  },

  reset(count = WITHDRAWAL_COUNT) {
    this.withdrawals = makeWithdrawals(count)
    persist(this.withdrawals)
  },

  add(withdrawal: WithdrawalDetail) {
    this.withdrawals.unshift(withdrawal)
    persist(this.withdrawals)
  },

  patch(id: number, patch: Partial<WithdrawalDetail>) {
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

  find(id: number): WithdrawalDetail | undefined {
    return this.withdrawals.find((w) => w.id === id)
  },

  findByStatus(status: string): WithdrawalDetail[] {
    return this.withdrawals.filter((w) => w.status === status)
  },

  findByPermission(permission: string): WithdrawalDetail[] {
    return this.withdrawals.filter((w) => w.permission === permission)
  },

  stats() {
    const total = this.withdrawals.length
    return {
      total,
      byStatus: {
        PENDING: this.withdrawals.filter((w) => w.status === 'PENDING').length,
        APPROVED: this.withdrawals.filter((w) => w.status === 'APPROVED')
          .length,
        REJECTED: this.withdrawals.filter((w) => w.status === 'REJECTED')
          .length,
        COMPLETED: this.withdrawals.filter((w) => w.status === 'COMPLETED')
          .length,
      },
      byPermission: {
        admin: this.withdrawals.filter((w) => w.permission === 'admin').length,
        staff: this.withdrawals.filter((w) => w.permission === 'staff').length,
        general: this.withdrawals.filter((w) => w.permission === 'general')
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
