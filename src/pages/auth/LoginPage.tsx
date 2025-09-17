export default function LoginPage() {
  return (
    <main className="flex h-screen w-screen bg-white">
      {/* 로그인 섹션: md 이상 너비 840px 고정 */}
      <section className="h-full md:w-210 md:shrink-0">
        <div className="flex flex-col items-center"></div>
      </section>

      {/* 우측 노란색 디자인 섹션 (md 미만 hidden) */}
      <div className="hidden bg-[#F6A818]/8 md:block md:flex-1"></div>
    </main>
  )
}
