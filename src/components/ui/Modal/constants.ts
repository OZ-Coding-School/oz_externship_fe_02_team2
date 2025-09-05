import type { ModalPlacement, ModalSize } from '@/types'

export const SIZE_CLASS: Record<ModalSize, string> = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  full: 'w-screen h-screen max-w-none',
}

export const PLACEMENT_CLASS: Record<ModalPlacement, string> = {
  center: 'items-center',
  top: 'items-start pt-16',
}
