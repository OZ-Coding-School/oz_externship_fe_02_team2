import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import TestHub from '../pages/test/TestHub'
import { testPages } from '../test-hub/registry'
import TestRoot from '@/pages/test/TestRoot'
import MainPage from '@/pages/main/MainPage'
import { PATHS } from './constants'
import PlaceHolderPage from '@/pages/main/PlaceHolderPage'
import LoginPage from '@/pages/auth/LoginPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import UserManagePage from '@/pages/admin/UserManage'
import UserWithdrawalPage from '@/pages/admin/UserWithdrawal'
import StudyGroupPage from '@/pages/admin/StudyManage'
import { Join, Leave, Reason } from '@/pages/dashboard/sub-pages'

// TODO: 로그인 O -> MainPage && 로그인 X -> LoginPage 라우팅 가드

// * 수정 시 직관적으로 보이고자 일부러 map 사용 안 했습니다
export default function TestRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TestRoot />}>
        {/* TODO: 로그인 안 한 경우 -> 어디로 접속하든 /login으로 라우팅 가드 */}
        {/* 지금은 테스트용으로 루트경로/login으로 둠 */}
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.APP} element={<MainPage />}>
          {/* /app 진입 시 + 로그인 한 경우 -> 대시보드 페이지 + 회원가입 추세로 */}
          <Route index element={<Navigate to={PATHS.DASHBOARD} replace />} />
          <Route path={PATHS.USER} element={<UserManagePage />} />
          <Route path={PATHS.WITHDRAWAL} element={<UserWithdrawalPage />} />

          {/* /dashboard/:tab */}
          <Route path={PATHS.DASHBOARD} element={<DashboardPage />}>
            <Route index element={<Navigate to="join" replace />} />
            <Route path="join" element={<Join />} />
            <Route path="leave" element={<Leave />} />
            <Route path="reason" element={<Reason />} />
            <Route path="*" element={<Navigate to="join" replace />} />
          </Route>

          <Route path={PATHS.LECTURE} element={<PlaceHolderPage />} />
          <Route path={PATHS.STUDYGROUP} element={<StudyGroupPage />} />
          <Route path={PATHS.REVIEW} element={<PlaceHolderPage />} />

          <Route path={PATHS.POST} element={<PlaceHolderPage />} />
          <Route path={PATHS.APPLICATION} element={<PlaceHolderPage />} />
          <Route path="*" element={<div className="p-6">Not Found</div>} />
        </Route>
        <Route path={PATHS.TEST} element={<TestHub />}>
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
