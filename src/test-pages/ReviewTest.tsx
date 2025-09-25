import React, { useState } from 'react';
import ReviewDetailModal from 'src/components/Review/ReviewDetailModal';

// 리뷰 데이터의 타입을 정의합니다.
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

// 더미 리뷰 데이터
const DUMMY_REVIEWS: Review[] = [
  {
    id: 'REV001',
    studyName: 'React 마스터 스터디 1기',
    reviewerInfo: { nickname: '코딩러버', email: 'coder@example.com' },
    content:
      '정말 알찬 스터디였습니다! 리더님이 커리큘럼을 짜주셔서 단계적으로 학습할 수 있었고, 팀 프로젝트를 통해 실무 경험도 쌓을 수 있었어요. 특히 코드 리뷰 시간이 많은 도움이 되었습니다. 다른 분들께도 강력 추천합니다!',
    uuid: 'review-uuid-001',
    starRating: 5,
    studyInfo: {
      startDate: '2023-10-01',
      endDate: '2023-12-31',
      studyDescription:
        '리액트 기초부터 고급까지 체계적으로 학습하는 스터디입니다.\n실무에서 사용하는 최신 리액트 기술을 익히고 팀 프로젝트를 통해 협업 경험도 쌓을 수 있습니다.',
    },
  },
  {
    id: 'REV002',
    studyName: 'Python Django 웹 개발 스터디',
    reviewerInfo: { nickname: '백엔드지망생', email: 'backend.student@example.com' },
    content:
      '처음에는 Django가 어려워 보였는데, 스터디원들과 함께 차근차근 배워나가니 금세 익숙해졌어요. 서로 질문하고 답변하며 성장하는 분위기가 좋았습니다.',
    uuid: 'review-uuid-002',
    starRating: 4,
    studyInfo: {
      startDate: '2023-08-15',
      endDate: '2023-11-15',
      studyDescription: '실무에 바로 적용 가능한 백엔드 웹 개발 스터디입니다.',
    },
  },
  {
    id: 'REV004',
    studyName: '데이터 사이언스 기초 스터디',
    reviewerInfo: { nickname: '데이터분석러', email: 'data.analyst@example.com' },
    content:
      '비전공자인데도 차근차근 설명해주셔서 이해하기 쉬웠어요. 실제 업무 데이터로 분석 실습을 할 수 있어 더욱 유익했습니다.',
    uuid: 'review-uuid-004',
    starRating: 5,
    studyInfo: {
      startDate: '2023-09-01',
      endDate: '2023-12-01',
      studyDescription: '데이터 분석과 머신러닝 기초를 배우는 스터디입니다.',
    },
  },
  {
    id: 'REV003',
    studyName: 'React 마스터 스터디 1기',
    reviewerInfo: { nickname: '프론트엔드마니아', email: 'frontend.mania@example.com' },
    content:
      '이미 React를 어느 정도 알고 있는 상태에서 참여했는데, 고급 기술들과 모범 사례들을 배울 수 있어 좋았습니다. 팀 프로젝트를 통해 실무 경험도 쌓을 수 있었어요.',
    uuid: 'review-uuid-003',
    starRating: 5,
    studyInfo: {
      startDate: '2023-10-01',
      endDate: '2023-12-31',
      studyDescription: '리액트 기초부터 고급까지 체계적으로 학습하는 스터디입니다.',
    },
  },
  {
    id: 'REV005',
    studyName: 'Node.js 백엔드 개발 스터디',
    reviewerInfo: { nickname: 'JS개발자', email: 'js.developer@example.com' },
    content:
      'JavaScript로 백엔드를 개발하는 것이 이렇게 재미있을 줄 몰랐어요! Express를 이용한 RESTful API 구축에 대한 강의가 특히 인상적이었습니다.',
    uuid: 'review-uuid-005',
    starRating: 4,
    studyInfo: {
      startDate: '2024-01-10',
      endDate: '2024-03-10',
      studyDescription: 'Node.js와 Express를 이용한 백엔드 개발 스터디입니다.',
    },
  },
  {
    id: 'REV006',
    studyName: 'Flutter 모바일 앱 개발 스터디',
    reviewerInfo: { nickname: '모바일개발자', email: 'mobile.dev@example.com' },
    content:
      '처음 모바일 개발을 시작하는 입장에서 Flutter는 정말 좋은 선택이었어요. 한 번의 코드로 iOS, Android 앱을 모두 만들 수 있다는 것이 가장 큰 장점입니다.',
    uuid: 'review-uuid-006',
    starRating: 5,
    studyInfo: {
      startDate: '2024-02-01',
      endDate: '2024-04-01',
      studyDescription: 'Flutter를 활용한 크로스 플랫폼 모바일 앱 개발 스터디입니다.',
    },
  },
  {
    id: 'REV007',
    studyName: 'Python Django 웹 개발 스터디',
    reviewerInfo: { nickname: '파이썬초보', email: 'python.beginner@example.com' },
    content:
      '프로그래밍을 처음 배우는 입장에서도 따라갈 수 있도록 친절하게 설명해주셨어요. 처음엔 어려웠지만, 꾸준히 복습하면서 실력이 늘어가는 것을 느꼈습니다.',
    uuid: 'review-uuid-007',
    starRating: 3,
    studyInfo: {
      startDate: '2023-08-15',
      endDate: '2023-11-15',
      studyDescription: '실무에 바로 적용 가능한 백엔드 웹 개발 스터디입니다.',
    },
  },
  {
    id: 'REV008',
    studyName: 'AI/ML 기초 스터디',
    reviewerInfo: { nickname: 'AI연구원', email: 'ai.researcher@example.com' },
    content:
      'AI/ML 분야의 최신 동향과 실무 기술을 배울 수 있어서 좋았습니다. 이론과 실습의 균형이 잘 잡혀 있었고, 강사님의 풍부한 경험을 들을 수 있었던 것도 큰 도움이 되었습니다.',
    uuid: 'review-uuid-008',
    starRating: 5,
    studyInfo: {
      startDate: '2024-01-20',
      endDate: '2024-03-20',
      studyDescription: '인공지능과 머신러닝의 기초 개념을 학습하는 스터디입니다.',
    },
  },
];

// 메인 컴포넌트
const ReviewManagement = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // 검색 필터링 로직
  const filteredReviews = DUMMY_REVIEWS.filter(
    (review) =>
      review.reviewerInfo.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewerInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.studyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (review: Review) => {
    setSelectedReview(review);
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen font-sans bg-white p-10">
      <h1 className="mb-8 text-3xl font-bold">리뷰 관리</h1>

      {/* 검색창 */}
      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="h-5 w-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          placeholder="사용자 닉네임, 스터디 그룹명, 이메일 검색..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="min-w-[300px] w-1/3 rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* 검색 결과 개수 표시 */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600">
          검색 결과: {filteredReviews.length}개
        </div>
      )}

      {/* 리뷰 테이블 */}
      <div className="overflow-x-auto rounded-lg bg-white shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-24 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                # ID
              </th>
              <th className="w-56 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                스터디 그룹명
              </th>
              <th className="w-56 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                작성자 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                리뷰 내용
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <tr
                  key={review.uuid}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleRowClick(review)}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-900">
                    #{review.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-900">
                    {review.studyName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {review.reviewerInfo.nickname}
                      </span>
                      <span className="text-gray-500">
                        {review.reviewerInfo.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-900">
                    <div className="truncate max-w-xs" title={review.content}>
                      {review.content}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  {searchTerm
                    ? '검색 결과가 없습니다.'
                    : '표시할 리뷰 데이터가 없습니다.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 모달 */}
      {selectedReview && (
        <ReviewDetailModal review={selectedReview} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ReviewManagement;
