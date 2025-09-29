import ModalSkeleton from '@/components/ui/Skeleton/ModalSkeleton'
import ApplyToStudyRecruitmentView from './ApplyToStudyRecruitmentView'
import type { ApplyToStudyDetail } from './ApplyToStudy.types'
import ApplyToStudyUserView from './ApplyToStudyUserView'

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
        {/* 왼쪽 칸: 섹션을 div로 감싸 '단일 그리드 아이템'으로 만든다 */}
        <div>
          <ApplyToStudyRecruitmentView form={form} />
        </div>
        {/* 오른쪽 칸은 이미 div로 감싸져 있어 OK */}
        <div>
          <ApplyToStudyUserView form={form} />
        </div>
      </div>
    </>
  )
}
