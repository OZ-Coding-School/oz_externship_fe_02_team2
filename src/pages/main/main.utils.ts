import { PAGE_TITLE } from '@/routes/constants'

export const getPageTitle = (pathname: string): string => {
  const segment = pathname.split('/').filter(Boolean).pop() || ''
  return PAGE_TITLE[segment.toUpperCase()] ?? ''
}
