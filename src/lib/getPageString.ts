import { PAGE_TITLE } from '@/routes/constants'

/** 대시보드 등의 하위 경로 → 상위 메뉴 키 매핑 */
const LAST_TO_PARENT: Record<string, string> = {
  // dashboard 하위
  join: 'dashboard',
  leave: 'dashboard',
  reason: 'dashboard',
  // 필요 시 여기 계속 추가
}

/** pathname의 가장 마지막 경로(페이지) 추출 */
export const getPage = (pathname: string): string => {
  const last = pathname.split('/').filter(Boolean).pop() || ''
  return LAST_TO_PARENT[last] ?? last
}

/** pathname의 가장 마지막 경로로 페이지 제목을 추출 */
export const getPageTitle = (pathname: string): string => {
  const key = getPage(pathname).toUpperCase()
  return PAGE_TITLE[key] ?? ''
}

/** pathname의 가장 마지막 경로로 대시보드 탭 활성화 */
export const getDashboardTab = (pathname: string): string =>
  pathname.split('/').filter(Boolean).pop() || ''
