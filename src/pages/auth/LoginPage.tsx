import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input/Input'
import { useState } from 'react'
import Symbol from 'public/symbol.svg'

export default function LoginPage() {
  const [email, setEmail] = useState('')

  return (
    <main className="flex h-screen w-screen bg-white px-4 md:px-0">
      {/* 로그인 섹션: md 이상 너비 840px 고정 */}
      <section className="flex h-full w-full items-center justify-center md:w-210 md:shrink-0">
        {/* 로그인 영역: max-width 328px */}
        <div className="flex w-82 flex-col items-center">
          <header className="flex w-full flex-col items-center gap-6">
            <hgroup className="flex items-center gap-2">
              <img src={Symbol} alt="StudyHub Symbol" />
              <h1 className="text-primary-600 text-[32px]/7">StudyHub</h1>
            </hgroup>

            <h2>관리자 로그인</h2>
          </header>

          <p className="body-xs mt-[46px] mb-6 leading-none tracking-tighter text-[#000A30]">
            <span className="text-[#F6A818]">admin 계정</span>을 통해 로그인을
            진행해주세요.
          </p>

          <form className="flex w-full flex-col items-center gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="아이디 (example@gmail.com)"
              required
              error={
                !email || /.+@.+\..+/.test(email)
                  ? ''
                  : '이메일 형식이 올바르지 않습니다.'
              }
              size="lg"
              className="placeholder:body-sm h-13 rounded-sm placeholder:tracking-tighter placeholder:text-[#BDBDBD]"
              containerClassName="w-full"
            />

            <Input
              type="password"
              placeholder="비밀번호 (6~15자의 영문 대소문자, 숫자, 특수문자 포함)"
              showPasswordToggle={false}
              required
              size="lg"
              className="placeholder:body-sm h-13 rounded-sm placeholder:tracking-tighter placeholder:text-[#BDBDBD]"
              containerClassName="w-full"
            />

            {/* TODO: 로그인 성공/실패 토스트 알림 */}
            <Button
              type="submit"
              btnSize="large"
              btnText="로그인"
              className="body-base h-13 w-full rounded-sm bg-[#F6A818] font-normal text-white"
            />
          </form>
        </div>
      </section>

      {/* 우측 노란색 디자인 섹션 (md 미만 hidden) */}
      <div className="hidden bg-[#F6A818]/8 md:block md:flex-1"></div>
    </main>
  )
}
