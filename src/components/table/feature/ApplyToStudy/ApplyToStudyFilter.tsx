import { cn } from '@/lib'
import type { Maybe, TableFilterConfig, TableQuery } from '@/types'
import { TableFilterBar } from '../TableFilterBar'

export type ApplyToStudyFilterBarProps = {
  query: TableQuery
  onQueryChange: {
    setSearch: (q: string, immediate?: boolean) => void
    setStatus: (status: Maybe<string>) => void
    setRole: (role: Maybe<string>) => void
    reset: () => void
  }
  /** 덮어쓸 수 있는 옵션 (미지정 시 users 기본값 적용) */
  config?: Partial<TableFilterConfig>
  /** 추가로 넣을 우측/하단 커스텀 노드 (버튼, 토글 등) */
  children?: React.ReactNode

  /** ===== CSS 커스터마이징 포인트 ===== */
  /** 여백·높이 밀도: compact | normal */
  density?: 'compact' | 'normal'
  /** sticky 헤더로 상단 고정할 때 사용 (px 단위 오프셋) */
  stickyTop?: number
  /** 색 조합 톤: neutral(기본) | soft | elevated */
  tone?: 'neutral' | 'soft' | 'elevated'
  /** 추가 클래스 */
  className?: string
}

/** 유저 도메인 기본 옵션 */
const defaultUsersConfig: TableFilterConfig = {
  mode: 'server',
  searchPlaceholder: '공고명, 지원자 닉네임, 이메일 검색...',
  statusPlaceholder: '전체',
  statusOptions: [
    { label: '승인', value: '승인' },
    { label: '검토 중', value: '검토 중' },
    { label: '대기', value: '대기' },
    { label: '거절', value: '거절' },
  ],
  debounceMs: 200,
}

/** tone별 외곽 스타일 */
function toneBox(tone: ApplyToStudyFilterBarProps['tone']) {
  switch (tone) {
    case 'soft':
      return 'bg-gray-50 border-gray-200'
    case 'elevated':
      return 'bg-white/90 border-transparent shadow-sm ring-1 ring-black/5'
    case 'neutral':
    default:
      return 'bg-white border-gray-200'
  }
}

/** density별 padding/높이 조절 */
function densityBox(density: ApplyToStudyFilterBarProps['density']) {
  if (density === 'compact') {
    // 입력/버튼들이 조금 더 낮은 높이를 갖도록 wrapper만 타이트하게
    return 'p-2 sm:p-3 [&_.btn]:h-9 [&_input]:h-9'
  }
  return 'p-3 sm:p-4'
}

export default function ApplyToStudyFilterBar({
  query,
  onQueryChange,
  config,
  children,
  density = 'normal',
  stickyTop,
  tone = 'neutral',
  className,
}: ApplyToStudyFilterBarProps) {
  const mergedConfig: TableFilterConfig = {
    ...defaultUsersConfig,
    ...config,
    sortOptions: [
      { label: '최신순', value: 'created_desc' },
      { label: '오래된 순', value: 'created_asc' },
    ],
  }
  return (
    <div
      className={cn(
        // sticky 옵션
        stickyTop !== undefined && 'sticky z-20',
        className
      )}
      style={stickyTop !== undefined ? { top: `${stickyTop}px` } : undefined}
    >
      <TableFilterBar
        query={query}
        onQueryChange={onQueryChange}
        config={mergedConfig}
        className={cn(
          'users-filter rounded-xl border transition-colors',
          toneBox(tone),
          densityBox(density)
        )}
        showLabels
        labels={{ search: '검색', status: '스터디 상태', sort: '정렬' }}
        showFilters={{
          search: true,
          status: true,
          sort: true,
          role: false,
          reason: false, // 사용자 관리에서는 탈퇴사유 숨김
        }}
        gridColumns={4}
      >
        {/* 하단 커스텀 영역: 필요 시 버튼/토글/설명 배치 */}
        {children}
      </TableFilterBar>
    </div>
  )
}
