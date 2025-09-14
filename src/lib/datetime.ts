/** ISO → ko-KR 표시용 (UI 전용) */
export function formatDateTime(iso?: string) {
  if (!iso) return '-'
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(d)
  } catch {
    return iso
  }
}
