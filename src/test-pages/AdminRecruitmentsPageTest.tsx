import { Sidebar } from '@/components/Navigation/Sidebar'
import { cn } from '@/lib'
import RecruitmentsTable from '@/pages/AdminRecruitments/AdminRecruitmentsTable'
import { useState } from 'react'

export default function AdminRecruitmentsPage() {
  // 모바일 드로어 열림 상태를 페이지에서 제어 → Sidebar에 props로 넘김
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className={cn('relative flex min-h-screen bg-gray-50')}>
      {/* --- 사이드바 (데스크톱: aside, 모바일: 드로어) --- */}
      <Sidebar
        mobileDrawerOpen={mobileOpen}
        onMobileDrawerOpenChange={setMobileOpen}
      />

      {/* --- 메인 영역 --- */}
      <div className="flex-1">
        <div
          className={cn(
            'sticky top-0 z-40 border-b bg-white/80 backdrop-blur md:hidden'
          )}
        >
          <div className={cn('flex items-center gap-2 p-3')}>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className={cn(
                'inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300'
              )}
              aria-label="사이드바 열기"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M3 7h18M3 12h18M3 17h18"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
            <h1 className="text-base">구인 공고 관리</h1>
          </div>
        </div>

        <main className={cn('px-4 py-6 md:px-8')}>
          <header className={cn('hidden items-center justify-between md:flex')}>
            <h1 className="body-lg">구인 공고 관리</h1>
          </header>
          <section className="mt-4">
            <RecruitmentsTable />
          </section>
        </main>
      </div>
    </div>
  )
}
