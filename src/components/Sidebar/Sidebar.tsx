import { Button } from '@components/ui/Button'
import Burger from '@assets/icons/hamburger.svg'
import { useEffect, useState } from 'react'
import { cn } from '@/lib'

export default function Sidebar() {
  // 데스크톱: Expanded(256px) ↔ Rail(72px)
  const [expanded, setExpanded] = useState(true)
  const toggle = () => setExpanded((prev) => !prev)

  // md: Drawer open/close
  const [drawerOpen, setDrawerOpen] = useState(false)

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
      {/* TODO: 반응형(모바일) 헤더(z-40)로 분리 */}
      <header className="w-full">
        {/* 모바일 트리거 버튼 (좌상단) */}
        <Button
          btnSize="small"
          btnIcon={<img src={Burger} alt="메뉴 열기" />}
          className="hover:animate-spin-once z-40 bg-transparent p-0 hover:bg-transparent md:hidden"
          onClick={() => setDrawerOpen(true)}
          iconOnly
          aria-label="메뉴 열기"
        />
      </header>

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
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!drawerOpen}
      />
      {/* 패널 */}
      <aside
        className={cn(
          'z-60 h-screen w-[80vw] max-w-64 overflow-hidden bg-white md:hidden',
          'shadow-[inset_-1px_0_0_0_#e5e7eb] transition-[width] duration-200',
          drawerOpen ? 'translate-x-0' : '-translate-x-[110%]'
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
