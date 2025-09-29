import { memo } from 'react'
import Modal from '../../Modal'
import type { ApplyToStudyDetail } from './ApplyToStudy.types'
import Badge from '@/components/ui/Badge/Badge'

function LabeledBlock({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="body-sm mb-2 font-semibold text-gray-900">{label}</div>
      <div className="rounded-2xl bg-gray-50 px-5 py-4 text-black">
        {children ?? '-'}
      </div>
    </div>
  )
}

function ApplicationRecruitmentViewBase({
  form,
}: {
  form: ApplyToStudyDetail
}) {
  const r = form.recruitment
  return (
    <>
      <Modal.Header className="pb-2">
        <Modal.Title>스터디 구인 공고 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0 pb-3">
        <div className="space-y-4">
          <LabeledBlock label="공고명">{r.title}</LabeledBlock>
          <LabeledBlock label="모집 인원">{r.expectedHeadcount}명</LabeledBlock>
          <LabeledBlock label="마감 기한">{r.deadlineDate ?? '-'}</LabeledBlock>
        </div>
        <div>
          <div className="body-sm mb-2 font-semibold text-gray-900">
            강의 목록
          </div>

          {/* 아이템 간 간격 */}
          <ul className="space-y-4">
            {r.lectures.length ? (
              r.lectures.map((lec, i) => (
                <li key={i} className="rounded-2xl bg-gray-50 px-6 py-5">
                  <p className="text-lg leading-snug font-semibold text-black">
                    {lec.title}
                  </p>
                  <p className="mt-2 text-sm leading-tight text-black">
                    강사: {lec.instructorName}
                  </p>
                </li>
              ))
            ) : (
              <li className="rounded-2xl bg-gray-50 px-6 py-5 text-black">-</li>
            )}
          </ul>
        </div>

        <div>
          <div className="body-sm mb-2 font-semibold text-gray-900">
            사용자 정의 태그
          </div>
          <div className="flex flex-wrap gap-2">
            {r.tags.length ? (
              r.tags.map((t) => (
                <Badge key={t.id} variant="warning" size="md">
                  {t.name}
                </Badge>
              ))
            ) : (
              <span className="body-sm text-gray-500">-</span>
            )}
          </div>
        </div>
      </Modal.Body>
    </>
  )
}

export default memo(ApplicationRecruitmentViewBase)
