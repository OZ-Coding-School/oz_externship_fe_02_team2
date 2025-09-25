import React from 'react';

// Review 타입 정의
interface Review {
  id: string;
  studyName: string;
  reviewerInfo: { nickname: string; email: string };
  content: string;
  uuid: string;
  starRating: number;
  studyInfo: {
    startDate: string;
    endDate: string;
    studyDescription: string;
  };
}

// 모달 컴포넌트 속성 정의
interface ReviewDetailModalProps {
  review: Review | null;
  onClose: () => void;
}

const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({ review, onClose }) => {
  if (!review) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[896px] rounded-2xl bg-white shadow-2xl drop-shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 헤더 (구분선 포함) */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold text-gray-800">리뷰 상세 정보</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
        </div>

        {/* 본문 */}
        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* 스터디 그룹 정보 */}
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-800 mb-3">
              스터디 그룹 정보
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">스터디 그룹명</span>
                <div className="font-bold text-gray-800 pl-4 mt-3">
                  {review.studyName}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">스터디 시작일자</span>
                  <div className="pl-4 mt-2 text-gray-800">
                    {review.studyInfo.startDate}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">스터디 종료일자</span>
                  <div className="pl-4 mt-2 text-gray-800">
                    {review.studyInfo.endDate}
                  </div>
                </div>
              </div>

              <div>
                <span className="font-medium text-gray-600">스터디 소개</span>
                <div className="mt-2 bg-gray-100 p-3 rounded-md leading-relaxed whitespace-pre-line text-xs">
                  {review.studyInfo.studyDescription}
                </div>
              </div>
            </div>
          </div>

          {/* 리뷰 정보 */}
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-800 mb-3">리뷰 정보</h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">리뷰 ID</span>
                <div className="pl-4 mt-3 text-gray-800">#{review.id}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">작성자 닉네임</span>
                  <div className="pl-4 mt-2">{review.reviewerInfo.nickname}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">작성자 이메일</span>
                  {/* break-words 제거해서 한 줄로 나오게 수정 */}
                  <div className="pl-4 mt-2">
                    {review.reviewerInfo.email}
                  </div>
                </div>
              </div>

              <div>
                <span className="font-medium text-gray-600">별점</span>
                <div className="flex items-center space-x-1 pl-4 mt-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.starRating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 font-bold text-gray-800">
                    {review.starRating} / 5
                  </span>
                </div>
              </div>

              <div>
                <span className="font-medium text-gray-600">리뷰 내용</span>
                <div className="mt-2 bg-gray-100 p-3 rounded-md leading-relaxed whitespace-pre-line text-xs">
                  {review.content}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-medium text-gray-600">
                    생성일시
                  </span>
                  <div className="text-xs text-gray-800 pl-4 mt-3">
                    2024-01-05 15:30:00
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-600">
                    수정일시
                  </span>
                  <div className="text-xs text-gray-800 pl-4 mt-3">
                    2024-01-05 15:30:00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 푸터 (구분선 포함) */}
        <div className="flex justify-end border-t p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailModal;
