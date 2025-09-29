import Badge from '@/components/ui/Badge/Badge'
import Modal from '../../Modal'
import type { ApplyToStudyDetail } from './ApplyToStudy.types'
import { formatYmdHms } from '@/lib'

function LabeledCard({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="body-sm mb-2 font-semibold text-gray-600">{label}</div>
      <div className="rounded-2xl bg-gray-50 px-5 py-4 text-black">
        {children ?? '-'}
      </div>
    </div>
  )
}

export default function ApplyToStudyUserView({
  form,
}: {
  form: ApplyToStudyDetail
}) {
  const u = form.applicant
  const STATUS: Record<
    string,
    { label: string; variant: 'success' | 'danger' | 'secondary' | 'warning' }
  > = {
    APPROVED: { label: '승인', variant: 'success' },
    REJECTED: { label: '거절', variant: 'danger' },
    PENDING: { label: '대기중', variant: 'secondary' },
    REVIEWING: { label: '검토중', variant: 'warning' },
    UNDER_REVIEW: { label: '검토중', variant: 'warning' },
  }
  const sb = STATUS[form.status] ?? {
    label: String(form.status),
    variant: 'secondary' as const,
  }
  return (
    <>
      <Modal.Header className="pb-2">
        <Modal.Title>지원자 정보</Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-0 pb-3">
        <div className="space-y-6">
          {/* 프로필 영역 */}
          <div className="flex items-center gap-4">
            <img
              src={u.profileImageUrl || 'https://placehold.co/80x80?text=👤'}
              alt={`${u.nickname ?? ''} 프로필 이미지`}
              className="size-20 rounded-full bg-gray-100 object-cover"
            />
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {u.nickname ?? '-'}
              </div>
              <div className="text-gray-500">{u.email ?? '-'}</div>
              {u.gender && <div className="text-gray-500">{u.gender}</div>}
            </div>
          </div>

          {/* 카드형 블록들 */}
          <LabeledCard label="지원 내역 ID">{form.applicationId}</LabeledCard>
          <LabeledCard label="자기소개">
            {form.selfIntroduction ?? '-'}
          </LabeledCard>
          <LabeledCard label="지원 동기">{form.motivation ?? '-'}</LabeledCard>
          <LabeledCard label="스터디 목표">{form.goal ?? '-'}</LabeledCard>
          <LabeledCard label="가능한 시간대">
            {form.availableTimeDescription ?? '-'}
          </LabeledCard>
          <LabeledCard label="스터디 경험 유무">
            {form.hasStudyExperience ? '있음' : '없음'}
          </LabeledCard>
          <LabeledCard label="구체적인 스터디 경험">
            {form.studyExperienceDetails ?? '-'}
          </LabeledCard>
          {/* 지원일시 / 수정일시 (2열 카드) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <LabeledCard label="지원일시">
              <span className="whitespace-nowrap">
                {formatYmdHms(form.createdAt)}
              </span>
            </LabeledCard>
            <LabeledCard label="수정일시">
              <span className="whitespace-nowrap">
                {formatYmdHms(form.updatedAt)}
              </span>
            </LabeledCard>
          </div>

          {/* 지원 상태 뱃지 */}
          <div>
            <div className="body-sm mb-2 font-semibold text-gray-700">
              지원 상태
            </div>
            <Badge
              variant={sb.variant}
              size="lg"
              aria-label={`지원 상태: ${sb.label}`}
            >
              {sb.label}
            </Badge>
          </div>
        </div>
      </Modal.Body>
    </>
  )
}
