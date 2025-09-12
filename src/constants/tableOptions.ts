import type {
  MemberRole,
  MemberStatus,
  RecruitmentStatusFilter,
  SelectOption,
  StudyStatus,
  WithdrawalStatus,
} from '@/types'

// 회원 관리 페이지 권한
export const MEMBER_ROLE_OPTIONS: readonly SelectOption<MemberRole>[] = [
  { value: 'ALL', label: '전체' },
  { value: 'ADMIN', label: '관리자' },
  { value: 'STAFF', label: '스태프' },
  { value: 'USER', label: '일반회원' },
] as const

// 회원 관리 페이지 상태
export const MEMBER_STATUS_OPTIONS: readonly SelectOption<MemberStatus>[] = [
  { value: 'ACTIVE', label: '활성' },
  { value: 'INACTIVE', label: '비활성' },
  { value: 'SUSPENDED', label: '정지' },
  { value: 'WITHDRAWAL_REQUEST', label: '탈퇴요청' },
] as const

// 회원 탈퇴 관리 페이지 상태(사유)
export const WITHDRAWAL_STATUS_OPTIONS: readonly SelectOption<WithdrawalStatus>[] =
  [
    { value: 'ALL', label: '전체' },
    { value: 'SERVICE_DISSATISFACTION', label: '서비스 불만족' },
    { value: 'PRIVACY_CONCERN', label: '개인정보 우려' },
  ] as const

// 스터디 그룹관리 페이지 스터디 상태
export const STUDY_STATUS_OPTIONS: readonly SelectOption<StudyStatus>[] = [
  { value: 'ALL', label: '전체' },
  { value: 'IN_PROGRESS', label: '진행중' },
  { value: 'PENDING', label: '대기중' },
] as const

// 스터디 구인 공고 관리 페이지 공고 상태
export const RECRUITMENT_STATUS_OPTIONS: readonly SelectOption<RecruitmentStatusFilter>[] =
  [
    { value: 'ALL', label: '전체' },
    { value: 'OPEN', label: '모집중' },
    { value: 'CLOSED', label: '마감' },
  ] as const

// 정렬 옵션(드롭다운을 쓸 경우) — 내부 값은 "컬럼.방향"으로 URL과 동일하게
export const SORT_OPTIONS: readonly SelectOption<string>[] = [
  { value: 'created_at.desc', label: '최신순' },
  { value: 'created_at.asc', label: '오랜된순' },
  { value: 'bookmarks_count.desc', label: '북마크순' },
  { value: 'views_count.desc', label: '조회순' },
] as const
