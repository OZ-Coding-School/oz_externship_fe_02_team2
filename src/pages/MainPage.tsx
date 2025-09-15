import Navigaiton from '@/components/Navigation/Navigation'
import { Suspense, useState } from 'react'

/** 메인 레이아웃 기능 수행 */
export default function MainPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <main className="flex">
      <aside className="relative h-screen flex-1 md:flex">
        <Navigaiton
          actionbarTitle={NAV_TESTPAGE_TITLE}
          mobileDrawerOpen={drawerOpen}
          onActionbarMenuClick={() => setDrawerOpen(true)}
          onMobileDrawerOpenChange={() => setDrawerOpen(false)}
        />
      </aside>
      <main className="flex-1 space-y-4 p-6">
        <Suspense fallback={}></Suspense>
      </main>
    </main>
  )
}
