import Sidebar from '@/components/Sidebar/Sidebar'

export default function SidebarTest() {
  return (
    <section className="flex flex-row md:flex-col">
      <Sidebar />
      <article className="space-y-4 p-6">
        <h3>Sidebar 컴포넌트 테스트</h3>
        <p className="body-sm">사이드바 컴포넌트 테스트 페이지입니다.</p>
      </article>
    </section>
  )
}
