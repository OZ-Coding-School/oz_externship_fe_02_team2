import React from 'react'
import type { Maybe, TableFilterConfig, TableQuery } from '@/types/table'
import { TableFilterBar } from '../TableFilterBar'
import { cn } from '@/lib/cn'

/** 유저 전용 필터바: 미세 CSS/여백/톤 조절용 래퍼 */
export type UsersFilterBarProps = {
  /** 상위에서 관리되는 쿼리 상태 */
  query: TableQuery
  /** 상위에서 내려주는 쿼리 변경 핸들러 */
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
  searchPlaceholder: '이름, 닉네임, 이름, ID 검색...',
  statusPlaceholder: '전체',
  rolePlaceholder: '전체',
  statusOptions: [
    { label: '활성', value: 'active' },
    { label: '비활성', value: 'inactive' },
    { label: '탈퇴요청', value: 'withdrawn' },
  ],
  roleOptions: [
    { label: '관리자', value: '관리자' },
    { label: '스태프', value: '스태프' },
    { label: '일반회원', value: '일반회원' },
  ],
  debounceMs: 200,
}

/** tone별 외곽 스타일 */
function toneBox(tone: UsersFilterBarProps['tone']) {
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
function densityBox(density: UsersFilterBarProps['density']) {
  if (density === 'compact') {
    // 입력/버튼들이 조금 더 낮은 높이를 갖도록 wrapper만 타이트하게
    return 'p-2 sm:p-3 [&_.btn]:h-9 [&_input]:h-9'
  }
  return 'p-3 sm:p-4'
}

export default function UsersFilterBar({
  query,
  onQueryChange,
  config,
  children,
  density = 'normal',
  stickyTop,
  tone = 'neutral',
  className,
}: UsersFilterBarProps) {
  const mergedConfig: TableFilterConfig = {
    ...defaultUsersConfig,
    ...config,
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
        labels={{ search: '검색', status: '상태', role: '권한' }}
        showFilters={{
          search: true,
          status: true,
          role: true,
          reason: false, // 사용자 관리에서는 탈퇴사유 숨김
        }}
      >
        {/* 하단 커스텀 영역: 필요 시 버튼/토글/설명 배치 */}
        {children}
      </TableFilterBar>
    </div>
  )
}
