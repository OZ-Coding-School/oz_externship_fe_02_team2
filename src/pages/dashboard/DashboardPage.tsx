import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PAGE_TITLE } from '@/routes/constants'
import { useState } from 'react'

type DashboardTabKey = 'join' | 'leave' | 'reason'

export default function DashboardPage() {
  const [tab, setTab] = useState<DashboardTabKey>('join')

  return (
    <section className="flex w-full flex-col gap-13">
      <h3 className="hidden text-gray-800 md:block">{PAGE_TITLE.DASHBOARD}</h3>

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as DashboardTabKey)}
        className="w-full"
      >
        <TabsList className="grid w-[358px] grid-cols-3">
          <TabsTrigger value="join">회원가입 추세</TabsTrigger>
          <TabsTrigger value="leave">회원탈퇴 추세</TabsTrigger>
          <TabsTrigger value="reason">탈퇴 사유 분석</TabsTrigger>
        </TabsList>

        <article className="mt-3">
          <TabsContent value="join"></TabsContent>
          <TabsContent value="leave"></TabsContent>
          <TabsContent value="reason"></TabsContent>
        </article>
      </Tabs>
    </section>
  )
}
