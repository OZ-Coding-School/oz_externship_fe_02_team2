/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiFetch } from './client'

export type ListParams = {
  page_size?: number
  cursor?: string | null
  q?: string
  sort?: string // e.g., -created_at
  status?: 'active' | 'inactive' | 'archived'
  created_from?: string
  created_to?: string
}

export async function list(resource: string, params: ListParams = {}) {
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    usp.set(k, String(v))
  })
  return apiFetch(`/admin/${resource}?` + usp.toString())
}

export async function get(resource: string, id: number | string) {
  return apiFetch(`/admin/${resource}/${id}`)
}

export async function create(resource: string, payload: any) {
  return apiFetch(`/admin/${resource}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function patch(
  resource: string,
  id: number | string,
  payload: any
) {
  return apiFetch(`/admin/${resource}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function remove(resource: string, id: number | string) {
  return apiFetch(`/admin/${resource}/${id}`, { method: 'DELETE' })
}

export async function bulkDelete(resource: string, ids: Array<number>) {
  return apiFetch(`/admin/${resource}/bulk-delete`, {
    method: 'POST',
    body: JSON.stringify({ ids }),
  })
}

export async function bulkUpdateStatus(
  resource: string,
  ids: Array<number>,
  status: 'active' | 'inactive' | 'archived'
) {
  return apiFetch(`/admin/${resource}/bulk-update-status`, {
    method: 'POST',
    body: JSON.stringify({ ids, status }),
  })
}

export async function login(
  admin_id: number,
  role: 'admin' | 'superadmin' = 'admin'
) {
  return apiFetch(`/admin/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ admin_id, role }),
  })
}

export async function logout() {
  return apiFetch(`/admin/auth/logout`, { method: 'POST' })
}

export async function presignUpload() {
  return apiFetch(`/admin/uploads/presign`, { method: 'POST' })
}
