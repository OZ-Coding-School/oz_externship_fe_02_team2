import type { InputSize } from '@/types/input'

export const sizeMap: Record<
  InputSize,
  { input: string; label: string; msg: string }
> = {
  sm: { input: 'h-9 px-3 text-sm', label: 'text-sm', msg: 'mt-1 text-xs' },
  md: { input: 'h-10 px-3 text-base', label: 'text-sm', msg: 'mt-1 text-xs' },
  lg: {
    input: 'h-12 px-4 text-base',
    label: 'text-base',
    msg: 'mt-1.5 text-sm',
  },
}

export const baseInput = [
  'w-full rounded-lg outline-none transition-colors',
  // 배경
  'bg-white dark:bg-gray-800',
  // 텍스트 & 플레이스홀더
  'text-primary-text dark:text-gray-50',
  'placeholder-gray-400 dark:placeholder-gray-400',
  // 보더
  'border border-gray-300 dark:border-color-gray-700',
  // 포커스 링
  'focus-visible:ring-2 focus-visible:ring-primary-200 dark:focus-visible:ring-primary-600',
  // disabled
  'disabled:bg-gray-50 dark:disabled:bg-[color:rgb(31,41,55)] disabled:text-gray-500',
].join(' ')

export const errorInput =
  'border-danger-500 focus-visible:ring-danger-100 dark:focus-visible:ring-danger-600'

export const labelCls =
  'mb-1.5 font-semibold text-secondary-text dark:text-gray-100'
