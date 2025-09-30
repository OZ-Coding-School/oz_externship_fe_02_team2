# StudyHub Admin Page 프로젝트

> **온라인 교육 환경의 변화에 따른 관리 시스템 필요성** – 온라인 강의와 스터디 운영이 증가하는 교육 환경에서 회원, 스터디, 공고를 효율적으로 관리할 수 있는 통합 시스템이 필요하다고 판단되어 구상 프로젝트입니다.  

[👉 프론트엔드 레포 바로가기](https://github.com/OZ-Coding-School/oz_externship_fe_02_team2)

---

## 📌 프로젝트 개요
현재 온라인 교육과 스터디 운영이 점점 증가하는 교육환경에서 이를 관리하기 위한 시스템의 필요성이 제기 되었습니다.  
이를 해결하기 위해 **데이터 기반 의사 결정을 위한 통계 시각화 도구**를 도입하여,
회원, 스터디, 공고를 효율적으로 관리할 수 있는 통합 시스템을 개발 합니다.

---

## :link: 배포 링크

> ### [StudyHub Admin](https://admin.ozcoding.site/)

---

## 🗣️ 프로젝트 시연 영상 & 발표 문서

> ### 🗓️ 2025.08.28 - 2025.09.30
> ### [📺 시연 영상]()
> ### [📑 발표 문서]()

---

## 🚀 주요 기능 및 장점
1. **유저 관리 시스템**  
   - 가입한 유저의 상태, 권한, 가입일, 탈퇴 요청일 등의 데이터 확인
   - 권한 변경 및 회원 정보 수정 삭제 기능

2. **탈퇴 관리 시스템**  
   - 탈퇴 요청인원과 사유 확인 가능

3. **대시보드 시스템**  
   - 월별, 연별로 회원 가입, 탈퇴 추세 분석 가능
   - 탈퇴 사유 분포 확인 가능

4. **강의 관리 시스템**  
   - 현재 개설된 강의를 한눈에 확인 가능

5. **스터디 그룹 관리 시스템**  
   - 스터디 그룹과 각 그룹의 인원 현황 및 기간 상태에 대해서 확인가능

6. **리뷰 관리 시스템**  
   - 각 스터디 참여자의 리뷰를 한번에 확인 가능

7. **공고 관리 시스템**  
   - 각 공고의 태그, 마감기한 및 상태, 조회수, 북마크 수 확인 가능

8. **지원 내역 관리 시스템**  
   - 각 공고의 지원자 및 지원 상태 확인 가능  

---

## 🛠 기술 스택
### Frontend
- **React + TypeScript + Vite**
- **ESLint + Prettier**
- **Tailwind CSS**  
- **React Router DOM**
- **React Query / Zustand** (상태 관리)
- **Lucide-React** (아이콘)
- **Axios**
- **Zustand**
- **clsx**
- **Tanstack Query(React Query)**

### Infra & Tools
- **Swagger** (API 문서화)
- **Vercel** (배포)  
- **GitHub Actions** (CI/CD)


### :wrench: System Architecture

<img width="1000" alt="arch_bgx" src="https://github.com/user-attachments/assets/89113088-a538-475b-acc4-da51beb89ff2" />
" />

### FE
<div align=center>
  <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> 
  <img src="https://img.shields.io/badge/css-ca64f4?style=for-the-badge&logo=css3&logoColor=white"> 
  <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> 
  <br>

  <img src="https://img.shields.io/badge/react-00A8E1?style=for-the-badge&logo=react&logoColor=black"> 
  <img src="https://img.shields.io/badge/figma-EF2D5E?style=for-the-badge&logo=figma&logoColor=black">
  <img src="https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white">
  <img src="https://img.shields.io/badge/prettier-FF4F8B?style=for-the-badge&logo=prettier&logoColor=white">
  <br>

  <img src="https://img.shields.io/badge/tanstack query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white">
  <img src="https://img.shields.io/badge/axios-6935D3?style=for-the-badge&logo=axios&logoColor=white">  
   <img src="https://img.shields.io/badge/zustand-1a1a1a?style=for-the-badge&logo=zustand&logoColor=white">
   <img src="https://img.shields.io/badge/react router dom-CA4245?style=for-the-badge&logoColor=white"> 
     <br>

  <img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
  <img src="https://img.shields.io/badge/npm-ED1C24?style=for-the-badge&logo=npm&logoColor=white">
  <img src="https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
  <br>
</div>
---

## 📂 프로젝트 구조
```bash
oz_externship_fe_02_team2/
├── docs/                # 컨벤션, 기능별 사용 가이드
├── public/              # 정적 리소스 (favicon 등)
├── src/
│   ├── api/             # Axios API 모듈 (auth, users, withdrawals, recruiments 등)
│   ├── assets/          # 아이콘, 이미지, 로고
│   ├── components/      # 공통 UI, 게시판, 사이드바, 모달 등
│   ├── constants/       # 상수 모음 (애니메이션, 경로, 색상 등)
│   ├── hooks/           # 커스텀 훅 (무한스크롤, 인증, 댓글, 깃허브 연동 등)
│   ├── lib/             # 공용 유틸 함수 (cn, mappers, token)
│   ├── mocks/           # MSW Mock 데이터 (핸들러, seed)
│   ├── pages/           # 라우팅 페이지 (admin, auth, dashboard 등)
│   ├── router/          # AppRouter 및 라우터 가드
│   ├── store/           # Zustand 전역 상태 (toastStore)
│   ├── types/           # 타입 정의 (board, post, job, toast 등)
│   └── test-hub/        # 테스트 허브 (registry)
│   └── test-pages/      # 테스트 허브 페이지 모음 (button, card, modal 등)
├── package.json
├── tailwind.config.js
└── tsconfig.json
```
--- 

## :busts_in_silhouette: 팀 동료

### FE

| <a href=https://github.com/><img src="https://avatars.githubusercontent.com/u/87156321?v=4" width=100px/><br/><sub><b>@wrongstory</b></sub></a><br/> | <a href=https://github.com/><img src="https://avatars.githubusercontent.com/u/79068658?v=4" width=100px/><br/><sub><b>@makee-ham</b></sub></a><br/> | <a href=https://github.com/><img src="https://avatars.githubusercontent.com/u/204287113?v=4" width=100px/><br/><sub><b>@wnduddlekd</b></sub></a><br/> | <a href=https://github.com/><img src="https://avatars.githubusercontent.com/u/205895151?v=4" width=100px/><br/><sub><b>@people9953</b></sub></a><br/> |
|:----------------------------------:|:----------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------:|
|                이명우                 |    함서연     |                                                                            김민제                                                                            |    김민창     |


--- 

## 📑 프로젝트 규칙

### Branch Strategy
| 종류        | 브랜치명                  | 예시               | 설명                             |
| ----------- | ------------------------- | ------------------ | -------------------------------- |
| **Main**    | `main`                    | `main`             | 최종 배포용 브랜치               |
| **Develop** | `develop`                 | `develop`          | 기능 통합 및 배포 전 작업 브랜치 |
| **Feature** | `feature/이슈번호-기능명` | `feature/5-signin` | 개별 기능 개발 브랜치            |
| **Hotfix**  | `hotfix-버전`             | `hotfix-1.1.4`     | 배포 이후 긴급 수정 브랜치       |
| **Release** | `release-버전`            | `release-1.1`      | 배포 준비를 위한 브랜치          |

> 규칙
>
> - 기능 개발 전, **이슈를 생성한 후** 브랜치를 생성합니다.
> - 브랜치명은 **소문자**를 사용하고, 단어는 또는 `/`로 구분합니다.
> - 브랜치는 관련 이슈에 링크되어야 합니다.

### Git Convention
- 깃허브에 익숙지 않은 팀원을 위해 한 줄 커밋 사용
- 한국어로 내용 작성

**형식**

`<타입>: <변경 내용>(<이슈 번호>)`

> 커밋 메시지는 현재까지의 수정사항을 한눈에 파악 가능하게 작성합니다.
>
> 예시:
>
> `feat: 기본 CRUD 기능 작성(#3)`

| 커밋 유형        | 의미                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------- |
| feat             | 새로운 기능 추가, 컴포넌트 파일 생성                                                      |
| fix              | 코드(버그) 또는 UI의 문제 해결                                                            |
| docs             | 문서 수정                                                                                 |
| style            | 코드 formatting, 세미콜론 누락, 코드 자체의 변경이 없는 경우 (엔터 쳐서 한줄 비우는 경우) |
| refactor         | 코드 리팩토링                                                                             |
| test             | 테스트 코드, 리팩토링 테스트 코드 추가, 더미 데이터 사용시                                |
| chore            | 패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore                                        |
| design           | CSS 등 사용자 UI 디자인 변경 (tailwind 사용시)                                            |
| types            | 타입 및 인터페이스 정의                                                                   |
| comment          | 필요한 주석 추가 및 변경                                                                  |
| rename           | 파일 또는 폴더 명을 수정하거나 옮기는 작업만인 경우                                       |
| remove           | 파일을 삭제하는 작업만 수행한 경우                                                        |
| revert           | 원래의 코드로 되돌리는 경우                                                               |
| init             | 초기화 관련 작업                                                                          |
| !BREAKING CHANGE | 커다란 API 변경의 경우                                                                    |
| !HOTFIX          | 급하게 치명적인 버그를 고쳐야 하는 경우                                                   |

### Code Convention
>BE
> - Python Black : 코드 스타일을 일관성 있게 유지하고 가독성을 높이기 위해 코드 포맷터 사용
( 들여쓰기, 라인 길이, 공백 등의 세부 스타일 자동으로 지정 )
> - Isort : Python코드의 import문을 정렬

> FE
> - 모든 작업은 **이슈 생성 → 브랜치 생성 → 작업 → PR(develop 브랜치에)** 순으로 진행합니다.
> - 하나의 브랜치에서는 **하나의 이슈만** 처리합니다.
> - 코드 변경 사항은 PR 전 **Lint & Formatter**를 통과해야 합니다.
> - 색상은 `tailwind.config.js`의 `oz_dark`&`oz_light`에 있는 변수들을 사용해야 합니다.
> - 네이밍 컨벤션은 아래 표와 같습니다.

| 타입            | 예시                                      |
| --------------- | ----------------------------------------- |
| 상수(Constant)  | SCREAMING_SNAKE_CASE (MAX_VALUE, API_URL) |
| Boolean 변수    | is접두사 (isActive)                       |
| 일반 변수, 함수 | camelCase 사용 (userName, itemList)       |
| 컴포넌트        | PascalCase (UserCard, LoginForm)          |
| 커스텀 훅       | use + PascalCase (useScroll, useAuth)     |
| 배열            | 복수형 사용 (users, items)                |
| 객체            | 단수형 사용 (user, item)                  |
| 이벤트 핸들러   | handle 접두사 (handleSubmit)              |
| 비동기 함수     | fetch 접두사 (fetchDat)                   |
| 타입스크립트    | type                                      |

### Communication Rules
> - Discord 활용 
> - 데일리 스크럼
