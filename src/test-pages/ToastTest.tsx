import { useToast } from '@/hooks'
import type { ToastProps } from '@/types'
import { Button, type ButtonStyle } from '@components/ui/Button'

export default function ToastTest() {
  const { triggerToast } = useToast()

  const toastConfigs = [
    { style: 'primary', type: 'info' },
    { style: 'success', type: 'success' },
    { style: 'warning', type: 'warning' },
    { style: 'danger', type: 'error' },
  ] as const satisfies readonly {
    style: ButtonStyle
    type: ToastProps['type']
  }[]

  return (
    <section className="h-screen space-y-4 p-6">
      <h3>Toast 컴포넌트 테스트</h3>
      <p className="body-sm">
        버튼을 눌러 종류별 토스트 알림을 확인하세요.
        <br />
        원활한 테스트를 위해 버튼들은 화면 수직 중앙보다 아래에 배치했습니다.
      </p>

      <article className="mt-120 flex flex-col gap-3">
        <h4>토스트 알림 트리거 버튼</h4>
        <div className="flex gap-3">
          {toastConfigs.map(({ style, type }) => (
            <Button
              key={type}
              btnStyle={style}
              btnSize="medium"
              btnText={`${type} 토스트 알림`}
              onClick={() => triggerToast(type)}
            />
          ))}
        </div>
      </article>
    </section>
  )
}
