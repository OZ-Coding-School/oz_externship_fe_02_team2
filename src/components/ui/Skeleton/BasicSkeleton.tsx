import { cn } from '@/lib/cn'

/**
 * 중앙 로딩 스피너 + 배경 컨테이너
 * - 전체 화면, 섹션, 카드 등 어디에나 재사용 가능
 */
type BasicSkeletonProps = {
  /** 전체 화면 차지 여부 (기본: true) */
  fullscreen?: boolean
  /** 커스텀 클래스 */
  className?: string
  /** 설명 텍스트 */
  label?: string
}

export default function BasicSkeleton({
  fullscreen = true,
  className,
  label = 'Loading…',
}: BasicSkeletonProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        fullscreen ? 'min-h-dvh' : 'p-6',
        className
      )}
      role="status"
      aria-busy="true"
      aria-label={label}
    >
      {/* 스피너 */}
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-600" />

      {/* 텍스트 */}
      {label && <p className="mt-3 text-sm text-gray-500">{label}</p>}
    </div>
  )
}
