import { useEffect, useMemo, useState } from 'react'
import type { SidebarProps } from './Sidebar.types'
import { DesktopAside, MobileDrawer } from './parts'
import { Accordion } from '@components/ui/Accordion'

import Members from '@assets/icons/nav_member.svg'
import UsersD from '@assets/icons/nav_member_users_default.svg'
import UsersA from '@assets/icons/nav_member_users_active.svg'
import WithdrawalsD from '@assets/icons/nav_member_withdraw_default.svg'
import WithdrawalsA from '@assets/icons/nav_member_withdraw_active.svg'
import DashboardD from '@assets/icons/nav_member_dashboard_default.svg'
import DashboardA from '@assets/icons/nav_member_dashboard_active.svg'

import Studies from '@assets/icons/nav_study.svg'
import LecturesD from '@assets/icons/nav_study_lectures_default.svg'
import LecturesA from '@assets/icons/nav_study_lectures_active.svg'
import StudyGroupsD from '@assets/icons/nav_study_groups_default.svg'
import StudyGroupsA from '@assets/icons/nav_study_groups_active.svg'
import ReviewsD from '@assets/icons/nav_study_reviews_default.svg'
import ReviewsA from '@assets/icons/nav_study_reviews_active.svg'

import Recruits from '@assets/icons/nav_recruit.svg'
import PostsD from '@assets/icons/nav_recruit_posts_default.svg'
import PostsA from '@assets/icons/nav_recruit_posts_active.svg'
import ApplicationsD from '@assets/icons/nav_recruit_join_default.svg'
import ApplicationsA from '@assets/icons/nav_recruit_join_active.svg'

// import { useNavigate } from 'react-router'

type ActiveKey =
  | 'users'
  | 'withdrawals'
  | 'dashboard'
  | 'lectures'
  | 'studygroups'
  | 'reviews'
  | 'posts'
  | 'applications'

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
  const [activeMenu, setActiveMenu] = useState<ActiveKey | null>()

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

  const studyDefs = useMemo(
    () => [
      {
        key: 'lectures' as const,
        defaultIcon: LecturesD,
        activeIcon: LecturesA,
        label: '강의 관리',
      },
      {
        key: 'studygroups' as const,
        defaultIcon: StudyGroupsD,
        activeIcon: StudyGroupsA,
        label: '스터디 그룹 관리',
      },
      {
        key: 'reviews' as const,
        defaultIcon: ReviewsD,
        activeIcon: ReviewsA,
        label: '리뷰 관리',
      },
    ],
    []
  )

  const studyItems = useMemo(
    () =>
      studyDefs.map((def) => ({
        defaultIcon: def.defaultIcon,
        activeIcon: def.activeIcon,
        label: def.label,
        active: activeMenu === def.key,
        onClick: () => setActiveMenu(def.key),
      })),
    [studyDefs, activeMenu]
  )

  const recruitDefs = useMemo(
    () => [
      {
        key: 'posts' as const,
        defaultIcon: PostsD,
        activeIcon: PostsA,
        label: '공고 관리',
      },
      {
        key: 'applications' as const,
        defaultIcon: ApplicationsD,
        activeIcon: ApplicationsA,
        label: '지원 내역 관리',
      },
    ],
    []
  )

  const recruitItems = useMemo(
    () =>
      recruitDefs.map((def) => ({
        defaultIcon: def.defaultIcon,
        activeIcon: def.activeIcon,
        label: def.label,
        active: activeMenu === def.key,
        onClick: () => setActiveMenu(def.key),
      })),
    [recruitDefs, activeMenu]
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
        <Accordion
          icon={Studies}
          label={'스터디 관리'}
          rail={!expanded}
          items={studyItems}
        />
        <Accordion
          icon={Recruits}
          label={'스터디 구인 공고 관리'}
          rail={!expanded}
          items={recruitItems}
        />
      </DesktopAside>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        scope={scope}
      >
        <Accordion icon={Members} label={'회원 관리'} items={memberItems} />
        <Accordion icon={Studies} label={'스터디 관리'} items={studyItems} />
        <Accordion
          icon={Recruits}
          label={'스터디 구인 공고 관리'}
          items={recruitItems}
        />
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
