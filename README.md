# StudyHub Admin Page 프로젝트

> **온라인 교육 환경의 변화에 따른 관리 시스템 필요성** – 온라인 강의와 스터디 운영이 증가하는 교육 환경에서 회원, 스터디, 공고를 효율적으로 관리할 수 있는 통합 시스템이 필요하다고 판단되어 구상 프로젝트입니다.  

[👉 프론트엔드 레포 바로가기](https://github.com/OZ-Coding-School/oz_externship_fe_02_team2)

---

## 📌 프로젝트 개요
현재 온라인 교육과 스터디 운영이 점점 증가하는 교육환경에서 이를 관리하기 위한 시스템의 필요성이 제기 되었습니다.  
이를 해결하기 위해 **데이터 기반 의사 결정을 위한 통계 시각화 도구**를 도입하여,
회원, 스터디, 공고를 효율적으로 관리할 수 있는 통합 시스템을 개발 합니다.

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
