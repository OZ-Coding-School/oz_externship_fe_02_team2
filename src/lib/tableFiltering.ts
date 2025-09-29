/* eslint-disable @typescript-eslint/no-explicit-any */
import { isPronunciationQuery, toPronunciation } from '@/lib/koreanSearch'
import type { TableData, TableQuery } from '@/types'

// 이메일 검색 시 도메인 제외(로컬파트만)
const normCell = (v: unknown): string => {
  const s = String(v ?? '').toLowerCase()
  return s.includes('@') ? s.split('@')[0] : s
}

/**
 * 클라이언트 사이드 테이블 필터링/정렬/페이지네이션
 * - 초성 질의 지원
 * - null/undefined 정렬 우선순위: "비어있음이 항상 작다"
 */
export function filterTableData<T extends Record<string, unknown>>(
  raw: T[],
  q: TableQuery,
  fields: (keyof T)[],
  filterKeys: { status?: keyof T; role?: keyof T } = {}
): TableData<T> {
  let items = raw

  // 1) 검색
  if (fields.length) {
    const rawQ = (q.q ?? '').trim()
    if (rawQ) {
      if (isPronunciationQuery(rawQ)) {
        items = items.filter((row) =>
          fields.some((f) => toPronunciation(row[f]).includes(rawQ))
        )
      } else {
        const kw = rawQ.toLowerCase()
        items = items.filter((row) =>
          fields.some((f) => normCell(row[f]).includes(kw))
        )
      }
    }
  }

  // 2) 상태/권한 필터
  const { status: statusKey, role: roleKey } = filterKeys
  if (q.status && statusKey) {
    const want = String(q.status).toLowerCase()
    items = items.filter(
      (row) => String(row[statusKey] ?? '').toLowerCase() === want
    )
  }
  if (q.role && roleKey) {
    const want = String(q.role).toLowerCase()
    items = items.filter(
      (row) => String(row[roleKey] ?? '').toLowerCase() === want
    )
  }

  // 3) 정렬
  if (q.sortBy && q.sortDir) {
    const dir = q.sortDir === 'desc' ? -1 : 1
    const key = q.sortBy as keyof T
    items = [...items].sort((a, b) => {
      const av = a[key] as any
      const bv = b[key] as any
      if (av == null && bv == null) return 0
      if (av == null) return -1 * dir
      if (bv == null) return 1 * dir
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
  }

  // 4) 페이징
  const total = items.length
  const start = (q.page - 1) * Number(q.pageSize)
  const paged = items.slice(start, start + Number(q.pageSize))

  return {
    items: paged,
    total,
    page: q.page,
    pageSize: q.pageSize,
    totalPages: Math.max(1, Math.ceil(total / Number(q.pageSize))),
  }
}
