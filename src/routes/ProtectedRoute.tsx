import { tokenManager } from '@/lib/token'
import { Navigate, Outlet } from 'react-router-dom'

export function ProtectedRoute() {
  const hasToken = tokenManager.hasToken()

  if (!hasToken) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
