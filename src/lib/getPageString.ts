import { PAGE_TITLE } from '@/routes/constants'

/** pathname의 가장 마지막 경로(페이지) 추출 */
export const getPage = (pathname: string): string =>
  pathname.split('/').filter(Boolean).pop() || ''

/** pathname의 가장 마지막 경로로 페이지 제목을 추출 */
export const getPageTitle = (pathname: string): string => {
  const segment = getPage(pathname)
  return PAGE_TITLE[segment.toUpperCase()] ?? ''
}
