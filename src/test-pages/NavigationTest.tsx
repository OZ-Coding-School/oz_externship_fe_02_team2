import Actionbar from '@/components/Navigation/Actionbar/Actionbar'
import Sidebar from '@/components/Navigation/Sidebar/Sidebar'
import { useState } from 'react'

const SIDEBAR_TESTPAGE_TITLE =
  'Navigation(Sidebar & 모바일 Actionbar) 컴포넌트 테스트'

export default function NavigationTest() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <section className="flex">
      <article className="relative h-screen flex-1 md:flex">
        {/* 모바일 전용 액션바: 페이지 컬럼 내부에만 보임 */}
        <Actionbar
          onMenuClick={() => setDrawerOpen(true)}
          title={SIDEBAR_TESTPAGE_TITLE}
        />
        <Sidebar
          scope="container"
          mobileDrawerOpen={drawerOpen}
          onMobileDrawerOpenChange={setDrawerOpen}
        />
        {/* 액션바 높이만큼 내부 컨텐츠에 여백 주기 */}
        <div className="flex-1 space-y-4 p-6">
          <h3 className="hidden md:block">{SIDEBAR_TESTPAGE_TITLE}</h3>
          <p className="body-sm">사이드바 컴포넌트 테스트 페이지입니다.</p>
        </div>
      </article>
    </section>
  )
}
