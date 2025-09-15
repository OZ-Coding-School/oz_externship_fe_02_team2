import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import TestHub from '../pages/test/TestHub'
import { testPages } from '../test-hub/registry'
import TestRoot from '@/pages/test/TestRoot'

export default function TestRoutes() {
  return (
    <Routes>
      <Route element={<TestRoot />}>
        <Route element={}></Route>
        <Route element={<TestHub />}>
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
        <Route path="*" element={<div className="p-6">Not Found</div>} />
      </Route>
    </Routes>
  )
}
