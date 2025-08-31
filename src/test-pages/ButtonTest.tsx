import { useState } from 'react'

export default function ButtonTest() {
  const [count, setCount] = useState(0)

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold">Button 컴포넌트 테스트</h2>
      <p className="text-gray-600">버튼을 눌러 카운트를 확인하세요.</p>

      <button
        onClick={() => setCount((c) => c + 1)}
        className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
      >
        클릭 횟수: {count}
      </button>

      <button
        disabled
        className="rounded-lg bg-gray-400 px-4 py-2 font-semibold text-white"
      >
        비활성 버튼
      </button>
    </div>
  )
}
