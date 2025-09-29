import { Accordion } from '@/components/Navigation/Accordion'
import type { SidebarNavProps } from '../Sidebar.types'
import { NAV_SECTIONS, toAccordionItems } from '../../nav'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { authService } from '@/api/auth/service'
import { tokenManager } from '@/lib/token'
import { useToast } from '@/hooks'
import { useState } from 'react'

export default function Nav({
  expanded,
  active,
  setActive,
  rail,
}: SidebarNavProps) {
  const navigate = useNavigate()
  const { triggerToast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      await authService.logout()
      tokenManager.removeToken()
      triggerToast('success', '로그아웃 완료', '로그인 페이지로 이동합니다.')
      navigate('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      // 로그아웃 실패해도 토큰 제거하고 로그인 페이지로
      tokenManager.removeToken()
      navigate('/admin/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* 메뉴 아코디언 */}
      <div className="flex-1 overflow-y-auto">
        {NAV_SECTIONS.map((section) => (
          <Accordion
            key={section.id}
            icon={section.icon}
            label={section.label}
            rail={rail ?? !expanded}
            items={toAccordionItems(section.items, active, setActive, navigate)}
            storageKey={`accordion:${section.id}`}
          />
        ))}
      </div>

      {/* 로그아웃 버튼 */}
      <div className={expanded ? 'px-2 pt-4 pb-6' : 'px-1 pt-4 pb-6'}>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 ${!expanded ? 'justify-center' : ''} `}
          aria-label="로그아웃"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {expanded && (
            <span>{isLoggingOut ? '로그아웃 중...' : '로그아웃'}</span>
          )}
        </button>
      </div>
    </div>
  )
}
