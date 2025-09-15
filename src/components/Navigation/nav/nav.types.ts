import { PATHS } from '@/routes/constants'

/** 네비에 쓸 하위 메뉴 키만 모아둔 배열 */
export const NAV_KEYS = [
  PATHS.USER,
  PATHS.WITHDRAWAL,
  PATHS.DASHBOARD,
  PATHS.LECTURE,
  PATHS.STUDYGROUP,
  PATHS.REVIEW,
  PATHS.POST,
  PATHS.APPLICATION,
] as const

export type NavKey = (typeof NAV_KEYS)[number]

export type NavItemDef = {
  key: NavKey
  label: string
  defaultIcon: string
  activeIcon: string
}

// 상위 메뉴
export type NavSectionId = 'members' | 'studies' | 'recruits'

export type NavSectionDef = {
  id: NavSectionId
  label: string
  icon: string
  items: readonly NavItemDef[]
}
