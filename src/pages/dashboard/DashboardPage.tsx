import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getDashboardTab } from '@/lib'
import { PAGE_TITLE } from '@/routes/constants'
import { Link, Outlet, useLocation } from 'react-router-dom'

export default function DashboardPage() {
  const { pathname } = useLocation()
  const tab = getDashboardTab(pathname)

  return (
    <div className="flex w-full flex-col gap-13">
      <h3 className="hidden text-gray-800 md:block">{PAGE_TITLE.DASHBOARD}</h3>

      <Tabs value={tab} className="w-full">
        <TabsList>
          <TabsTrigger value="join" asChild>
            <Link to="join" className="no-underline">
              회원가입 추세
            </Link>
          </TabsTrigger>
          <TabsTrigger value="leave" asChild>
            <Link to="leave" className="no-underline">
              회원탈퇴 추세
            </Link>
          </TabsTrigger>
          <TabsTrigger value="reason" asChild>
            <Link to="reason" className="no-underline">
              탈퇴 사유 분석
            </Link>
          </TabsTrigger>
        </TabsList>

        <div className="mt-3">
          <Outlet />
        </div>
      </Tabs>
    </div>
  )
}
