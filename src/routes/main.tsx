// 언젠가 작성될 메인
import { Routes, Route, Navigate } from 'react-router-dom'

export default function MainApp() {
  return (
    <Routes>
      {/* 현재 메인 페이지 없음 */}
      <Route path="*" element={<Navigate to="/test-hub" replace />} />
    </Routes>
  )
}
