// 공통 도메인
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'INREVIEW'

export interface Tag {
  id: string
  name: string
}

export interface Lecture {
  title: string
  instructorName: string
}

// 구인 공고 요약(좌측 카드)
export interface RecruitmentPostSummary {
  id: number
  uuid: string
  title: string
  expectedHeadcount: number // 모집 인원
  lectures: Lecture[] // 강의 목록
  tags: Tag[] // 사용자 정의 태그
  deadlineDate?: string | null // YYYY-MM-DD
}

// 지원자 프로필(우측 상단)
export interface ApplicantProfile {
  userId: string
  nickname: string
  email: string
  gender?: Gender
  profileImageUrl?: string
}

// 지원 내역 상세 도메인
export interface ApplicationDetail {
  applicationId: string // 예: "#APP001"
  recruitment: RecruitmentPostSummary
  applicant: ApplicantProfile

  selfIntroduction?: string | null // 자기소개
  motivation?: string | null // 지원 동기
  goal?: string | null // 스터디 목표
  availableTimeDescription?: string | null // 가능한 시간대(자유서술)
  hasStudyExperience?: boolean // 스터디 경험 유무
  studyExperienceDetails?: string | null // 구체적인 경험

  createdAt: string // ISO (서버 원본)
  updatedAt: string // ISO
  status: ApplicationStatus // 승인/대기/거절 등
}

// UI 컴포넌트 props
export interface ApplicationDetailModalProps {
  open: boolean
  data: ApplicationDetail
  onClose: () => void
}
