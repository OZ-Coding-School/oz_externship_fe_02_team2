export const genderLabel = (g?: string | null) => {
  const key = (g ?? '').toUpperCase()
  const map: Record<string, string> = {
    MALE: '남성',
    FEMALE: '여성',
    OTHER: '기타',
  }
  return map[key] ?? '미기입'
}
