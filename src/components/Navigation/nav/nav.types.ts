// 하위 메뉴
export type NavKey =
  | 'user'
  | 'withdrawal'
  | 'dashboard'
  | 'lecture'
  | 'studygroup'
  | 'review'
  | 'post'
  | 'application'

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
