import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input/Input'
import { validateEmail, validatePassword } from '@/lib'
import { useMemo, useState, type FormEventHandler } from 'react'
import { useToast } from '@/hooks'

const INPUT_STYLE =
  'placeholder:body-sm h-13 rounded-sm placeholder:tracking-tighter placeholder:text-[#BDBDBD]'

const BUTTON_STYLE =
  'body-base h-13 w-full rounded-sm bg-[#F6A818] font-normal text-white'

export default function Form() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const emailError = useMemo(() => validateEmail(email), [email])
  const passwordError = useMemo(() => validatePassword(password), [password])

  const { triggerToast } = useToast()

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    // 유효성 검사 실패 시 제출 막기
    if (emailError || passwordError || !email || !password) {
      triggerToast(
        'error',
        '로그인 실패',
        '이메일 또는 비밀번호를 다시 확인해 주세요.'
      )
      return
    }
    // TODO: 정상 제출 로직
    // TODO: 성공/실패 토스트
    // TODO: db에 없는 계정도 유효성 검사 실패 토스트와 동일하게 토스트 올리기
  }

  return (
    <form
      noValidate // 네이티브 폼 검증 툴팁 off -> 토스트 보이게
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-center gap-3"
    >
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="아이디 (example@gmail.com)"
        required
        error={emailError}
        size="lg"
        className={INPUT_STYLE}
        containerClassName="w-full"
      />

      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호 (6~15자의 영문 대소문자, 숫자, 특수문자 포함)"
        showPasswordToggle={false}
        required
        error={passwordError}
        size="lg"
        className={INPUT_STYLE}
        containerClassName="w-full"
      />

      <Button
        type="submit"
        btnSize="large"
        btnText="로그인"
        className={BUTTON_STYLE}
      />
    </form>
  )
}
