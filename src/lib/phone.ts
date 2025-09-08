export function digitsOnly(v: string) {
  return v.replace(/\D+/g, '')
}

export function formatPhoneKR(v: string) {
  const d = digitsOnly(v).slice(0, 11) // 11자리 제한
  if (d.startsWith('02')) {
    if (d.length <= 2) return d
    if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`
    if (d.length <= 9) return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`
    return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6)}`
  }
  // 010/011/016/017/018/019 등
  if (d.length <= 3) return d
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

export function validatePhoneKR(v: string) {
  const d = digitsOnly(v)
  // 02 지역번호는 9~10자리, 휴대폰/타 지역 10~11자리 정도를 유효로 간주
  if (d.startsWith('02')) return d.length === 9 || d.length === 10
  return d.length === 10 || d.length === 11
}
