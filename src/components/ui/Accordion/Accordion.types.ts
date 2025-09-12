import type { ReactNode } from 'react'

/** 공통 아이콘 src 타입 */
type IconSrc = string

/** 하위 메뉴 아이템 */
export type AccordionItem = {
  defaultIcon: IconSrc
  activeIcon: IconSrc
  label: string
  onClick: () => void
  active?: boolean
}

/** 아이콘+라벨 공통 비주얼 베이스 */
type BaseVisual = {
  icon: IconSrc
  label: string
}

/** 한 섹션 내부에서 공유되는 상태(파생 포함) */
type AccordionSharedState = {
  /** rail에서 아이콘만 표시할지 여부(보통 rail로부터 파생) */
  iconOnly: boolean
  /** 패널 열림 상태 */
  open: boolean
  /** 사이드바 rail 모드 여부 */
  rail: boolean
}

/** 루트 아코디언 컴포넌트 */
export type AccordionProps = BaseVisual & {
  items: readonly AccordionItem[]
  rail?: boolean
  children?: ReactNode
}

/** 상단 헤더 메뉴(접기-펼치기 트리거) */
export type AccordionHeaderProps = BaseVisual &
  Pick<AccordionSharedState, 'iconOnly' | 'open' | 'rail'> & {
    onClick: () => void
  }

/** 펼치기/접기 셰브론 아이콘 */
export type AccordionChevronProps = Pick<AccordionSharedState, 'open'>

/** 하위 메뉴 목록 (래퍼) */
export type AccordionListProps = Pick<
  AccordionSharedState,
  'iconOnly' | 'open' | 'rail'
> & {
  items: readonly AccordionItem[]
  children?: ReactNode
}

/** 공통 목록 컴포넌트 - 아이콘+라벨 파츠 */
export type AccordionContentProps = Pick<BaseVisual, 'icon' | 'label'> & {
  iconOnly: boolean
  labelClassName?: string
}
