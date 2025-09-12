import Navigaiton from '@/components/Navigation/Navigation'
import { useState } from 'react'

const NAV_TESTPAGE_TITLE = 'Navigation 컴포넌트 테스트'

export default function NavigationTest() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <section className="flex">
      <article className="relative h-screen flex-1 md:flex">
        <Navigaiton
          actionbarTitle={NAV_TESTPAGE_TITLE}
          mobileDrawerOpen={drawerOpen}
          onActionbarMenuClick={() => setDrawerOpen(true)}
          onMobileDrawerOpenChange={() => setDrawerOpen(false)}
        />
        {/* 액션바 높이만큼 내부 컨텐츠에 여백 주기 */}
        <div className="flex-1 space-y-4 p-6">
          <h3 className="hidden md:block">{NAV_TESTPAGE_TITLE}</h3>
          <p className="body-sm">
            네비게이션(사이드바&액션바) 컴포넌트 테스트 페이지입니다.
          </p>
        </div>
      </article>
    </section>
  )
}
