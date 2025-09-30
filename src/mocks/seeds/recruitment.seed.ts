// src/mocks/seeds/recruitments.seed.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
export type RecruitmentRow = {
  id: number
  uuid: string
  title: string
  img: string | null
  expected_headcount: number
  lectures: { title: string; instructor: string }[]
  tags: string[] // 목록 스펙: 문자열 배열
  close_at: string | null
  views_count: number
  bookmarks_count: number
  created_at: string
  updated_at: string
}

const RECRUITMENT_COUNT = Number(import.meta.env.VITE_MSW_RECRUITS ?? 100)
const PERSIST_KEY = '__msw_recruitments__'
const ENABLE_PERSIST = true

// 결정적 RNG
function lcg(seed = 987654321) {
  let s = seed >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0
    return s / 0xffffffff
  }
}
const rnd = lcg(20250918)

const TAG_POOL = [
  'react',
  'vue',
  'angular',
  'js',
  'ts',
  'spring',
  'node.js',
  'express',
  'nextjs',
  'java',
  'python',
  'django',
  'fast',
  'flask',
  'php',
  'docker',
  'kubernetes',
  'aws',
  'azure',
  'gcp',
  'frontend',
  'backend',
  'fullstack',
  'devops',
  'ai',
  'ml',
] as const

const pickN = <T>(arr: readonly T[], nMin = 1, nMax = 3) => {
  const n = Math.floor(rnd() * (nMax - nMin + 1)) + nMin
  const pool = [...arr]
  const out: T[] = []
  while (out.length < n && pool.length) {
    out.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]!)
  }
  return out
}
const addDays = (d: number) => {
  const t = new Date()
  t.setDate(t.getDate() + d)
  return t.toISOString()
}
const uuid = (i: number) =>
  globalThis.crypto?.randomUUID?.() ?? `r_${Date.now()}_${i}`

export function makeRecruitment(i: number): RecruitmentRow {
  const createdAt = addDays(-Math.floor(rnd() * 60)) // 최근 60일 안
  const closeShift = Math.floor(rnd() * 45) - 15 // -15~+29일
  const row: RecruitmentRow = {
    id: i,
    uuid: uuid(i),
    title: `샘플 공고 ${i}`,
    img: `https://picsum.photos/seed/rc${i}/640/360`,
    expected_headcount: 2 + Math.floor(rnd() * 7),
    lectures: [],
    tags: pickN(TAG_POOL),
    close_at: addDays(closeShift),
    views_count: Math.floor(rnd() * 4000),
    bookmarks_count: Math.floor(rnd() * 400),
    created_at: createdAt,
    updated_at: createdAt,
  }
  return row
}

export function makeRecruitments(count = RECRUITMENT_COUNT): RecruitmentRow[] {
  return Array.from({ length: count }, (_, idx) => makeRecruitment(idx + 1))
}

function loadPersisted(): RecruitmentRow[] | null {
  if (!ENABLE_PERSIST) return null
  try {
    const raw = localStorage.getItem(PERSIST_KEY)
    if (!raw) return null
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? (arr as RecruitmentRow[]) : null
  } catch {
    return null
  }
}
function persist(rows: RecruitmentRow[]) {
  if (!ENABLE_PERSIST) return
  try {
    localStorage.setItem(PERSIST_KEY, JSON.stringify(rows))
  } catch {}
}

export const recruitmentsDb = {
  rows: [] as RecruitmentRow[],
  init(force = false) {
    if (!force) {
      const persisted = loadPersisted()
      if (persisted) {
        this.rows = persisted
        return
      }
    }
    this.rows = makeRecruitments()
    persist(this.rows)
  },
  reset(count = RECRUITMENT_COUNT) {
    this.rows = makeRecruitments(count)
    persist(this.rows)
  },
  add(row: RecruitmentRow) {
    this.rows.unshift(row)
    persist(this.rows)
  },
  patch(uuid: string, patch: Partial<RecruitmentRow>) {
    const idx = this.rows.findIndex((r) => r.uuid === uuid)
    if (idx === -1) return null
    this.rows[idx] = {
      ...this.rows[idx],
      ...patch,
      updated_at: new Date().toISOString(),
    }
    persist(this.rows)
    return this.rows[idx]
  },
  remove(uuid: string) {
    const idx = this.rows.findIndex((r) => r.uuid === uuid)
    if (idx === -1) return false
    this.rows.splice(idx, 1)
    persist(this.rows)
    return true
  },
}
