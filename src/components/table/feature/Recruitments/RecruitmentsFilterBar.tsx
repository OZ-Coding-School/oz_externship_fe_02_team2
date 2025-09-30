import type { Maybe, TableFilterConfig, TableQuery } from '@/types/table'
import { TableFilterBar } from '../TableFilterBar'
import { cn } from '@/lib/cn'

/** 구인공고 전용 필터바 */
export type RecruitmentsFilterBarProps = {
  /** 상위에서 관리되는 쿼리 상태 */
  query: TableQuery
  /** 상위에서 내려주는 쿼리 변경 핸들러 */
  onQueryChange: {
    setSearch: (q: string, immediate?: boolean) => void
    setStatus: (status: Maybe<string>) => void
    setRole: (role: Maybe<string>) => void
    reset: () => void
  }
  /** 덮어쓸 수 있는 옵션 */
  config?: Partial<TableFilterConfig>
  /** 추가로 넣을 우측/하단 커스텀 노드 */
  children?: React.ReactNode

  /** CSS 커스터마이징 */
  density?: 'compact' | 'normal'
  stickyTop?: number
  tone?: 'neutral' | 'soft' | 'elevated'
  className?: string
}

/** 구인공고 도메인 기본 옵션 */
const defaultRecruitmentsConfig: TableFilterConfig = {
  mode: 'server',
  searchPlaceholder: '공고 제목 검색...',
  statusPlaceholder: '전체',
  statusOptions: [
    { label: '모집중', value: 'OPEN' },
    { label: '마감', value: 'CLOSED' },
  ],
  debounceMs: 200,
}

/** tone별 외곽 스타일 */
function toneBox(tone: RecruitmentsFilterBarProps['tone']) {
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
function densityBox(density: RecruitmentsFilterBarProps['density']) {
  if (density === 'compact') {
    return 'p-2 sm:p-3 [&_.btn]:h-9 [&_input]:h-9'
  }
  return 'p-3 sm:p-4'
}

export default function RecruitmentsFilterBar({
  query,
  onQueryChange,
  config,
  children,
  density = 'normal',
  stickyTop,
  tone = 'neutral',
  className,
}: RecruitmentsFilterBarProps) {
  const mergedConfig: TableFilterConfig = {
    ...defaultRecruitmentsConfig,
    ...config,
  }

  return (
    <div
      className={cn(stickyTop !== undefined && 'sticky z-20', className)}
      style={stickyTop !== undefined ? { top: `${stickyTop}px` } : undefined}
    >
      <TableFilterBar
        query={query}
        onQueryChange={onQueryChange}
        config={mergedConfig}
        className={cn(
          'recruitments-filter rounded-xl border transition-colors',
          toneBox(tone),
          densityBox(density)
        )}
        showLabels
        labels={{ search: '검색', status: '공고 상태' }}
        showFilters={{
          search: true,
          status: true,
          role: false,
          reason: false,
        }}
        gridColumns={4}
      >
        {children}
      </TableFilterBar>
    </div>
  )
}
