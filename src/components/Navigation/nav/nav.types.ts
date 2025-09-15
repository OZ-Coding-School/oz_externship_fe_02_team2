export type NavItemDef = {
  key: string
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
  items: NavItemDef[]
}
