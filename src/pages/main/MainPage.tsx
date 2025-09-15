import Navigaiton from '@/components/Navigation/Navigation'
import { PAGE_TITLE } from '@/routes/constants'
import { Suspense, useState } from 'react'
import { Outlet, useLocation } from 'react-router'

const getPageTitle = (pathname: string): string => {
  const segment = pathname.split('/').filter(Boolean).pop() || ''
  return PAGE_TITLE[segment.toUpperCase()] ?? ''
}

/** 메인 레이아웃 기능 수행 */
export default function MainPage() {
  const { pathname } = useLocation()

  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <main className="flex">
      <aside className="relative h-screen flex-1 md:flex">
        <Navigaiton
          actionbarTitle={getPageTitle(pathname)}
          mobileDrawerOpen={drawerOpen}
          onActionbarMenuClick={() => setDrawerOpen(true)}
          onMobileDrawerOpenChange={() => setDrawerOpen(false)}
        />
      </aside>
      <main className="flex-1 space-y-4 p-6">
        {/* TODO: BasicSkeleton으로 로딩 화면 대체 */}
        <Suspense fallback={<div className="p-6">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>
    </main>
  )
}
