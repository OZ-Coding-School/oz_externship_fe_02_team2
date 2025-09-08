export type ModalSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'full'
export type ModalPlacement = 'center' | 'top'

export interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode

  /** aria-labelledby에 연결될 제목 */
  title?: string
  /** aria-describedby에 연결될 id */
  describedById?: string

  /** 닫기 동작 설정 */
  closeOnBackdrop?: boolean // 기본값: true
  closeOnEsc?: boolean // 기본값: true

  /** 포커스 관리 -> 게터 함수로 전환 */
  initialFocus?: () => HTMLElement | null

  /** 레이아웃 */
  size?: ModalSize // 기본값: lg
  placement?: ModalPlacement // 기본값: center
  maxHeightClass?: string // 기본값: 'max-h-[80vh]'
  className?: string // 추가 클래스
  zIndex?: number // 기본값: 1000

  /** 시각적 옵션 */
  showCloseIcon?: boolean // 기본값: true
  backdropClassName?: string // 백드롭 스타일 오버라이드
}
