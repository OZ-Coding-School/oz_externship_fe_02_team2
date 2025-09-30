import { api } from '@/api/http'
import { tokenManager } from '@lib/token'
import type { AxiosResponse } from 'axios'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
}

export interface UserInfo {
  uuid: string
  email: string
  name: string
  nickname: string
  permission: string | null
  is_active: boolean
}

export const authService = {
  /**
   * 이메일 로그인
   * POST /api/v1/auth/email/login/
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response: AxiosResponse<LoginResponse> = await api.post(
      '/api/v1/auth/email/login/',
      credentials
    )

    // 토큰 자동 저장
    if (response.data.access_token) {
      tokenManager.setToken(response.data.access_token)
    }

    return response.data
  },

  /**
   * 로그아웃
   * POST /api/v1/auth/logout
   * 쿠키에 저장된 리프레시 토큰을 사용하여 로그아웃 처리
   */
  logout: async (): Promise<void> => {
    await api.post('/api/v1/auth/logout/')
    // 로컬 토큰 삭제
    tokenManager.removeToken()
  },

  /**
   * 액세스 토큰 재발급
   * POST /api/v1/auth/refresh
   * 쿠키에 있는 리프레시 토큰으로 액세스토큰 재발급
   */
  refreshToken: async (): Promise<LoginResponse> => {
    const response: AxiosResponse<LoginResponse> = await api.post(
      '/api/v1/auth/refresh/'
    )

    // 새 토큰 저장
    if (response.data.access_token) {
      tokenManager.setToken(response.data.access_token)
    }

    return response.data
  },

  /**
   * 내 정보 조회
   * GET /api/v1/info/
   */
  getMyInfo: async (): Promise<UserInfo> => {
    const response: AxiosResponse<UserInfo> = await api.get('/api/v1/info/')
    return response.data
  },
}
