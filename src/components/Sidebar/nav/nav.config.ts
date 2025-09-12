// 아이콘/라벨 정의만 모음

import type { NavSectionDef } from './nav.types'

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

export const NAV_SECTIONS: readonly NavSectionDef[] = [
  {
    id: 'members',
    label: '회원 관리',
    icon: Members,
    items: [
      {
        key: 'users',
        label: '유저 관리',
        defaultIcon: UsersD,
        activeIcon: UsersA,
      },
      {
        key: 'withdrawals',
        label: '탈퇴 관리',
        defaultIcon: WithdrawalsD,
        activeIcon: WithdrawalsA,
      },
      {
        key: 'dashboard',
        label: '대시보드',
        defaultIcon: DashboardD,
        activeIcon: DashboardA,
      },
    ],
  },
  {
    id: 'studies',
    label: '스터디 관리',
    icon: Studies,
    items: [
      {
        key: 'lectures',
        label: '강의 관리',
        defaultIcon: LecturesD,
        activeIcon: LecturesA,
      },
      {
        key: 'studygroups',
        label: '스터디 그룹 관리',
        defaultIcon: StudyGroupsD,
        activeIcon: StudyGroupsA,
      },
      {
        key: 'reviews',
        label: '리뷰 관리',
        defaultIcon: ReviewsD,
        activeIcon: ReviewsA,
      },
    ],
  },
  {
    id: 'recruits',
    label: '스터디 구인 공고 관리',
    icon: Recruits,
    items: [
      {
        key: 'posts',
        label: '공고 관리',
        defaultIcon: PostsD,
        activeIcon: PostsA,
      },
      {
        key: 'applications',
        label: '지원 내역 관리',
        defaultIcon: ApplicationsD,
        activeIcon: ApplicationsA,
      },
    ],
  },
] as const
