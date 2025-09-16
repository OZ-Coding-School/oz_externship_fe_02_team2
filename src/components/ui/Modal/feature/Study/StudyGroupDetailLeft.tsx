import Badge from '@/components/ui/Badge/Badge'
import type { StudyGroupDetail } from './Study.types'
import { studyToTone } from '@/lib'

type Props = {
  data?: StudyGroupDetail
  loading?: boolean
  errorText?: string | null
}

const fmt = (iso?: string): string =>
  iso ? new Date(iso).toLocaleDateString() : '-'

export default function StudyGroupDetailLeft({
  data,
  loading,
  errorText,
}: Props) {
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="aspect-[16/9] w-full animate-pulse rounded-2xl bg-gray-200" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-6 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  if (errorText) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {errorText}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-sm text-gray-500">표시할 데이터가 없습니다.</div>
    )
  }

  return (
    <section className="space-y-5" aria-label="스터디 기본 정보">
      <div>
        <div className="mb-2 text-xs text-gray-500">
          스터디 그룹 대표 이미지
        </div>
        <img
          src={
            data.coverImageUrl ??
            'https://placehold.co/960x540?text=Study+Group'
          }
          alt="스터디 그룹 대표 이미지"
          className="aspect-[16/9] w-full rounded-2xl object-cover"
        />
      </div>
      <div className="sm:col-span-2">
        <div className="text-xs text-gray-500">그룹명</div>
        <div className="text-base font-semibold">{data.name}</div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <div className="text-xs text-gray-500">고유 ID</div>
          <div className="text-sm">{data.id}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">UUID</div>
          <div className="font-mono text-sm">{data.uuid}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500">인원 현황</div>
          <div className="text-sm">
            <span className="text-primary-600">{data.currentMembers}</span>
            <span> / {data.capacity}명</span>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500">스터디 상태</div>
          <Badge tone={studyToTone[data.status]}>{data.status}</Badge>
        </div>

        <div>
          <div className="text-xs text-gray-500">스터디 시작일</div>
          <div className="text-sm">{fmt(data.startDate)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">스터디 종료일</div>
          <div className="text-sm">{fmt(data.endDate)}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500">생성일시</div>
          <div className="text-sm">
            {data.createdAt ? new Date(data.createdAt).toLocaleString() : '-'}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">수정일시</div>
          <div className="text-sm">
            {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : '-'}
          </div>
        </div>
      </div>
    </section>
  )
}
