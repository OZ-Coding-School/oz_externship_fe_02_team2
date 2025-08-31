type CardProps = {
  title: string
  description: string
}

function Card({ title, description }: CardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

export default function CardTest() {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold">Card 컴포넌트 테스트</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="첫 번째 카드" description="이건 간단한 카드 설명입니다." />
        <Card
          title="두 번째 카드"
          description="여기도 텍스트를 넣을 수 있어요."
        />
      </div>
    </div>
  )
}
