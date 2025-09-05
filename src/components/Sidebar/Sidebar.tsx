import { Button } from '@components/ui/Button'
import Burger from '@assets/icons/hamburger.svg'

export default function Sidebar() {
  return (
    <aside>
      <header>
        <h4 className="font-bold">관리자 패널</h4>
        <Button
          btnSize="small"
          btnIcon={<img src={Burger} alt="메인 메뉴 토글" />}
          className="bg-transparent hover:bg-gray-100 active:bg-gray-200"
          iconOnly
        />
      </header>
      <nav>아코디언 메뉴</nav>
    </aside>
  )
}
