import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TestHub from './pages/test/TestHub'
import { testPages } from './test-hub/registry'

// === 실제 앱 페이지 import (필요한 페이지만 import) ===

// 1) 테스트 페이지 라우트: 한 줄로 삽입할 JSX 배열
const testRoutes = testPages.map((p) => {
  const Page = lazy(p.loader)
  return (
    <Route
      key={p.key}
      path={p.route}
      element={
        <Suspense fallback={<div className="p-6">Loading…</div>}>
          <Page />
        </Suspense>
      }
    />
  )
})

// 2) 실제 앱 라우트: 배열을 map으로 JSX 한 줄 반환
const appRoutes = [
  // { path: '/', element: <Home /> },
  // { path: '/about', element: <About /> },
].map(({ path, element }) => <Route key={path} path={path} element={element} />)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/test-hub" replace />} />
        {/* 허브 진입 */}

        <Route path="/test-hub" element={<TestHub />} />
        {/* 테스트 라우트(한 줄): */}

        {testRoutes}

        {/* 실제 앱 라우트(한 줄): */}
        {appRoutes}

        {/* 기본 이동 & 404 */}
        <Route
          path="/_not-found"
          element={<div className="p-6">Not Found</div>}
        />
        <Route path="*" element={<Navigate to="/_not-found" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
