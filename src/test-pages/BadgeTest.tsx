import React from 'react';
import { cn } from 'src/lib/cn';

// Badge 컴포넌트 정의
const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, variant = 'default', size = 'lg', ...props }, ref) => {
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
          'px-3 py-1.5 body-base font-medium': size === 'lg',
        },
        // 변형별 스타일
        {
          // Default - 회색 계열
          'bg-gray-100 text-gray-600': variant === 'default',

          // Primary - 메인 컬러
          'bg-primary-100 text-primary-500': variant === 'primary' || variant === 'warning',

          // Secondary - 회색 계열
          'bg-gray-100 text-gray-500': variant === 'secondary',

          // Success - 초록색 계열
          'bg-success-100 text-success-600': variant === 'success',

          // Danger - 빨간색 계열
          'bg-danger-100 text-danger-600': variant === 'danger',

          // Info - 파란색 계열 (회색 계열 사용)
          'bg-gray-200 text-gray-600': variant === 'info',

          // Outline - 테두리만
          'bg-transparent text-gray-600': variant === 'outline',
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
      <p className="body-base text-secondary-text mb-8">배지의 다양한 가짓수를 확인하세요.</p>

      {/* 스타일별 뱃지 */}
      <section className="mb-12">
        <h2 className="heading-xl font-semibold text-primary-text mb-6">스타일별 배지</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-background rounded-lg">
            <Badge variant="default">default</Badge>
            <p className="body-sm text-secondary-text mt-2">기본</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <Badge variant="primary">primary</Badge>
            <p className="body-sm text-secondary-text mt-2">주요</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <Badge variant="success">success</Badge>
            <p className="body-sm text-secondary-text mt-2">성공</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <Badge variant="danger">danger</Badge>
            <p className="body-sm text-secondary-text mt-2">위험</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <Badge variant="warning">warning</Badge>
            <p className="body-sm text-secondary-text mt-2">경고</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <Badge variant="info">info</Badge>
            <p className="body-sm text-secondary-text mt-2">정보</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <Badge variant="secondary">secondary</Badge>
            <p className="body-sm text-secondary-text mt-2">보조</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <Badge variant="outline" className="shadow-[inset_0_0_0_1px_#d1d5db]">outline</Badge>
            <p className="body-sm text-secondary-text mt-2">외곽선</p>
          </div>
        </div>
      </section>

      {/* 사이즈별 뱃지 */}
      <section className="mb-12">
        <h2 className="heading-xl font-semibold text-primary-text mb-6">사이즈별 배지</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge variant="primary" size="sm">small</Badge>
          <Badge variant="primary" size="md">medium</Badge>
          <Badge variant="primary" size="lg">large</Badge>
        </div>
      </section>

      {/* 아이콘 뱃지 */}
      <section className="mb-12">
        <h2 className="heading-xl font-semibold text-primary-text mb-6">아이콘 배지</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="primary" className="gap-1">
            <span>📥</span>
            다운로드
          </Badge>
          <Badge variant="outline" className="gap-1 shadow-[inset_0_0_0_1px_#d1d5db]">
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

      {/* 실제 사용 예시 */}
      <section className="mb-12">
        <h2 className="mb-6">실제 사용 예시</h2>
        
        <div className="space-y-8">
          {/* 상태 표시 */}
          <div>
            <h3 className="mb-3">상태 표시</h3>
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
              <Badge variant="outline" className="shadow-[inset_0_0_0_1px_#d1d5db]">운영</Badge>
            </div>
          </div>

          {/* 알림 뱃지 */}
          <div>
            <h3 className="body-lg font-medium text-primary-text mb-3">알림 배지</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="body-base text-primary-text">메시지</span>
                <Badge size="sm" variant="danger" className="min-w-[20px] h-5">3</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="body-base text-primary-text">알림</span>
                <Badge size="sm" variant="primary" className="min-w-[24px] h-5">12</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="body-base text-primary-text">새 글</span>
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
              <Badge variant="outline" className="shadow-[inset_0_0_0_1px_#d1d5db]">#React</Badge>
              <Badge variant="outline" className="shadow-[inset_0_0_0_1px_#d1d5db]">#TypeScript</Badge>
              <Badge variant="outline" className="shadow-[inset_0_0_0_1px_#d1d5db]">#TailwindCSS</Badge>
              <Badge variant="outline" className="shadow-[inset_0_0_0_1px_#d1d5db]">#디자인시스템</Badge>
              <Badge variant="outline" className="shadow-[inset_0_0_0_1px_#d1d5db]">#컴포넌트</Badge>
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
