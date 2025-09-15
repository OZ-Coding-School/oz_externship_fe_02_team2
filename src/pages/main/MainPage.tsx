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
    <div className="w-vw flex">
      <div className="relative h-screen flex-1 md:flex">
        <Navigaiton
          actionbarTitle={getPageTitle(pathname)}
          mobileDrawerOpen={drawerOpen}
          onActionbarMenuClick={() => setDrawerOpen(true)}
          onMobileDrawerOpenChange={() => setDrawerOpen(false)}
        />

        <main className="w-full flex-1 space-y-4 p-6">
          {/* TODO: BasicSkeleton으로 로딩 화면 대체 */}
          <Suspense fallback={<div>Loading…</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
