import { memo } from 'react'
import Modal from '../../Modal'
import type { ApplyToStudyDetailCompat } from './ApplyToStudy.types'
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
  form: ApplyToStudyDetailCompat
}) {
  const r: any = form.recruitment ?? {}
  // 공고명
  const title =
    r.title ?? form.title ?? form.ad?.title ?? form.recruitmentTitle ?? '-'

  // 모집 인원 / 마감 기한
  const headcount =
    r.expectedHeadcount ?? r.headcount ?? form.adDetail?.headcount
  const deadline =
    r.deadlineDate ?? r.deadline ?? form.adDetail?.deadline ?? '-'

  // 강의 목록(정규화)
  const lecturesSrc: any[] = Array.isArray(r.lectures)
    ? r.lectures
    : Array.isArray(form.adDetail?.lectures)
      ? (form.adDetail!.lectures as any[])
      : []

  const lectures = lecturesSrc.map((lec: any, i: number) => {
    const id =
      lec?.id ??
      `${r.id ?? form.applicationCode ?? form.id}-lec-${i}-${lec?.title ?? lec?.name ?? ''}`
    const name = lec?.title ?? lec?.name ?? ''
    const instructorName =
      lec?.instructorName ?? lec?.instructor ?? lec?.teacher ?? ''
    return { id, title: name, instructorName }
  })

  // 태그(정규화)
  const tagsSrc: any[] =
    (Array.isArray(r.tagsWithKey) && r.tagsWithKey) ||
    (Array.isArray(r.tags) && r.tags) ||
    (Array.isArray(form.customTags) && form.customTags) ||
    (Array.isArray(form.adDetail?.tags) && form.adDetail!.tags) ||
    []

  const tags = tagsSrc.map((t: any, i: number) => {
    if (typeof t === 'string') {
      return {
        id: `${r.id ?? form.applicationCode ?? form.id}-tag-${i}-${t}`,
        name: t,
      }
    }
    return {
      id:
        t?.id ??
        `${r.id ?? form.applicationCode ?? form.id}-tag-${i}-${t?.label ?? t?.name ?? ''}`,
      name: t?.name ?? t?.label ?? '',
    }
  })

  return (
    <>
      <Modal.Header className="flex items-center gap-3 pb-2">
        <Modal.Title>스터디 구인 공고 정보</Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-0 pb-3">
        <div className="space-y-4">
          <LabeledBlock label="공고명">{title}</LabeledBlock>

          <LabeledBlock label="모집 인원">
            {typeof headcount === 'number' ? `${headcount}명` : '-'}
          </LabeledBlock>

          <LabeledBlock label="마감 기한">{deadline}</LabeledBlock>
        </div>

        {/* 강의 목록 */}
        <div className="mt-6">
          <div className="body-sm mb-2 font-semibold text-gray-900">
            강의 목록
          </div>
          <ul className="space-y-4">
            {lectures.length ? (
              lectures.map((lec) => (
                <li key={lec.id} className="rounded-2xl bg-gray-50 px-6 py-5">
                  <p className="text-lg leading-snug font-semibold text-black">
                    {lec.title || '-'}
                  </p>
                  <p className="mt-2 text-sm leading-tight text-black">
                    강사: {lec.instructorName || '-'}
                  </p>
                </li>
              ))
            ) : (
              <li className="rounded-2xl bg-gray-50 px-6 py-5 text-black">-</li>
            )}
          </ul>
        </div>

        {/* 사용자 정의 태그 */}
        <div className="mt-6">
          <div className="body-sm mb-2 font-semibold text-gray-900">
            사용자 정의 태그
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.length ? (
              // 태그는 상태 뱃지가 아니라 태그 뱃지로 렌더링
              tags.map((t) => (
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
