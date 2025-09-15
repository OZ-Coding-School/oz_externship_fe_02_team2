import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import TestHub from '../pages/test/TestHub'
import { testPages } from '../test-hub/registry'

export default function TestRoutes() {
  return (
    <Routes>
      {/* 로그인 x: 무조건 /login && 로그인 o: 루트는 /dashboard */}
      <Route path="/" element={<Navigate to="/test-hub" replace />} />
      <Route path="/test-hub/*" element={<TestHub />}>
        {testPages.map((p) => {
          const Page = lazy(p.loader)
          return (
            <Route
              key={p.key}
              path={p.route.slice(1)}
              element={
                <Suspense fallback={<div className="p-6">Loading…</div>}>
                  <Page />
                </Suspense>
              }
            />
          )
        })}
        <Route path="*" element={<div className="p-6">Not Found</div>} />
      </Route>
    </Routes>
  )
}
