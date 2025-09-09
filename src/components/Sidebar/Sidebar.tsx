import { useEffect, useState } from 'react'
import type { SidebarProps } from './Sidebar.types'
import DesktopAside from './DesktopAside'
import MobileDrawer from './MobileDrawer'

export default function Sidebar({
  mobileDrawerOpen,
  onMobileDrawerOpenChange,
  scope = 'container',
}: SidebarProps) {
  const [expanded, setExpanded] = useState(true) // ≥md: Expanded↔Rail
  const [internalOpen, setInternalOpen] = useState(false) // <md: Drawer
  const drawerOpen = mobileDrawerOpen ?? internalOpen
  const setDrawerOpen = onMobileDrawerOpenChange ?? setInternalOpen

  // 드로어 오버레이 열린 경우 바디 스크롤 잠금 (viewport 스코프일 때만)
  useEffect(() => {
    if (!drawerOpen) return
    if (scope !== 'viewport') return
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
        onToggle={() => setExpanded((expanded) => !expanded)}
      >
        {/* TODO: 아코디언 메뉴 제작 후 삽입 */}
        아코디언 메뉴
      </DesktopAside>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        scope={scope}
      >
        아코디언 메뉴
      </MobileDrawer>
    </>
  )
}
