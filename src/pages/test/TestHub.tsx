import { Suspense, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { testPages } from '../../test-hub/registry'

export default function TestHub() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // /test-hub 진입 시 첫 번째 테스트 페이지로 자동 이동
  useEffect(() => {
    if (pathname === '/test-hub' && testPages.length > 0) {
      navigate(`/test-hub${testPages[0].route}`, { replace: true })
    }
  }, [pathname, navigate])

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* 좌측 목록 */}
      <aside className="w-72 overflow-y-auto border-r border-gray-200 p-4 dark:border-gray-800">
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Test Pages
        </h3>

        {testPages.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            테스트 파일을 추가하세요:{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">
              src/test-pages/*Test.tsx
            </code>
          </div>
        ) : (
          <div className="grid gap-2">
            {testPages.map((p) => {
              const active = pathname === `/test-hub${p.route}`
              return (
                <button
                  key={p.key}
                  onClick={() => navigate(`/test-hub${p.route}`)}
                  className={[
                    'w-full rounded-xl border px-3 py-2 text-left shadow-sm transition',
                    active
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-950',
                  ].join(' ')}
                >
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {p.route}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </aside>

      {/* 우측 패널: 현재 선택된 테스트 페이지만 렌더 */}
      <main className="flex-1 overflow-auto">
        <Suspense fallback={<div className="p-6">Loading…</div>}>
          {/* 경로 변경 시 확실히 새로 렌더되도록 key 부여 */}
          <Outlet key={pathname} />
        </Suspense>
      </main>
    </div>
  )
}
