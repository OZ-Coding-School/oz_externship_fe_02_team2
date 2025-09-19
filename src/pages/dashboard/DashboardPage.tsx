import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PAGE_TITLE } from '@/routes/constants'
import { useState } from 'react'
import { Join, Leave, Reason } from './sub-pages'

type DashboardTabKey = 'join' | 'leave' | 'reason'

// TODO: 대시보드 탭 바뀌면(트리거) 쿼리 달라지게
export default function DashboardPage() {
  const [tab, setTab] = useState<DashboardTabKey>('join')

  return (
    <div className="flex w-full flex-col gap-13">
      <h3 className="hidden text-gray-800 md:block">{PAGE_TITLE.DASHBOARD}</h3>

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as DashboardTabKey)}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="join">회원가입 추세</TabsTrigger>
          <TabsTrigger value="leave">회원탈퇴 추세</TabsTrigger>
          <TabsTrigger value="reason">탈퇴 사유 분석</TabsTrigger>
        </TabsList>

        <div className="mt-3">
          <TabsContent value="join">
            <Join />
          </TabsContent>
          <TabsContent value="leave">
            <Leave />
          </TabsContent>
          <TabsContent value="reason">
            <Reason />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
