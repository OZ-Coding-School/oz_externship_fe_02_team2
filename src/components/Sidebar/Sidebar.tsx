import { Button } from '@components/ui/Button'
import Burger from '@assets/icons/hamburger.svg'

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-white shadow-[inset_-1px_0_0_0_#e5e7eb]">
      <header className="flex items-center justify-between p-6">
        <h4 className="font-bold">관리자 패널</h4>
        <Button
          btnSize="small"
          btnIcon={<img src={Burger} alt="메인 메뉴 토글" />}
          className="hover:animate-spin-once bg-transparent p-0 hover:bg-transparent"
          iconOnly
        />
      </header>
      <nav className="mb-2 px-4">아코디언 메뉴</nav>
    </aside>
  )
}
