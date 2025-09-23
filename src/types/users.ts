export type UserRole = 'superadmin' | 'admin' | 'staff' | 'user'

export interface UserDetail {
  id: string
  email: string
  name: string
  role: UserRole
  status: 'active' | 'deleted'
  createdAt: string
  updatedAt: string
}

export type UserPatch = Partial<Pick<UserDetail, 'name' | 'role' | 'status'>>
