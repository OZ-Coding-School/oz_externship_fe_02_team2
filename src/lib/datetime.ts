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

export function formatYmdHms(
  value?: string | number | Date,
  timeZone: string = 'Asia/Seoul'
): string {
  if (!value) return '-'
  const date = value instanceof Date ? value : new Date(value)
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const get = (t: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === t)?.value ?? '00'

  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`
}
