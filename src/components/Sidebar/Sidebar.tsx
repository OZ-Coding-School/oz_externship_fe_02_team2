import { Button } from '@components/ui/Button'
import Burger from '@assets/icons/hamburger.svg'
import { useEffect, useState } from 'react'
import { cn } from '@/lib'
import type { SidebarProps } from './Sidebar.types'

export default function Sidebar({
  mobileDrawerOpen,
  onMobileDrawerOpenChange,
  scope = 'container',
}: SidebarProps) {
  const [expanded, setExpanded] = useState(true) // ≥md: Expanded↔Rail
  const [internalOpen, setInternalOpen] = useState(false) // <md: Drawer
  const drawerOpen = mobileDrawerOpen ?? internalOpen
  const setDrawerOpen = onMobileDrawerOpenChange ?? setInternalOpen

  const toggle = () => setExpanded((prev) => !prev)

  const posOverlay =
    scope === 'container' ? 'absolute inset-0' : 'fixed inset-0'
  const posPanel =
    scope === 'container'
      ? 'absolute inset-y-0 left-0'
      : 'fixed inset-y-0 left-0'

  // 드로어 오버레이 열린 경우 바디 스크롤 잠금 (viewport 스코프일 때만)
  useEffect(() => {
    if (!(drawerOpen && scope === 'viewport')) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [drawerOpen, scope])

  return (
    <>
      {/* 데스크톱 사이드바 (≥ md) */}
      <aside
        className={cn(
          'z-60 hidden h-screen overflow-hidden bg-white md:block',
          'shadow-[inset_-1px_0_0_0_#e5e7eb] transition-[width] duration-200',
          expanded ? 'w-64' : 'w-18'
        )}
      >
        {/* TODO: Sidebar 위치 고정 추후 추가 */}
        <header
          className={`flex items-center ${expanded ? 'justify-between px-6' : 'justify-center px-0'} py-6`}
        >
          {expanded && <h4 className="font-bold">관리자 패널</h4>}
          <Button
            btnSize="small"
            btnIcon={<img src={Burger} alt="사이드바 토글" />}
            className="hover:animate-spin-once bg-transparent p-0 hover:bg-transparent"
            onClick={toggle}
            iconOnly
            aria-label={expanded ? '사이드바 접기' : '사이드바 펼치기'}
            aria-expanded={expanded}
          />
        </header>
        <nav className={`mb-2 w-full ${expanded ? 'px-4' : 'px-2'}`}>
          아코디언 메뉴
        </nav>
      </aside>

      {/* 모바일 드로어(< md): 오버레이 + 패널 */}
      {/* 오버레이 */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) setDrawerOpen(false)
        }}
        className={cn(
          'fixed inset-0 z-50 bg-gray-600/50 transition-opacity duration-200 md:hidden',
          posOverlay,
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!drawerOpen}
      />
      {/* 패널 */}
      <aside
        className={cn(
          'z-60 h-screen w-[80vw] max-w-64 overflow-hidden bg-white md:hidden',
          'shadow-[inset_-1px_0_0_0_#e5e7eb] transition-transform duration-200',
          posPanel,
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <header className="flex items-center justify-between p-6">
          <h4 className="font-bold">관리자 패널</h4>
          <Button
            btnSize="small"
            btnIcon={<img src={Burger} alt="메뉴 닫기" />}
            className="hover:animate-spin-once bg-transparent p-0 hover:bg-transparent"
            onClick={() => setDrawerOpen(false)}
            iconOnly
            aria-label="메뉴 닫기"
          />
        </header>
        <nav className="mb-2 w-full px-4">아코디언 메뉴</nav>
      </aside>
    </>
  )
}
