import { useEffect, useMemo, useState } from 'react'
import type { SidebarProps } from './Sidebar.types'
import DesktopAside from './DesktopAside'
import MobileDrawer from './MobileDrawer'
import Accordion from '../ui/Accordion/Accordion'

import Members from '@assets/icons/nav_member.svg'
import UsersD from '@assets/icons/nav_member_users_default.svg'
import UsersA from '@assets/icons/nav_member_users_active.svg'
import WithdrawalsD from '@assets/icons/nav_member_withdraw_default.svg'
import WithdrawalsA from '@assets/icons/nav_member_withdraw_active.svg'
import DashboardD from '@assets/icons/nav_member_dashboard_default.svg'
import DashboardA from '@assets/icons/nav_member_dashboard_active.svg'

// import { useNavigate } from 'react-router'

type MemberKey = 'users' | 'withdrawals' | 'dashboard'

export default function Sidebar({
  mobileDrawerOpen,
  onMobileDrawerOpenChange,
  scope = 'container',
}: SidebarProps) {
  // const navigate = useNavigate()

  const [expanded, setExpanded] = useState(true) // ≥md: Expanded↔Rail
  const [internalOpen, setInternalOpen] = useState(false) // <md: Drawer
  const drawerOpen = mobileDrawerOpen ?? internalOpen
  const setDrawerOpen = onMobileDrawerOpenChange ?? setInternalOpen

  // TODO: 경로에 따라 하위 메뉴 active 상태 결정
  const [activeMenu, setActiveMenu] = useState<MemberKey | null>()

  // 드로어 오버레이 열린 경우 바디 스크롤 잠금 (viewport 스코프일 때만)
  useEffect(() => {
    if (!drawerOpen) return
    if (scope !== 'viewport') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [drawerOpen, scope])

  /** 회원 관리의 하위 메뉴들 아이콘/라벨 정의 */
  const memberDefs = useMemo(
    () => [
      {
        key: 'users' as const,
        defaultIcon: UsersD,
        activeIcon: UsersA,
        label: '유저 관리',
      },
      {
        key: 'withdrawals' as const,
        defaultIcon: WithdrawalsD,
        activeIcon: WithdrawalsA,
        label: '탈퇴 관리',
      },
      {
        key: 'dashboard' as const,
        defaultIcon: DashboardD,
        activeIcon: DashboardA,
        label: '대시보드',
      },
    ],
    []
  )

  const memberItems = useMemo(
    () =>
      memberDefs.map((def) => ({
        defaultIcon: def.defaultIcon,
        activeIcon: def.activeIcon,
        label: def.label,
        active: activeMenu === def.key,
        onClick: () => setActiveMenu(def.key), // 하나만 활성화
      })),
    [memberDefs, activeMenu]
  )

  return (
    <>
      <DesktopAside
        expanded={expanded}
        onToggle={() => setExpanded((expanded) => !expanded)}
      >
        {/* TODO: 상위 메뉴 열고 접은 상태 유지 */}
        <Accordion
          icon={Members}
          label={'회원 관리'}
          rail={!expanded}
          items={memberItems}
        />
      </DesktopAside>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        scope={scope}
      >
        아코디언 메뉴
      </MobileDrawer>
    </>
  )
}

// [
//   {
//     defaultIcon: UsersD,
//     activeIcon: UsersA,
//     label: '유저 관리',
//     onClick: () => {
//       // TODO: 현재 경로에 따라 active 상태 매핑 + 그냥 메인으로 들어왔을 경우 최상단 /users로
//       // navigate('/users')
//     },
//   },
//   {
//     defaultIcon: WithdrawalsD,
//     activeIcon: WithdrawalsA,
//     label: '탈퇴 관리',
//     onClick: () => {
//       // no-op yet
//       // navigate('/withdrawals')
//     },
//   },
//   {
//     defaultIcon: DashboardD,
//     activeIcon: DashboardA,
//     label: '대시보드',
//     onClick: () => {
//       // no-op yet
//       // navigate('/dashboard')
//     },
//   },
// ]
