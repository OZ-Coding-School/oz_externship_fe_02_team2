import { PAGE_TITLE } from '@/routes/constants'

/** pathname의 가장 마지막 경로(페이지) 추출 */
export const getPage = (pathname: string): string =>
  pathname.split('/').filter(Boolean).pop() || ''

/** 제목이 매핑된 경로 외 추가 서브 경로가 있을 때, 해당 경로도 메인 경로로 매핑되도록 하여 액션바에서 페이지 제목이 정상적으로 잡히도록 상수 추가 (현재 대시보드만 있음) */
const LAST_TO_PARENT: Record<string, string> = {
  join: 'dashboard',
  leave: 'dashboard',
  reason: 'dashboard',
}

/** pathname의 가장 마지막 경로로 페이지 제목을 추출 */
export const getPageTitle = (pathname: string): string => {
  const segment = getPage(pathname)
  const key = (LAST_TO_PARENT[segment] ?? segment).toUpperCase()
  return PAGE_TITLE[key] ?? ''
}
