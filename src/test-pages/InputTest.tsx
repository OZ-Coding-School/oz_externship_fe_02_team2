import { useState } from 'react'
import { Input } from '@/components/ui/input/Input'

export default function FormExample() {
  const [email, setEmail] = useState('')
  const [num, setNum] = useState<number | string>('')

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <Input
        label="텍스트 입력"
        placeholder="텍스트를 입력하세요"
        helper="설명 텍스트를 넣을 수 있어요."
      />

      <Input
        type="email"
        label="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@email.com"
        required
        error={
          !email || /.+@.+\..+/.test(email)
            ? ''
            : '이메일 형식이 올바르지 않습니다.'
        }
      />

      <Input
        type="password"
        label="비밀번호"
        placeholder="••••••••"
        showPasswordToggle
        required
      />

      <Input
        type="number"
        label="숫자"
        value={num}
        onChange={(e) => setNum(e.target.value)}
        placeholder="123"
        min={0}
        step={1}
        inputMode="numeric"
      />
    </div>
  )
}
