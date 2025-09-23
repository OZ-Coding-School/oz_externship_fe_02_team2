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

// CourseDetailModal 컴포넌트의 props 타입을 정의합니다.
interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="relative w-[896px] max-w-[896px] rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold text-gray-800">강의 상세 정보</h2>
          <button onClick={onClose} className="text-2xl text-gray-600 hover:text-gray-800">&times;</button>
        </div>
        <div className="grid grid-cols-[320px,1fr] gap-8 p-6">
          {/* 왼쪽 섹션 */}
          <div className="w-[320px]">
            <div className="mb-6">
              <div className="w-72 h-48 bg-blue-200 rounded-lg flex items-center justify-center">
                <div className="text-6xl text-cyan-500 font-bold">⚛</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">고유 ID</p>
                <p className="text-sm font-medium text-gray-800">{course.id}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-600">UUID</p>
                <p className="text-sm font-medium text-gray-800">{course.uuid}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-600">강의명</p>
                <p className="text-sm font-semibold text-gray-800">{course.title}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-600">강사명</p>
                <p className="text-sm font-medium text-gray-800">{course.instructor}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-600">플랫폼</p>
                <a href={course.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-purple-600 hover:underline">
                  {course.platform}
                </a>
              </div>
              
              <div>
                <p className="text-xs text-gray-600">바로가기 링크</p>
                <a href={course.link} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-500 hover:underline break-all">
                  {course.link}
                </a>
              </div>
            </div>
          </div>
          
          {/* 오른쪽 섹션 */}
          <div className="flex-1">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-2">강의 설명</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-600">강의 난이도</p>
                  <p className="text-sm font-medium text-orange-500">{course.difficulty}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">총 강의 길이</p>
                  <p className="text-sm font-medium text-gray-800">{course.duration}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-600">원 가격</p>
                  <p className="text-sm text-gray-600 line-through">{course.originalPrice}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">할인된 가격</p>
                  <p className="text-lg font-bold text-orange-500">{course.discountedPrice}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-gray-600 mb-2">해당 카테고리</p>
                <div className="flex flex-wrap gap-2">
                  {course.categories.map((category: string, index: number) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded">{category}</span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div>
                  <p className="text-xs text-gray-600">생성일시</p>
                  <p className="text-sm font-medium text-gray-800">{course.createdAt}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">수정일시</p>
                  <p className="text-sm font-medium text-gray-800">{course.updatedAt}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t p-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">닫기</button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailModal;