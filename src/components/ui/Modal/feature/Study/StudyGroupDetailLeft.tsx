import Badge from '@/components/ui/Badge/Badge'
import type { StudyGroupDetail } from './Study.types'
import { studyToTone } from '@/lib'

type StudyGroupDetailLeftProps = {
  data?: StudyGroupDetail
}

const fmt = (iso?: string): string =>
  iso ? new Date(iso).toLocaleDateString() : '-'

export default function StudyGroupDetailLeft({
  data,
}: StudyGroupDetailLeftProps) {
  if (!data) {
    return (
      <div className="body-sm text-gray-500">표시할 데이터가 없습니다.</div>
    )
  }

  return (
    <section
      aria-labelledby="study-group-title"
      className="space-y-5"
      aria-label="스터디 기본 정보"
    >
      <header>
        <figure>
          <img
            src={
              data.coverImageUrl ??
              'https://placehold.co/960x540?text=Study+Group'
            }
            alt="스터디 그룹 대표 이미지"
            className="aspect-[16/9] w-full rounded-2xl object-cover"
          />
          <figcaption className="sr-only">대표 이미지</figcaption>
        </figure>
      </header>

      <div className="sm:col-span-2">
        <div className="body-xs text-gray-500">그룹명</div>
        <div className="text-base font-semibold">{data.title}</div>
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt className="body-xs text-gray-500">고유 ID</dt>
          <dd className="body-sm">{data.id}</dd>
        </div>

        <div>
          <dt className="body-xs text-gray-500">UUID</dt>
          <dd className="body-sm font-mono">{data.uuid}</dd>
        </div>

        <div>
          <dt className="body-xs text-gray-500">인원 현황</dt>
          <dd className="body-sm">
            <span className="text-primary-600">{data.enrolled}</span>
            <span> / {data.capacity}명</span>
          </dd>
        </div>

        <div>
          <dt className="body-xs text-gray-500">스터디 상태</dt>
          <dd>
            <Badge tone={studyToTone[data.status]}>{data.status}</Badge>
          </dd>
        </div>

        <div>
          <dt className="body-xs text-gray-500">스터디 시작일</dt>
          <dd className="body-sm">{fmt(data.period.start)}</dd>
        </div>

        <div>
          <dt className="body-xs text-gray-500">스터디 종료일</dt>
          <dd className="body-sm">{fmt(data.period.end)}</dd>
        </div>

        <div>
          <dt className="body-xs text-gray-500">생성일시</dt>
          <dd className="body-sm">
            {data.createdAt ? new Date(data.createdAt).toLocaleString() : '-'}
          </dd>
        </div>

        <div>
          <dt className="body-xs text-gray-500">수정일시</dt>
          <dd className="body-sm">
            {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : '-'}
          </dd>
        </div>
      </dl>
    </section>
  )
}
