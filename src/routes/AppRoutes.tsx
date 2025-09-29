// 언젠가 작성될 메인
import LoginPage from '@/pages/auth/LoginPage'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { PATHS } from './constants'
import UserManagePage from '@/pages/admin/UserManage'
import UserWithdrawalPage from '@/pages/admin/UserWithdrawal'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import { Join, Leave, Reason } from '@/pages/dashboard/sub-pages'
import StudyGroupPage from '@/pages/admin/StudyManage'
import ReviewManagement from '@/pages/admin/Review'
import PlaceHolderPage from '@/pages/main/PlaceHolderPage'
import CourseManagementTest from '@/pages/admin/CourseManagement'
import MainPage from '@/pages/main/MainPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* 루트 경로 - 로그인 여부에 따라 리다이렉트 */}
      <Route path="/" element={<Navigate to={`/${PATHS.APP}`} replace />} />

      {/* 로그인 페이지 */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* 보호된 라우트 */}
      <Route element={<ProtectedRoute />}>
        <Route path={`/${PATHS.APP}`} element={<MainPage />}>
          {/* /app 진입 시 대시보드로 리다이렉트 */}
          <Route index element={<Navigate to={PATHS.DASHBOARD} replace />} />

          {/* 회원 관리 */}
          <Route path={PATHS.USER} element={<UserManagePage />} />
          <Route path={PATHS.WITHDRAWAL} element={<UserWithdrawalPage />} />

          {/* 대시보드 */}
          <Route path={PATHS.DASHBOARD} element={<DashboardPage />}>
            <Route index element={<Navigate to="join" replace />} />
            <Route path="join" element={<Join />} />
            <Route path="leave" element={<Leave />} />
            <Route path="reason" element={<Reason />} />
          </Route>

          {/* 관리 페이지들 */}
          <Route path={PATHS.LECTURE} element={<CourseManagementTest />} />
          <Route path={PATHS.STUDYGROUP} element={<StudyGroupPage />} />
          <Route path={PATHS.REVIEW} element={<ReviewManagement />} />
          <Route path={PATHS.POST} element={<PlaceHolderPage />} />
          <Route path={PATHS.APPLICATION} element={<PlaceHolderPage />} />
        </Route>
      </Route>

      {/* 기본 경로 리다이렉트
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      /> */}

      {/* 404 */}
      <Route path="*" element={<div className="p-6">Not Found</div>} />
    </Routes>
  )
}
