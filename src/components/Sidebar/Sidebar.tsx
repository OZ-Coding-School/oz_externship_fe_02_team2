import { Button } from '@components/ui/Button'
import Burger from '@assets/icons/hamburger.svg'
import { useState } from 'react'

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true)

  const toggle = () => setExpanded((prev) => !prev)

  return (
    <aside
      className={`h-screen ${expanded ? 'w-64' : 'w-18'} overflow-hidden bg-white shadow-[inset_-1px_0_0_0_#e5e7eb] transition-[width] duration-200`}
    >
      {/* TODO: Sidebar 위치 고정 추후 추가 */}
      <header
        className={`flex items-center ${expanded ? 'justify-between' : 'justify-center px-0'} p-6`}
      >
        {expanded && (
          <h4 className={`font-bold transition-opacity`}>관리자 패널</h4>
        )}
        <Button
          btnSize="small"
          btnIcon={<img src={Burger} alt="메인 메뉴 토글" />}
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
  )
}
