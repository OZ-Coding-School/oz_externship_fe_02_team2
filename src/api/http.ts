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
})

export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 15000),
  headers: { 'Content-Type': 'application/json' },
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

    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers = config.headers ?? {}
      ;(config.headers as any).Authorization = `Bearer ${token}`
    }
    return config
  })

  instance.interceptors.response.use(
    (res) => res,
    (err: AxiosError<ApiErrorResponse>) => {
      const status = err.response?.status
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
