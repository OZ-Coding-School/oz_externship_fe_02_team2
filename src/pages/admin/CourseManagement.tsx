import { useState } from 'react';
import CourseDetailModal from 'src/components/course/CourseDetailModal';

// 강의 데이터의 타입을 정의합니다.
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

// 더미 강의 데이터 (미션지 썸네일과 동일하게 수정됨)
const DUMMY_COURSES: Course[] = [
  {
    id: 1,
    thumbnail: 'https://placehold.co/128x128/f0f4f8/333333?text=React',
    title: 'React 완벽 가이드 - Hooks, Context, Redux부터 Next.js까지',
    instructor: '김도현',
    platform: 'Udemy',
    createdAt: '2024-01-15 09:30',
    updatedAt: '2024-01-20 14:25',
    description: '실무에서 바로 활용할 수 있는 React 개발 기술을 끝까지 체계적으로 학습할 수 있는, 완벽한 강의입니다.',
    difficulty: '중급',
    duration: '24.30',
    originalPrice: '220,000원',
    discountedPrice: '89,000원',
    categories: ['웹 개발', 'React', 'JavaScript', 'Frontend'],
    uuid: 'course-uuid-001',
    link: 'https://www.udemy.com/course/react-complete-guide',
  },
  {
    id: 2,
    thumbnail: 'https://placehold.co/128x128/e8f0f4/333333?text=Spring',
    title: 'Spring Boot와 JPA 실무 완전 정복',
    instructor: '이영한',
    platform: 'Inflearn',
    createdAt: '2024-01-10 11:20',
    updatedAt: '2024-01-18 16:45',
    description: '실무에서 자주 사용되는 Spring Boot와 JPA 기술을 깊이 있게 다루는 강의입니다.',
    difficulty: '중급',
    duration: '32.10',
    originalPrice: '150,000원',
    discountedPrice: '60,000원',
    categories: ['웹 개발', 'Spring', 'Java', 'Backend'],
    uuid: 'course-uuid-002',
    link: 'https://www.inflearn.com/course/spring-boot-jpa-practical',
  },
  {
    id: 3,
    thumbnail: 'https://placehold.co/128x128/f0f4f8/333333?text=Python',
    title: 'Python으로 배우는 머신러닝과 데이터 분석',
    instructor: '박데이터',
    platform: 'Udemy',
    createdAt: '2024-01-12 08:15',
    updatedAt: '2024-01-22 10:30',
    description: 'Python을 활용하여 머신러닝과 데이터 분석의 기본부터 실전까지 학습하는 강의입니다.',
    difficulty: '초급',
    duration: '15.45',
    originalPrice: '180,000원',
    discountedPrice: '75,000원',
    categories: ['데이터 과학', 'Python', '머신러닝'],
    uuid: 'course-uuid-003',
    link: 'https://www.udemy.com/course/python-machine-learning-data-analysis',
  },
  {
    id: 4,
    thumbnail: 'https://placehold.co/128x128/e8f0f4/333333?text=Vue',
    title: 'Vue.js 3 Composition API 마스터하기',
    instructor: '최프론트',
    platform: 'Inflearn',
    createdAt: '2024-01-08 14:50',
    updatedAt: '2024-01-25 09:15',
    description: 'Vue.js 3의 핵심인 Composition API를 실무 예제와 함께 마스터하는 강의입니다.',
    difficulty: '중급',
    duration: '18.50',
    originalPrice: '110,000원',
    discountedPrice: '45,000원',
    categories: ['웹 개발', 'Vue.js', 'Frontend'],
    uuid: 'course-uuid-004',
    link: 'https://www.inflearn.com/course/vuejs-composition-api',
  },
  {
    id: 5,
    thumbnail: 'https://placehold.co/128x128/f0f4f8/333333?text=Docker',
    title: 'Docker & Kubernetes 실전 가이드',
    instructor: '김데브옵스',
    platform: 'Udemy',
    createdAt: '2024-01-05 16:30',
    updatedAt: '2024-01-19 12:00',
    description: 'Docker와 Kubernetes를 사용하여 애플리케이션을 배포하고 관리하는 방법을 배우는 강의입니다.',
    difficulty: '고급',
    duration: '21.00',
    originalPrice: '250,000원',
    discountedPrice: '100,000원',
    categories: ['DevOps', 'Docker', 'Kubernetes'],
    uuid: 'course-uuid-005',
    link: 'https://www.udemy.com/course/docker-kubernetes-practical-guide',
  },
];

// 메인 컴포넌트
const CourseManagement = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // 검색 필터링 로직
  const filteredCourses = DUMMY_COURSES.filter(course =>
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
  
  return (
    <div className="min-h-screen font-sans bg-white p-10">
      <h1 className="mb-8 text-3xl font-bold">강의 관리</h1>

      {/* 검색창 */}
      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
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
                  key={course.uuid}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleRowClick(course)}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{course.id}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                      <img src={course.thumbnail} alt="Thumbnail" className="h-8 w-8 object-contain" />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{course.title}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{course.instructor}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${course.platform === 'Udemy' ? 'bg-purple-200 text-purple-800' : 'bg-green-200 text-green-800'}`}>{course.platform}</span>
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
      {isModalOpen && <CourseDetailModal course={selectedCourse} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default CourseManagement;