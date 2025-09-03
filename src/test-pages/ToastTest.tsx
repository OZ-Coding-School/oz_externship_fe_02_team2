import { Button } from '@components/ui/Button'

export default function ToastTest() {
  const handleClick = () => {}

  return (
    <section className="h-screen space-y-4 p-6">
      <h3>Toast 컴포넌트 테스트</h3>
      <p className="body-sm">버튼을 눌러 종류별 토스트 알림을 확인하세요.</p>

      <article className="mb-6 flex flex-col gap-1">
        <h4>토스트 알림 트리거 버튼</h4>
        <div className="flex gap-3">
          <Button
            btnStyle="primary"
            btnSize="medium"
            btnText={`info 토스트 알림`}
            onClick={handleClick}
          />
          <Button
            btnStyle="success"
            btnSize="medium"
            btnText={`success 토스트 알림`}
            onClick={handleClick}
          />
          <Button
            btnStyle="warning"
            btnSize="medium"
            btnText={`warning 토스트 알림`}
            onClick={handleClick}
          />
          <Button
            btnStyle="danger"
            btnSize="medium"
            btnText={`error 토스트 알림`}
            onClick={handleClick}
          />
        </div>
      </article>
    </section>
  )
}
