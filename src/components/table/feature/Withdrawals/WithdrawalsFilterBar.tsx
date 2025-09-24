import React from 'react'
import type {
  EnhancedTableQuery, // 변경: Config가 아닌 Query 타입
  EnhancedTableFilterConfig,
  EnhancedQueryChangeHandlers,
} from '@/types/table'
import { TableFilterBar } from '../TableFilterBar'
import { cn } from '@/lib/cn'
import {
  DEFAULT_ROLE_OPTIONS,
  WITHDRAWAL_REASONS,
} from '@/constants/table/table'

/** 탈퇴 전용 필터바: 미세 CSS/여백/톤 조절용 래퍼 */
export type WithdrawalsFilterBarProps = {
  /** 상위에서 관리되는 쿼리 상태 */
  query: EnhancedTableQuery // 수정: Config → Query
  /** 상위에서 내려주는 쿼리 변경 핸들러 */
  onQueryChange: EnhancedQueryChangeHandlers // 수정: 타입 사용
  /** 덮어쓸 수 있는 옵션 (미지정 시 users 기본값 적용) */
  config?: Partial<EnhancedTableFilterConfig>
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

/** 탈퇴사유 도메인 기본 옵션 */
const defaultWithdrawalsConfig: EnhancedTableFilterConfig = {
  mode: 'server',
  searchPlaceholder: '탈퇴요청 ID, 이메일, 이름 검색...',
  withdrawalReasonPlaceholder: '전체',
  rolePlaceholder: '전체',
  // 중앙화된 상수 사용
  withdrawalReasonOptions: WITHDRAWAL_REASONS,
  roleOptions: DEFAULT_ROLE_OPTIONS,
  debounceMs: 200,
}

/** tone별 외곽 스타일 */
function toneBox(tone: WithdrawalsFilterBarProps['tone']) {
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
function densityBox(density: WithdrawalsFilterBarProps['density']) {
  if (density === 'compact') {
    return 'p-2 sm:p-3 [&_.btn]:h-9 [&_input]:h-9'
  }
  return 'p-3 sm:p-4'
}

export default function WithdrawalsFilterBar({
  query,
  onQueryChange,
  config,
  children,
  density = 'normal',
  stickyTop,
  tone = 'neutral',
  className,
}: WithdrawalsFilterBarProps) {
  const mergedConfig: EnhancedTableFilterConfig = {
    ...defaultWithdrawalsConfig,
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
          'users-filter rounded-xl border transition-colors',
          toneBox(tone),
          densityBox(density)
        )}
        showLabels
        labels={{
          search: '검색',
          withdrawalReason: '탈퇴사유',
          role: '권한',
        }}
        showFilters={{
          search: true,
          reason: true,
          status: false,
          role: true,
        }}
      >
        {children}
      </TableFilterBar>
    </div>
  )
}
