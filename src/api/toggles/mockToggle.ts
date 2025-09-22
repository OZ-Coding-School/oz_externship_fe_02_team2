// 전역 모드 정의
export type MockMode = 'auto' | 'mock' | 'real'
//  - auto: 기본값. MSW가 켜져 있으면 목업이 가로채고, 아니면 실서버로 나감
//  - mock: 전역으로 목업 강제 (바이패스 금지)
//  - real: 전역으로 실서버 강제 (모든 요청에 바이패스 헤더 삽입)

let mode: MockMode = (import.meta.env.VITE_API_MODE as MockMode) || 'auto'

export function setMockMode(next: MockMode) {
  mode = next
}

export function getMockMode(): MockMode {
  return mode
}

// 호출 단위 mock 옵션을 우선 고려하여, 바이패스 여부 결정
export function decideBypass(perCallMock?: boolean): boolean {
  // 1) 호출 단위가 최우선
  if (typeof perCallMock === 'boolean') return perCallMock ? false : true
  // 2) 전역 모드
  if (mode === 'real') return true
  if (mode === 'mock') return false
  // 3) auto: 명시적 바이패스 없음 (MSW가 실행 중이면 잡고, 아니면 그냥 실서버로)
  return false
}
