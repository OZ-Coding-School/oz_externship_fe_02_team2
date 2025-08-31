# Postman으로 Admin Mock API 확인하기

## 1. Postman Collection 임포트

- 제공된 `postman_collection_full.json` 파일을 Postman에서 불러오자!
- Postman → **Import** → `File` → `postman_collection_full.json` 선택

## 2. 컬렉션 구조

- Auth
  - Login
  - Logout
- Users (CRUD + Bulk)
- Lectures (CRUD + Bulk)
- Applications (CRUD)
- Study Posts (CRUD)
- Study Groups (CRUD)
- Study Reviews (CRUD)

## 3. 로컬 서버 준비 (선택 사항)

MSW는 브라우저 안에서만 동작하므로 Postman에서는 요청이 차단됨!!
Postman으로 직접 테스트하려면 간단한 로컬 API 서버를 띄워야 함!

### json-server 설치 및 실행

```bash
npm i -D json-server
npx json-server --watch db.json --routes routes.json --port 5178
```

### routes.json 예시

```json
{
  "/api/admin/lectures": "/lectures",
  "/api/admin/lectures/:id": "/lectures/:id",

  "/api/admin/users": "/users",
  "/api/admin/users/:id": "/users/:id",

  "/api/admin/applications": "/applications",
  "/api/admin/applications/:id": "/applications/:id",

  "/api/admin/study-posts": "/study-posts",
  "/api/admin/study-posts/:id": "/study-posts/:id",

  "/api/admin/study-groups": "/study-groups",
  "/api/admin/study-groups/:id": "/study-groups/:id",

  "/api/admin/study-reviews": "/study-reviews",
  "/api/admin/study-reviews/:id": "/study-reviews/:id"
}
```

서버가 뜨면 Postman에서 `http://localhost:5178/api/admin/...` 으로 요청 보내기 가능!

## 4. 요청 실행 순서

1. **Auth → Login** 실행

   - Body: `{ "admin_id": 1, "role": "superadmin" }`
   - (json-server에는 인증 로직은 없지만 컬렉션에 형식상 포함)

2. **Users → List Users** 실행

   - `GET http://localhost:5178/api/admin/users?page_size=10&sort=-created_at`

3. **다른 리소스 요청**
   - Lectures, Applications, Study Posts, Study Groups, Study Reviews에서
   - Create / Update / Delete 동작 테스트

## 5. 참고

- json-server에는 인증 가드가 없으므로 Postman에서는 바로 CRUD 확인만....
- 실제 인증 시뮬레이션은 브라우저 + MSW 환경에서만 확인..

본 문서는 api 동작 확인만을 위한 것이며 실 동작은 컴포넌트를 만들고 확인할 것.
