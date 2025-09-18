export default function Reason() {
  return (
    <>
      <section className="mb-6 flex w-[1120px] items-center justify-center rounded-lg bg-white p-6 shadow-xs">
        <div className="flex w-[1072px] flex-col items-center gap-6">
          <header className="flex h-9 w-full items-center justify-between">
            <h5>탈퇴 사유 분포</h5>
          </header>
          <article className="h-80 w-full">{/* 도넛 차트 들어올 곳 */}</article>
        </div>
      </section>

      <section className="flex w-[1120px] items-center justify-center rounded-lg bg-white p-6 shadow-xs">
        <div className="flex w-[1072px] flex-col items-center gap-6">
          <header className="flex h-9 w-full items-center justify-between">
            <h5>회원가입 추세</h5>
            {/* 드롭다운: 탈퇴 사유들 */}
          </header>
          <article className="h-80 w-full">{/* 차트 들어올 곳 */}</article>
        </div>
      </section>
    </>
  )
}
