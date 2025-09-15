// 언젠가 작성될 메인
import { Routes, Route, Navigate } from 'react-router-dom'

export default function AppRoutes() {
  return (
    <Routes>
      {/* 로그인 x: 무조건 /login && 로그인 o: 루트는 /dashboard */}
      {/* 현재 메인 페이지 없음 */}
      <Route path="*" element={<Navigate to="/test-hub" replace />} />
    </Routes>
  )
}
