import { PAGE_TITLE } from '@/routes/constants'

/** pathname의 가장 마지막 경로로 페이지 제목을 추출 */
export const getPageTitle = (pathname: string): string => {
  const segment = pathname.split('/').filter(Boolean).pop() || ''
  return PAGE_TITLE[segment.toUpperCase()] ?? ''
}
