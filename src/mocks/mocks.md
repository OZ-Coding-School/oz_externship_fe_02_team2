# Admin Mock API Kit (No JWT, Advanced)

요구사항 정의서를 기반으로 **실서비스처럼 작동하는** 어드민 목업 키트다.

- 인증: **JWT 없음**, `admin_id` 및 `role`(cookie/헤더)만 간단 검증
- 커서 페이지네이션: `page_size`, `cursor`
- 검색/필터/정렬: `q`, `status`, `created_from`, `created_to`, `sort=-created_at`
- 검증 에러(422), 과도요청(429), 404/403/401 등 현실적인 응답
- 벌크 작업: `/bulk-delete`, `/bulk-update-status`
- 업로드 프리사인 시뮬레이션: `/admin/uploads/presign` + `PUT https://mock.local/storage/...`
- 리소스별 접근제어(예: users 쓰기 → superadmin)

## 빠른 시작 세팅 (MSW) 다아아아아아 해놧다!!!!

1. 설치

```bash
npm i msw --save-dev
npx msw init public/ --save
```

2. 핸들러 등록

```ts
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { handlers } from './msw.handlers'
export const worker = setupWorker(...handlers)
```

3. 개발 환경에서 시작

```ts
// src/main.tsx
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}
```

4. 로그인 (쿠키 발급)

```ts
import { login } from './src/api/admin'
await login(1, 'superadmin') // admin_id=1, role=superadmin
```

5. 예시 호출

```ts
import * as Admin from './src/api/admin'
const list = await Admin.list('users', {
  page_size: 20,
  sort: '-created_at',
  status: 'active',
})
```

## Vite Dev Proxy (실제 API로 바꾸는 전환 팁)

```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.yourservice.com',
        changeOrigin: true,
      },
    },
  },
})
```

## 여기서 부터 읽을 것.

## 리소스 보호 정책

- 전역 토글: `REQUIRE_ADMIN` (기본: false)
- 개별 보호: `RESOURCE_GUARD`에서 read/write 레벨 지정
  - 예: `users`는 write = `superadmin`

## 폴더 구조

```
db.json
openapi.yaml
src/
  api/
    client.ts
    admin.ts
  hooks/
    useAdminList.ts
  mocks/
    msw.handlers.ts
README.md
```

## 테스트 팁 (Vitest)

```ts
import { setupServer } from 'msw/node'
import { handlers } from './src/mocks/msw.handlers'

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

행동 규약이나 응답 스키마를 더 빡세게 맞출 필요가 있으면 `msw.handlers.ts`만 수정하면 됩니다.

# Admin Mock API 엔드포인트 정리

## 리소스별 엔드포인트

- **강의 관리**
  - `GET /api/admin/lectures` — 강의 목록 조회
  - `POST /api/admin/lectures` — 강의 생성
  - `GET /api/admin/lectures/{id}` — 강의 상세 조회
  - `PATCH /api/admin/lectures/{id}` — 강의 수정
  - `DELETE /api/admin/lectures/{id}` — 강의 삭제
  - `POST /api/admin/lectures/bulk-delete` — 강의 벌크 삭제
  - `POST /api/admin/lectures/bulk-update-status` — 강의 상태 벌크 업데이트

- **회원 관리**
  - `GET /api/admin/users` — 회원 목록 조회
  - `POST /api/admin/users` — 회원 생성
  - `GET /api/admin/users/{id}` — 회원 상세 조회
  - `PATCH /api/admin/users/{id}` — 회원 수정
  - `DELETE /api/admin/users/{id}` — 회원 삭제
  - `POST /api/admin/users/bulk-delete` — 회원 벌크 삭제
  - `POST /api/admin/users/bulk-update-status` — 회원 상태 벌크 업데이트

- **지원 내역 관리**
  - `GET /api/admin/applications`
  - `POST /api/admin/applications`
  - `GET /api/admin/applications/{id}`
  - `PATCH /api/admin/applications/{id}`
  - `DELETE /api/admin/applications/{id}`

- **스터디 구인 공고 관리**
  - `GET /api/admin/study-posts`
  - `POST /api/admin/study-posts`
  - `GET /api/admin/study-posts/{id}`
  - `PATCH /api/admin/study-posts/{id}`
  - `DELETE /api/admin/study-posts/{id}`

- **스터디 그룹 관리**
  - `GET /api/admin/study-groups`
  - `POST /api/admin/study-groups`
  - `GET /api/admin/study-groups/{id}`
  - `PATCH /api/admin/study-groups/{id}`
  - `DELETE /api/admin/study-groups/{id}`

- **스터디 그룹 리뷰 관리**
  - `GET /api/admin/study-reviews`
  - `POST /api/admin/study-reviews`
  - `GET /api/admin/study-reviews/{id}`
  - `PATCH /api/admin/study-reviews/{id}`
  - `DELETE /api/admin/study-reviews/{id}`

---

## 공통 기능

- **목록 파라미터**
  - `page_size`, `cursor`, `q`, `sort` (예: `-created_at`)
  - `status`, `created_from`, `created_to`

- **벌크 작업**
  - `POST /api/admin/{resource}/bulk-delete`
  - `POST /api/admin/{resource}/bulk-update-status`

- **인증 (목업)**
  - `admin_id`, `role` 확인
  - 쿠키(`admin_id`, `role`) 또는 헤더(`X-Admin-Id`, `X-Admin-Role`)로 전달
