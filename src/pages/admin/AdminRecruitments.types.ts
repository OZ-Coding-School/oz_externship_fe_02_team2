export type RecruitmentItem = {
  id: string
  uuid: string
  title: string
  tags: (string | { id: string; name: string })[]
  close_at: string | null // ← 신스펙
  deadline?: string | null // ← 구스펙 호환(옵션)
  status: 'OPEN' | 'CLOSED'
  views_count: number
  bookmarks_count: number
  created_at?: string
  updated_at?: string | null
}
