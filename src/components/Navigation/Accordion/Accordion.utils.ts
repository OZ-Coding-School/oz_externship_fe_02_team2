/** 로컬스토리지 접힘/펼침 정보 불러오기 */
export const readAccordionLS = (key: string | undefined): boolean => {
  if (!key || typeof window === 'undefined') return true // 정보 x -> default true(펼침)
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? true : JSON.parse(raw)
  } catch {
    return true
  }
}
