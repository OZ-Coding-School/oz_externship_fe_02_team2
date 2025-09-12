import { useEffect, useState } from 'react'
import type { SidebarProps } from './Sidebar.types'
import { DesktopAside, MobileDrawer, Nav } from './parts'
import type { NavKey } from './nav/nav.types'

// import { useNavigate } from 'react-router'
// TODO: 현재 경로에 따라 active 상태 매핑 + 그냥 메인으로 들어왔을 경우 최상단 /users로

export default function Sidebar({
  mobileDrawerOpen,
  onMobileDrawerOpenChange,
  scope = 'container',
}: SidebarProps) {
  // const navigate = useNavigate()

  const [expanded, setExpanded] = useState(true) // ≥md: Expanded↔Rail
  const [internalOpen, setInternalOpen] = useState(false) // <md: Drawer
  const drawerOpen = mobileDrawerOpen ?? internalOpen
  const setDrawerOpen = onMobileDrawerOpenChange ?? setInternalOpen

  // TODO: 경로에 따라 하위 메뉴 active 상태 결정
  const [activeMenu, setActiveMenu] = useState<NavKey | null>('users')

  // 드로어 오버레이 열린 경우 바디 스크롤 잠금 (viewport 스코프일 때만)
  useEffect(() => {
    if (!drawerOpen || scope !== 'viewport') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [drawerOpen, scope])

  return (
    <>
      <DesktopAside
        expanded={expanded}
        onToggle={() => setExpanded((prev) => !prev)}
      >
        {/* TODO: 상위 메뉴 열고 접은 상태 로컬 스토리지 통해 유지 */}
        <Nav
          expanded={expanded}
          active={activeMenu}
          setActive={setActiveMenu}
        />
      </DesktopAside>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        scope={scope}
      >
        <Nav
          expanded
          active={activeMenu}
          setActive={setActiveMenu}
          rail={false}
        />
      </MobileDrawer>
    </>
  )
}

// 조합형 API
Sidebar.DesktopAside = DesktopAside
Sidebar.MobileDrawer = MobileDrawer
Sidebar.Nav = Nav
