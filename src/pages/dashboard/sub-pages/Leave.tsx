export default function Leave() {
  return (
    <section className="flex w-[1120px] items-center justify-center rounded-lg bg-white p-6 shadow-xs">
      <div className="flex w-[1072px] flex-col items-center gap-6">
        <header className="flex h-9 w-full items-center justify-between">
          <h5>회원탈퇴 추세</h5>
          {/* 드롭다운: 월별/연별 */}
        </header>
        <article className="h-80 w-full">{/* 차트 들어올 곳 */}</article>
      </div>
    </section>
  )
}
