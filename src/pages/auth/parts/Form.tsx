import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input/Input'
import { validateEmail, validatePassword } from '@/lib'
import { authService } from '@/api/auth/service'
import { ApiError } from '@/api/http'
import { useMemo, useState, type FormEventHandler } from 'react'
import { useToast } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/routes/constants'

const INPUT_STYLE =
  'placeholder:body-sm h-13 rounded-sm placeholder:tracking-tighter placeholder:text-[#BDBDBD]'

const BUTTON_STYLE =
  'body-base h-13 w-full rounded-sm bg-[#F6A818] font-normal text-white disabled:opacity-50 disabled:cursor-not-allowed'

export default function Form() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const emailError = useMemo(() => validateEmail(email), [email])
  const passwordError = useMemo(() => validatePassword(password), [password])

  const { triggerToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    // 클라이언트 측 유효성 검사
    if (emailError || passwordError || !email || !password) {
      triggerToast(
        'error',
        '로그인 실패',
        '이메일 또는 비밀번호를 다시 확인해 주세요.'
      )
      return
    }

    setIsLoading(true)

    try {
      // API 호출 - service.ts에서 자동으로 토큰 저장됨
      await authService.login({ email, password })

      // 성공 토스트
      triggerToast('success', '로그인 성공', '회원 관리 페이지로 이동합니다.')

      // 회원 관리 페이지로 이동
      navigate(`/${PATHS.APP}/${PATHS.USER}`)
    } catch (error) {
      // ApiError 처리
      if (error instanceof ApiError) {
        const errorMessage =
          error.status === 401
            ? '이메일 또는 비밀번호가 일치하지 않습니다.'
            : error.status === 400
              ? '잘못된 요청입니다. 입력 정보를 확인해 주세요.'
              : error.message || '로그인 중 오류가 발생했습니다.'

        triggerToast('error', '로그인 실패', errorMessage)
      } else {
        // 예상치 못한 에러
        triggerToast(
          'error',
          '로그인 실패',
          '네트워크 오류가 발생했습니다. 다시 시도해 주세요.'
        )
      }
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      noValidate
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
        disabled={isLoading}
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
        disabled={isLoading}
      />

      <Button
        type="submit"
        btnSize="large"
        btnText={isLoading ? '로그인 중...' : '로그인'}
        className={BUTTON_STYLE}
        disabled={isLoading}
      />
    </form>
  )
}
