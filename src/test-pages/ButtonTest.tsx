import Button from '@components/common/Button/Button'
import { useState } from 'react'

export default function ButtonTest() {
  const [count, setCount] = useState(0)

  return (
    <div className="space-y-4 bg-white p-6">
      <h2 className="text-xl font-bold">Button 컴포넌트 테스트</h2>
      <p className="text-gray-600">버튼을 눌러 카운트를 확인하세요.</p>

      {/* 종류(스타일)별 버튼 */}
      <Button
        btnStyle="primary"
        btnSize="medium"
        btnText={`클릭 횟수: ${count}`}
        onClick={() => setCount((c) => c + 1)}
      />
      <Button
        btnStyle="secondary"
        btnSize="medium"
        btnText={`클릭 횟수: ${count}`}
        onClick={() => setCount((c) => c + 1)}
      />
      <Button
        btnStyle="success"
        btnSize="medium"
        btnText={`클릭 횟수: ${count}`}
        onClick={() => setCount((c) => c + 1)}
      />
      <Button
        btnStyle="danger"
        btnSize="medium"
        btnText={`클릭 횟수: ${count}`}
        onClick={() => setCount((c) => c + 1)}
      />
      <Button
        btnStyle="warning"
        btnSize="medium"
        btnText={`클릭 횟수: ${count}`}
        onClick={() => setCount((c) => c + 1)}
      />
      <Button
        btnStyle="cancel"
        btnSize="medium"
        btnText={`클릭 횟수: ${count}`}
        onClick={() => setCount((c) => c + 1)}
      />

      {/* 사이즈별 버튼 */}
      <Button
        btnStyle="primary"
        btnSize="large"
        btnText={`클릭 횟수: ${count}`}
        onClick={() => setCount((c) => c + 1)}
      />
      <Button
        btnStyle="primary"
        btnSize="medium"
        btnText={`클릭 횟수: ${count}`}
        onClick={() => setCount((c) => c + 1)}
      />
      <Button
        btnStyle="primary"
        btnSize="small"
        btnText={`클릭 횟수: ${count}`}
        onClick={() => setCount((c) => c + 1)}
      />

      {/* 비활성 버튼 */}
      <Button
        btnStyle="primary"
        btnSize="large"
        btnText={`클릭 횟수: ${count}`}
        onClick={() => setCount((c) => c + 1)}
        disabled
      />
    </div>
  )
}
