import { useNavigate } from 'react-router-dom'
import { testPages } from '../../test-hub/registry'

export default function TestHub() {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* 좌측: 테스트 페이지 목록 */}
      <aside className="w-72 overflow-y-auto border-r border-gray-200 p-4 dark:border-gray-800">
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Test Pages
        </h3>

        {testPages.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            등록된 테스트 페이지가 없습니다.
            <br />
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">
              src/test-pages/*Test.tsx
            </code>{' '}
            파일을 추가하세요.
          </div>
        ) : (
          <div className="grid gap-2">
            {testPages.map((p) => (
              <button
                key={p.key}
                onClick={() => navigate(p.route)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {p.route}
                </div>
              </button>
            ))}
          </div>
        )}
      </aside>

      {/* 우측: 안내 */}
      <main className="flex-1 p-6">
        <h2 className="mb-1 text-2xl font-bold">컴포넌트 테스트 허브</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          좌측 목록에서 테스트할 컴포넌트를 선택하세요. 파일 추가만으로 자동
          등록됩니다.
        </p>

        <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-700 dark:text-gray-200">
          <li>
            파일 규칙:{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">
              src/test-pages/&lt;Name&gt;Test.tsx
            </code>
          </li>
          <li>
            예:{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">
              ButtonTest.tsx
            </code>{' '}
            → 경로{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">
              /test-pages/button
            </code>
          </li>
          <li>카멜케이스는 자동으로 케밥케이스로 변환됩니다.</li>
        </ul>
      </main>
    </div>
  )
}
