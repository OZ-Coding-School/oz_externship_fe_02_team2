/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'

// ───────────────────────────────────────────────
// 에러 공통 타입/클래스
// ───────────────────────────────────────────────
export interface ApiErrorShape {
  status?: number
  code?: string
  message: string
  cause?: unknown
}

export type ApiErrorResponse = {
  message?: string
  code?: string
}

export class ApiError extends Error implements ApiErrorShape {
  status?: number
  code?: string
  cause?: unknown
  constructor(message: string, init?: Partial<ApiErrorShape>) {
    super(message)
    Object.assign(this, init)
    this.name = 'ApiError'
  }
}

// ───────────────────────────────────────────────
// 동일 오리진 판정 & 바이패스 유틸
// ───────────────────────────────────────────────
function isSameOriginBaseURL(baseURL?: string): boolean {
  if (!baseURL || baseURL.startsWith('/')) return true
  try {
    const u = new URL(baseURL)
    return typeof window !== 'undefined' && u.origin === window.location.origin
  } catch {
    return false
  }
}

/**
 * MSW 사용 여부 결정
 * @param forceMock true면 MSW 사용 강제, false면 실서버 사용 강제
 * @returns true면 MSW 사용, false면 실서버 사용
 */
export function shouldUseMock(forceMock?: boolean): boolean {
  // 명시적으로 mock 사용 지정
  if (forceMock === true) return true
  // 명시적으로 실서버 사용 지정
  if (forceMock === false) return false

  // 기본값: 개발 환경 + VITE_USE_MSW="true"일 때만 MSW 사용
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MSW === 'true') {
    return true
  }
  return false
}

/**
 * x-bypass-mock 헤더 설정
 * - bypass = true: MSW를 우회하고 실제 서버로 요청 (헤더 추가)
 * - bypass = false: MSW가 요청을 가로챔 (헤더 제거)
 */
export function withBypass(
  config: AxiosRequestConfig = {},
  useMock = false
): AxiosRequestConfig {
  const headers = AxiosHeaders.from((config.headers as AxiosHeaders) ?? {})
  const reqBaseURL = (config as any).baseURL

  // useMock이 false이고 동일 오리진이면 MSW 우회 (실서버로 요청)
  if (!useMock && isSameOriginBaseURL(reqBaseURL)) {
    headers.set('x-bypass-mock', '1')
  } else {
    // useMock이 true면 MSW가 처리하도록 헤더 제거
    headers.delete('x-bypass-mock')
  }
  return { ...config, headers }
}

// ───────────────────────────────────────────────
// 토큰 갱신 로직
// ───────────────────────────────────────────────
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token!)
    }
  })
  failedQueue = []
}

async function refreshAccessToken(): Promise<string> {
  try {
    // 리프레시 토큰으로 새로운 액세스 토큰 요청
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL1}/auth/refresh`,
      {},
      { withCredentials: true } // 쿠키의 refresh token 사용
    )

    const newToken = response.data.access_token
    localStorage.setItem('access_token', newToken)
    return newToken
  } catch (error) {
    // 리프레시 실패 시 로그인 페이지로 리다이렉트
    localStorage.removeItem('access_token')
    window.location.href = '/admin/login'
    throw error
  }
}

// ───────────────────────────────────────────────
// Axios 인스턴스
// ───────────────────────────────────────────────

/**
 * dev: '/api' → VITE_API_BASE_URL (.env)
 * prod: 실제 서버 → VITE_API_BASE_URL1 (.env)
 */
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL1,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 15000),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // 쿠키 포함 (리프레시 토큰용)
})

export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 15000),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // 쿠키 포함
})

// ───────────────────────────────────────────────
// 공통 인터셉터
// ───────────────────────────────────────────────
function installInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const finalBase = config.baseURL ?? instance.defaults.baseURL ?? ''
    const finalUrl = (finalBase ?? '') + (config.url ?? '')

    const isProdApi =
      typeof finalUrl === 'string' && finalUrl.includes('api.ozcoding.site')
    if (isProdApi) {
      delete (config.headers as any)['x-bypass-mock']
      delete (config.headers as any)['X-Bypass-Mock']
    }

    // 로그인/회원가입 등 인증이 필요 없는 엔드포인트 제외
    const isAuthEndpoint =
      config.url?.includes('/auth/email/login') ||
      config.url?.includes('/auth/email/signup') ||
      config.url?.includes('/auth/email/send-code') ||
      config.url?.includes('/auth/email/verify') ||
      config.url?.includes('/auth/phone/send-code') ||
      config.url?.includes('/auth/phone/verify') ||
      config.url?.includes('/auth/kakao/callback') ||
      config.url?.includes('/auth/naver/callback')

    // 인증이 필요한 엔드포인트에만 토큰 추가
    if (!isAuthEndpoint) {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`)
      }
    }

    // 디버깅용 로그 (개발 중에만)
    if (import.meta.env.DEV) {
      console.log('Request URL:', finalUrl)
      console.log('Is Auth Endpoint:', isAuthEndpoint)
      console.log('Authorization:', config.headers.get('Authorization'))
    }

    return config
  })

  // Response 인터셉터 (토큰 갱신 로직 포함)
  instance.interceptors.response.use(
    (res) => res,
    async (err: AxiosError<ApiErrorResponse>) => {
      const originalRequest = err.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }
      const status = err.response?.status

      // 401 에러이고, 아직 재시도하지 않은 요청인 경우
      if (status === 401 && originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
          // 이미 토큰 갱신 중이면 큐에 추가
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers.set('Authorization', `Bearer ${token}`)
              return instance(originalRequest)
            })
            .catch((error) => {
              return Promise.reject(error)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const newToken = await refreshAccessToken()
          processQueue(null, newToken)

          // 원래 요청에 새 토큰 적용 후 재시도
          originalRequest.headers.set('Authorization', `Bearer ${newToken}`)
          return instance(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      // 401이 아니거나 재시도 후에도 실패한 경우
      const data = err.response?.data
      throw new ApiError(data?.message || err.message || 'Request failed', {
        status,
        code: data?.code,
        cause: err,
      })
    }
  )
}

installInterceptors(api)
installInterceptors(http)
