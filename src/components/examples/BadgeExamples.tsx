
import { Badge } from '@/components/ui/Badge';

export function BadgeExamples() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-4">일반 배지</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">정보성 내용입니다.</Badge>
          <Badge variant="success">작업이 완료되어 완료되었습니다.</Badge>
          <Badge variant="warning">주의가 필요한 상황입니다.</Badge>
          <Badge variant="danger">중요한 정보입니다.</Badge>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">솔리드 배지</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary-solid">Primary</Badge>
          <Badge variant="secondary-solid">Secondary</Badge>
          <Badge variant="success-solid">Success</Badge>
          <Badge variant="warning-solid">Warning</Badge>
          <Badge variant="danger-solid">Danger</Badge>
          <Badge variant="info-solid">Info</Badge>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">아웃라인 배지</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">크기별 배지</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary" size="sm">Small</Badge>
          <Badge variant="primary" size="md">Medium</Badge>
          <Badge variant="primary" size="lg">Large</Badge>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">실제 사용 예시</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span>배지 담당자:</span>
            <Badge variant="primary">김민제</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>진행 표시:</span>
            <Badge variant="success">완료</Badge>
            <Badge variant="warning">진행 중</Badge>
            <Badge variant="danger">대기</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}