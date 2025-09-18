import Navigaiton from '@/components/Navigation/Navigation'
import { Suspense, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { getPageTitle } from '../../lib/getPageString'

/** 메인 레이아웃 기능 수행 */
export default function MainPage() {
  const { pathname } = useLocation()

  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex h-dvh w-screen overflow-hidden">
      <div className="relative flex h-full min-h-0 flex-1 flex-col md:flex-row">
        <Navigaiton
          actionbarTitle={getPageTitle(pathname)}
          mobileDrawerOpen={drawerOpen}
          onActionbarMenuClick={() => setDrawerOpen(true)}
          onMobileDrawerOpenChange={() => setDrawerOpen(false)}
        />

        <main className="w-full flex-1 overflow-auto bg-gray-50 p-8">
          {/* TODO: BasicSkeleton으로 로딩 화면 대체 */}
          <Suspense fallback={<div>Loading…</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
