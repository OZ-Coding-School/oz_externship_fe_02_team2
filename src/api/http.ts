import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'

// ─────────────────────────────────────────────────────────────────────────────
// 에러 공통 타입/클래스
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiErrorShape {
  status?: number
  code?: string
  message: string
  cause?: unknown
}

// 서버 표준 에러 응답 형태(메시지/코드만 사용)
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

// ─────────────────────────────────────────────────────────────────────────────
// 기본 axios 클라이언트
// ─────────────────────────────────────────────────────────────────────────────

export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 15000),
  headers: { 'Content-Type': 'application/json' },
})

// 요청 인터셉터: 필요 시 관리자 키/토큰 등 삽입
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // 예) config.headers.set('X-ADMIN-KEY', '...')  // AxiosHeaders 사용 시
  return config
})

// 응답 인터셉터: 에러 정규화 (서버 에러 응답을 ApiError로 변환)
http.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiErrorResponse>) => {
    const status = err.response?.status
    const data = err.response?.data // ApiErrorResponse | undefined
    throw new ApiError(data?.message || err.message || 'Request failed', {
      status,
      code: data?.code,
      cause: err,
    })
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// MSW 바이패스 헬퍼
// - 요청 헤더에 'x-bypass-mock: 1'을 넣어 MSW를 우회할 수 있게 함
// - Axios v1의 헤더 타입(AxiosHeaders/Plain Object) 모두 안전 처리
// ─────────────────────────────────────────────────────────────────────────────

export function withBypass(
  config: AxiosRequestConfig = {},
  bypass = false
): AxiosRequestConfig {
  // config.headers는 RawAxiosRequestHeaders | AxiosHeaders | undefined
  // from()이 원하는 RawAxiosHeaders로 안전 캐스팅
  const headers = AxiosHeaders.from((config.headers as AxiosHeaders) ?? {})

  if (bypass) headers.set('x-bypass-mock', '1')
  else headers.delete('x-bypass-mock')

  return { ...config, headers }
}
