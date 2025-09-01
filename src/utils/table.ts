export const cls = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(' ')

export const fmtDate = (iso?: string | Date) => {
  if (!iso) return '-'
  const d = typeof iso === 'string' ? new Date(iso) : iso
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${hh}:${mm}`
}
