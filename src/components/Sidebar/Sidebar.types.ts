export type SidebarProps = {
  mobileDrawerOpen?: boolean
  onMobileDrawerOpenChange?: (open: boolean) => void
  scope?: 'viewport' | 'container' // viewport가 전체 화면, container는 테스트 페이지 위해 컨테이너 안에서만
}
