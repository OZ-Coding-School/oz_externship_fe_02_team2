import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router'

export default function TestRoot() {
  const navigate = useNavigate()
  return (
    <main>
      <Button btnStyle="secondary" btnText="웹 페이지로" />
      <Button
        onClick={() => navigate()}
        btnStyle="primary"
        btnText="테스트 페이지로"
      />
    </main>
  )
}
