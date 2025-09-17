import { useState } from 'react'
import { Description, Form, Header, RightYellowDiv } from './parts'

export default function LoginPage() {
  const [email, setEmail] = useState('')

  return (
    <main className="flex h-screen w-screen bg-white px-4 md:px-0">
      {/* 로그인 섹션: md 이상 너비 840px 고정 */}
      <section className="flex h-full w-full items-center justify-center md:w-210 md:shrink-0">
        {/* 로그인 영역: max-width 328px */}
        <div className="flex w-82 flex-col items-center">
          <Header />
          <Description />
          <Form email={email} setEmail={setEmail} />
        </div>
      </section>

      <RightYellowDiv />
    </main>
  )
}

// 조합형 API
LoginPage.Header = Header
LoginPage.Description = Description
LoginPage.Form = Form
LoginPage.RightYellowDiv = RightYellowDiv
