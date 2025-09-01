export const cls = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(' ')

export function fmtDate(
  value?: string | number | Date,
  opts: { withTime?: boolean } = {}
) {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'

  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')

  if (opts.withTime) {
    const hh = String(d.getHours()).padStart(2, '0')
    const mi = String(d.getMinutes()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`
  }
  return `${yyyy}-${mm}-${dd}`
}
