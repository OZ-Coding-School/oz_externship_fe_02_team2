import React from 'react';
import { cn } from '@/lib/utils';

// Badge 컴포넌트 정의
const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, variant = 'default', size = 'md', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        // 기본 스타일
        'inline-flex items-center justify-center rounded-full transition-colors',
        // 크기별 스타일
        {
          'px-2 py-0.5 body-xs font-medium': size === 'sm',
          'px-2.5 py-1 body-sm font-medium': size === 'md',
          'px-3 py-1.5 body-md font-medium': size === 'lg',
        },
        // 변형별 스타일
        {
          // Default - 회색 계열
          'bg-gray-100 text-gray-700 border border-gray-200': variant === 'default',
          
          // Primary - 주황색 계열 (StudyHub 메인 컬러)
          'bg-orange-100 text-orange-700 border border-orange-200': variant === 'primary',
          
          // Secondary - 회색 계열
          'bg-gray-100 text-gray-600 border border-gray-200': variant === 'secondary',
          
          // Success - 초록색 계열
          'bg-green-100 text-green-700 border border-green-200': variant === 'success',
          
          // Warning - 노란색 계열
          'bg-yellow-100 text-yellow-700 border border-yellow-200': variant === 'warning',
          
          // Danger - 빨간색 계열
          'bg-red-100 text-red-700 border border-red-200': variant === 'danger',
          
          // Info - 파란색 계열
          'bg-blue-100 text-blue-700 border border-blue-200': variant === 'info',
          
          // Outline - 테두리만
          'bg-transparent text-gray-700 border border-gray-300': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = 'Badge';

// Badge 테스트 페이지
export default function BadgeTest() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="heading-2xl font-bold text-primary-text mb-2">Badge 컴포넌트 테스트</h1>
      <p className="body-md text-secondary-text mb-8">뱃지의 놀라운 가짓수를 확인하세요.</p>

      {/* 스타일별 뱃지 */}
      <section className="mb-12">
        <h2 className="heading-xl font-semibold text-primary-text mb-6">스타일별 뱃지</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-background rounded-lg border border-border">
            <Badge variant="default">클릭 첫 수: 0</Badge>
            <p className="body-sm text-secondary-text mt-2">기본</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border border-border">
            <Badge variant="primary">클릭 첫 수: 0</Badge>
            <p className="body-sm text-secondary-text mt-2">주요</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border border-border">
            <Badge variant="success">클릭 첫 수: 0</Badge>
            <p className="body-sm text-secondary-text mt-2">성공</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border border-border">
            <Badge variant="danger">클릭 첫 수: 0</Badge>
            <p className="body-sm text-secondary-text mt-2">위험</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border border-border">
            <Badge variant="warning">클릭 첫 수: 0</Badge>
            <p className="body-sm text-secondary-text mt-2">경고</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border border-border">
            <Badge variant="info">클릭 첫 수: 0</Badge>
            <p className="body-sm text-secondary-text mt-2">정보</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border border-border">
            <Badge variant="secondary">클릭 첫 수: 0</Badge>
            <p className="body-sm text-secondary-text mt-2">보조</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border border-border">
            <Badge variant="outline">클릭 첫 수: 0</Badge>
            <p className="body-sm text-secondary-text mt-2">외곽선</p>
          </div>
        </div>
      </section>

      {/* 사이즈별 뱃지 */}
      <section className="mb-12">
        <h2 className="heading-xl font-semibold text-primary-text mb-6">사이즈별 뱃지</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge variant="primary" size="sm">클릭 횟수: 0</Badge>
          <Badge variant="primary" size="md">클릭 횟수: 0</Badge>
          <Badge variant="primary" size="lg">클릭 횟수: 0</Badge>
        </div>
      </section>

      {/* 아이콘 뱃지 */}
      <section className="mb-12">
        <h2 className="heading-xl font-semibold text-primary-text mb-6">아이콘 뱃지</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="primary" className="gap-1">
            <span>📥</span>
            다운로드
          </Badge>
          <Badge variant="outline" className="gap-1">
            <span>📤</span>
            공유
          </Badge>
          <Badge variant="default" className="gap-1">
            <span>⚙️</span>
          </Badge>
          <Badge variant="danger" className="gap-1">
            <span>🗑️</span>
          </Badge>
        </div>
      </section>

      {/* 비활성 뱃지 */}
      <section className="mb-12">
        <h2 className="heading-xl font-semibold text-primary-text mb-6">비활성 뱃지</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="primary" className="opacity-50 cursor-not-allowed">클릭 횟수: 0</Badge>
          <Badge variant="outline" className="opacity-50 cursor-not-allowed gap-1">
            <span>📤</span>
            공유
          </Badge>
          <Badge variant="danger" className="opacity-50 cursor-not-allowed gap-1">
            <span>🗑️</span>
          </Badge>
        </div>
      </section>

      {/* 실제 사용 예시 */}
      <section className="mb-12">
        <h2 className="heading-xl font-semibold text-primary-text mb-6">실제 사용 예시</h2>
        
        <div className="space-y-8">
          {/* 상태 표시 */}
          <div>
            <h3 className="body-lg font-medium text-primary-text mb-3">상태 표시</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">활성</Badge>
              <Badge variant="warning">대기중</Badge>
              <Badge variant="danger">비활성</Badge>
              <Badge variant="info">검토중</Badge>
            </div>
          </div>

          {/* 우선순위 */}
          <div>
            <h3 className="body-lg font-medium text-primary-text mb-3">우선순위</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="danger">높음</Badge>
              <Badge variant="warning">보통</Badge>
              <Badge variant="secondary">낮음</Badge>
            </div>
          </div>

          {/* 카테고리 */}
          <div>
            <h3 className="body-lg font-medium text-primary-text mb-3">카테고리</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">개발</Badge>
              <Badge variant="info">디자인</Badge>
              <Badge variant="success">마케팅</Badge>
              <Badge variant="warning">기획</Badge>
              <Badge variant="outline">운영</Badge>
            </div>
          </div>

          {/* 알림 뱃지 */}
          <div>
            <h3 className="body-lg font-medium text-primary-text mb-3">알림 뱃지</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="body-md text-primary-text">메시지</span>
                <Badge size="sm" variant="danger" className="min-w-[20px] h-5">3</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="body-md text-primary-text">알림</span>
                <Badge size="sm" variant="primary" className="min-w-[24px] h-5">12</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="body-md text-primary-text">새 글</span>
                <Badge size="sm" variant="success" className="min-w-[20px] h-5">5</Badge>
              </div>
            </div>
          </div>

          {/* 온라인 상태 */}
          <div>
            <h3 className="body-lg font-medium text-primary-text mb-3">온라인 상태</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Badge variant="success" size="sm">온라인</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <Badge variant="warning" size="sm">자리비움</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <Badge variant="danger" size="sm">오프라인</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <Badge variant="secondary" size="sm">알 수 없음</Badge>
              </div>
            </div>
          </div>

          {/* 태그 형태 */}
          <div>
            <h3 className="body-lg font-medium text-primary-text mb-3">태그</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">#React</Badge>
              <Badge variant="outline">#TypeScript</Badge>
              <Badge variant="outline">#TailwindCSS</Badge>
              <Badge variant="outline">#디자인시스템</Badge>
              <Badge variant="outline">#컴포넌트</Badge>
            </div>
          </div>

          {/* 진행률 뱃지 */}
          <div>
            <h3 className="body-lg font-medium text-primary-text mb-3">진행률</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="danger">0%</Badge>
              <Badge variant="warning">25%</Badge>
              <Badge variant="warning">50%</Badge>
              <Badge variant="success">75%</Badge>
              <Badge variant="success">100%</Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}