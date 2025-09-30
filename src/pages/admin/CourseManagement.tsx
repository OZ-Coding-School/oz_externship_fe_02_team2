import { useState, useEffect } from 'react';
import CourseDetailModal from 'src/components/course/CourseDetailModal';

// API 응답 타입
interface ApiCourse {
  id: number;
  title: string;
  instructor: string;
  thumbnail_img_url: string | null;
  platform: 'udemy' | 'inflearn';
  url_link: string;
  created_at: string;
  updated_at: string | null;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiCourse[];
}

// 프론트엔드 사용 타입
interface Course {
  id: number;
  thumbnail: string;
  title: string;
  instructor: string;
  platform: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  difficulty: string;
  duration: string;
  originalPrice: string;
  discountedPrice: string;
  categories: string[];
  uuid: string;
  link: string;
}

const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const limit = 10;

  // API에서 데이터 가져오기
  const fetchCourses = async (offset: number = 0) => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('access_token'); // 실제 토큰 저장 위치에 맞게 수정
      
      const response = await fetch(
        `/api/v1/admin/lectures?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('강의 목록을 불러오는데 실패했습니다.');
      }

      const data: ApiResponse = await response.json();
      
      // API 데이터를 프론트엔드 형식으로 변환
      const transformedCourses: Course[] = data.results.map(course => ({
        id: course.id,
        thumbnail: course.thumbnail_img_url || 'https://placehold.co/128x128/e8e8e8/666666?text=No+Image',
        title: course.title,
        instructor: course.instructor,
        platform: course.platform === 'udemy' ? 'Udemy' : 'Inflearn',
        createdAt: new Date(course.created_at).toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        updatedAt: course.updated_at 
          ? new Date(course.updated_at).toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '-',
        description: '상세 정보는 모달에서 확인하세요', // 목록 API에는 없음
        difficulty: '-', // 목록 API에는 없음
        duration: '-', // 목록 API에는 없음
        originalPrice: '-', // 목록 API에는 없음
        discountedPrice: '-', // 목록 API에는 없음
        categories: [], // 목록 API에는 없음
        uuid: course.id.toString(), // lecture_uuid는 상세 API에만 있음
        link: course.url_link,
      }));

      setCourses(transformedCourses);
      setTotalCount(data.count);
      setHasMore(data.next !== null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchCourses(currentPage * limit);
  }, [currentPage]);

  // 검색 필터링 로직
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-white p-10">
      <h1 className="mb-8 text-3xl font-bold">강의 관리</h1>

      {/* 검색창 */}
      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="text"
          placeholder="강의명, 강사명, 플랫폼 검색..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="min-w-[300px] w-1/3 rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* 검색 결과 개수 표시 */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600">
          검색 결과: {filteredCourses.length}개
        </div>
      )}

      {/* 전체 강의 개수 표시 */}
      {!searchTerm && !loading && (
        <div className="mb-4 text-sm text-gray-600">
          전체 강의: {totalCount}개
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* 로딩 상태 */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      ) : (
        <>
          {/* 강의 테이블 */}
          <div className="overflow-hidden rounded-lg bg-white shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                  <th className="w-16 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">썸네일</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">강의명</th>
                  <th className="w-36 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">강사명</th>
                  <th className="w-24 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">플랫폼</th>
                  <th className="w-36 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">생성일시</th>
                  <th className="w-36 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">수정일시</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleRowClick(course)}
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{course.id}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                          <img 
                            src={course.thumbnail} 
                            alt="Thumbnail" 
                            className="h-8 w-8 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/128x128/e8e8e8/666666?text=No+Image';
                            }}
                          />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{course.title}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{course.instructor}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          course.platform === 'Udemy' 
                            ? 'bg-purple-200 text-purple-800' 
                            : 'bg-green-200 text-green-800'
                        }`}>
                          {course.platform}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{course.createdAt}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{course.updatedAt}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      {searchTerm ? '검색 결과가 없습니다.' : '표시할 강의 데이터가 없습니다.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {!searchTerm && filteredCourses.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {currentPage * limit + 1} - {Math.min((currentPage + 1) * limit, totalCount)} / {totalCount}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={!hasMore}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {isModalOpen && selectedCourse && (
        <CourseDetailModal 
          course={selectedCourse} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default CourseManagement;