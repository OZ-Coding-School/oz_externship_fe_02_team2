import Badge from '@/components/ui/Badge/Badge'
import type { RecruitmentDetailData } from '@/types/AdminRecruitments.types'

interface RecruitmentDetailLeftProps {
  data: RecruitmentDetailData
}

export default function RecruitmentDetailLeft({
  data,
}: RecruitmentDetailLeftProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원'
  }

  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div>
        <div className="text-sm font-semibold text-gray-600">공고 ID</div>
        <div className="mt-1 text-lg">#{data.id}</div>
      </div>

      <div>
        <div className="text-sm font-semibold text-gray-600">UUID</div>
        <div className="mt-1 font-mono text-xs text-gray-700">{data.uuid}</div>
      </div>

      <div>
        <div className="text-sm font-semibold text-gray-600">공고 제목</div>
        <h3 className="mt-1 text-lg font-bold">{data.title}</h3>
      </div>

      {/* 모집 정보 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-semibold text-gray-600">
            예상 모집 인원
          </div>
          <div className="mt-1">{data.expectedHeadcount}명</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-600">
            예상 결제 비용
          </div>
          <div className="mt-1">{formatPrice(data.estimatedFee)}</div>
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold text-gray-600">마감 기한</div>
        <div className="mt-1">{formatDate(data.closeAt)}</div>
      </div>

      <div>
        <div className="text-sm font-semibold text-gray-600">공고 상태</div>
        <div className="mt-1">
          <Badge variant={data.isClosed ? 'secondary' : 'success'} size="md">
            {data.isClosed ? '마감' : '모집중'}
          </Badge>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-semibold text-gray-600">조회수</div>
          <div className="mt-1 flex items-center gap-1">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {data.viewsCount}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-600">북마크 수</div>
          <div className="mt-1 flex items-center gap-1">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            {data.bookmarkCount}
          </div>
        </div>
      </div>

      {/* 날짜 정보 */}
      <div className="body-sm flex justify-start">
        <div>
          <div className="font-semibold text-gray-600">공고 등록일시</div>
          <div className="mt-1">{formatDate(data.createdAt)}</div>
        </div>
        <div className="ml-26">
          <div className="font-semibold text-gray-600">마지막 수정일시</div>
          <div className="mt-1">
            {data.updatedAt ? formatDate(data.updatedAt) : '-'}
          </div>
        </div>
      </div>

      {/* 사용자 정의 태그 */}
      <div>
        <div className="mb-2 text-sm font-semibold text-gray-600">
          사용자 정의 태그
        </div>
        {data.tags && data.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <Badge key={tag.id} variant="warning" size="sm">
                {tag.name}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-400">태그 없음</div>
        )}
      </div>

      {/* 공고 첨부 파일 */}
      <div>
        <div className="mb-2 text-sm font-semibold text-gray-600">
          공고 첨부 파일
        </div>
        {data.attachments && data.attachments.length > 0 ? (
          <div className="space-y-2">
            {data.attachments.map((file) => (
              <a
                key={file.id}
                href={file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
              >
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm text-blue-600">{file.fileName}</span>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-400">첨부파일 없음</div>
        )}
      </div>
    </div>
  )
}
