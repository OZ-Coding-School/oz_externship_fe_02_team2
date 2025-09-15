import { useEffect, useState } from 'react'
import type { SidebarProps } from './Sidebar.types'
import { DesktopAside, MobileDrawer, Nav } from './parts'

import { useLocation } from 'react-router'
import { getPage } from '@/lib'
import { PATHS } from '@/routes/constants'

// TODO: 메뉴 클릭했을 때 경로로 가게

export default function Sidebar({
  mobileDrawerOpen,
  onMobileDrawerOpenChange,
}: SidebarProps) {
  // const navigate = useNavigate()
  const { pathname } = useLocation()

  const [expanded, setExpanded] = useState(true) // ≥md: Expanded↔Rail
  const [internalOpen, setInternalOpen] = useState(false) // <md: Drawer
  const drawerOpen = mobileDrawerOpen ?? internalOpen
  const setDrawerOpen = onMobileDrawerOpenChange ?? setInternalOpen

  const [activeMenu, setActiveMenu] = useState<string>(PATHS.DASHBOARD)

  // 경로(페이지)에 맞게 메뉴 활성화
  useEffect(() => {
    const currentPage = getPage(pathname)
    setActiveMenu(currentPage)
  }, [pathname])

  // 드로어 오버레이 열린 경우 바디 스크롤 잠금
  useEffect(() => {
    if (!drawerOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [drawerOpen])

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

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
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
