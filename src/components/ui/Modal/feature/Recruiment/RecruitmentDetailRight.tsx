import Badge from '@/components/ui/Badge/Badge'
import type {
  Lecture,
  RecruitmentDetailData,
} from '@/types/AdminRecruitments.types'

interface RecruitmentDetailRightProps {
  data: RecruitmentDetailData
}

export default function RecruitmentDetailRight({
  data,
}: RecruitmentDetailRightProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* 공고 내용 */}
      <div>
        <div className="mb-3 text-lg font-bold">공고 내용</div>
        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="mb-3 font-semibold">학습 내용</h4>
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
            {data.content}
          </div>
        </div>
      </div>

      {/* 스터디 강의 목록 */}
      {data.lectures && data.lectures.length > 0 && (
        <div>
          <div className="mb-3 text-sm font-semibold text-gray-600">
            스터디 강의 목록
          </div>
          <div className="space-y-3">
            {data.lectures.map((lecture: Lecture, idx: number) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 bg-white p-3"
              >
                <div className="flex items-start gap-3">
                  {lecture.thumbnailImgUrl && (
                    <img
                      src={lecture.thumbnailImgUrl}
                      alt={lecture.title}
                      className="h-16 w-16 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {lecture.title}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      강사: {lecture.instructor}
                    </div>
                    <a
                      href={lecture.urlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    >
                      강의 바로가기
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 지원 내역 */}
      {data.applications && data.applications.length > 0 && (
        <div>
          <div className="mb-3 text-sm font-semibold text-gray-600">
            지원 내역 ({data.applications.length}명)
          </div>
          <div className="space-y-2">
            {data.applications.map((app, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600">
                    {app.applicantNickname?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="font-medium">
                      {app.applicantNickname || '알 수 없음'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {app.applicantEmail || '-'}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-400">
                      지원일시:{' '}
                      {app.appliedAt ? formatDate(app.appliedAt) : '-'}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    app.status === 'ACCEPTED'
                      ? 'success'
                      : app.status === 'REJECTED'
                        ? 'danger'
                        : app.status === 'CANCELED'
                          ? 'secondary'
                          : 'warning'
                  }
                  size="sm"
                >
                  {app.status === 'PENDING' && '대기중'}
                  {app.status === 'ACCEPTED' && '승인됨'}
                  {app.status === 'REJECTED' && '거절됨'}
                  {app.status === 'CANCELED' && '취소됨'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
