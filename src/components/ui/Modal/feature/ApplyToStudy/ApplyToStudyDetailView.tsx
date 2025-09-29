import ModalSkeleton from '@/components/ui/Skeleton/ModalSkeleton'
import ApplyToStudyRecruitmentView from './ApplyToStudyRecruitmentView'
import ApplyToStudyUserView from './ApplyToStudyUserView'
import ApplyToStudyInfoView from './ApplyToStudyInfoView'
import type { ApplyToStudyDetail } from './ApplyToStudy.types'

type Props = {
  form?: ApplyToStudyDetail | null
  loading?: boolean
  errorText?: string | null
}

export default function ApplyToStudyDetailView({
  form,
  loading,
  errorText,
}: Props) {
  if (loading)
    return (
      <div className="px-6">
        <ModalSkeleton />
      </div>
    )
  if (errorText)
    return (
      <div className="px-6">
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorText}
        </div>
      </div>
    )
  if (!form)
    return (
      <div className="px-6">
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          표시할 데이터가 없습니다.
        </div>
      </div>
    )

  return (
    <>
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        <ApplyToStudyRecruitmentView form={form} />
        <div>
          <ApplyToStudyUserView form={form} />
          <div className="my-4 border-b border-gray-200" />
          <ApplyToStudyInfoView form={form} />
        </div>
      </div>
      <div className="border-b border-gray-200" />
    </>
  )
}
