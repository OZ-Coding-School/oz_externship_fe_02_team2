import { memo } from 'react'
import Field from '../../fields/Field'
import Modal from '../../Modal'
import type { ApplyToStudyDetail } from './ApplyToStudy.types'

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
          <Field
            label="공고명"
            value={r.title}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="모집 인원"
            value={`${r.expectedHeadcount}명`}
            editing={false}
            onChange={() => {}}
          />
          <Field
            label="마감 기한"
            value={r.deadlineDate ?? `-`}
            editing={false}
            onChange={() => {}}
          />
        </div>
        <div>
          <div className="body-sm mb-2 font-semibold text-gray-900">
            강의 목록
          </div>

          {/* 아이템 간 간격 */}
          <ul className="space-y-4">
            {r.lectures.length ? (
              r.lectures.map((lec, i) => (
                <li
                  key={i}
                  className="rounded-2xl bg-gray-50 px-6 py-5" // ← 테두리 X, 라운드 + 배경
                >
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
          <div className="body-sm mb-1 font-medium text-gray-700">
            사용자 정의 태그
          </div>
          <div className="flex flex-wrap gap-2">
            {r.tags.length ? (
              r.tags.map((t) => (
                <span
                  key={t.id}
                  className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-700"
                >
                  {t.name}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">-</span>
            )}
          </div>
        </div>
      </Modal.Body>
    </>
  )
}

export default memo(ApplicationRecruitmentViewBase)
