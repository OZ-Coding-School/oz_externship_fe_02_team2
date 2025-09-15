import { Button } from '@/components/ui/Button'
import { TEST_PATHS } from '@/routes/constants'
import { useNavigate } from 'react-router'

export default function TestRoot() {
  const navigate = useNavigate()
  return (
    <main>
      <Button
        onClick={() => navigate(TEST_PATHS.APP)}
        btnStyle="secondary"
        btnText="웹 페이지로"
      />
      <Button
        onClick={() => navigate(TEST_PATHS.TEST)}
        btnStyle="primary"
        btnText="테스트 페이지로"
      />
    </main>
  )
}
