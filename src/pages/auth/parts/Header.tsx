import Symbol from 'public/symbol.svg'

/** 사이트 심볼&로고와 페이지 제목(관리자 로그인) */
export default function Header() {
  return (
    <header className="flex w-full flex-col items-center gap-6">
      <hgroup className="flex items-center gap-2">
        <img src={Symbol} alt="StudyHub Symbol" />
        <h1 className="text-primary-600 text-[32px]/7">StudyHub</h1>
      </hgroup>

      <h2>관리자 로그인</h2>
    </header>
  )
}
