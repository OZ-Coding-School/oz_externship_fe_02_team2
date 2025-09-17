import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input/Input'

type FormProps = {
  email: string
  setEmail: (email: string) => void
}

const INPUT_STYLE =
  'placeholder:body-sm h-13 rounded-sm placeholder:tracking-tighter placeholder:text-[#BDBDBD]'

const BUTTON_STYLE =
  'body-base h-13 w-full rounded-sm bg-[#F6A818] font-normal text-white'

export default function Form({ email, setEmail }: FormProps) {
  return (
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
        className={INPUT_STYLE}
        containerClassName="w-full"
      />

      <Input
        type="password"
        placeholder="비밀번호 (6~15자의 영문 대소문자, 숫자, 특수문자 포함)"
        showPasswordToggle={false}
        required
        error={}
        size="lg"
        className={INPUT_STYLE}
        containerClassName="w-full"
      />

      {/* TODO: 로그인 성공/실패 토스트 알림 */}
      <Button
        type="submit"
        btnSize="large"
        btnText="로그인"
        className={BUTTON_STYLE}
      />
    </form>
  )
}
