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
  'w-full rounded-xl outline-none transition-colors',
  // 배경
  'bg-white dark:bg-[var(--color-gray-800)]',
  // 텍스트 & 플레이스홀더
  'text-[var(--color-primary-text)] dark:text-[var(--color-gray-50)]',
  'placeholder-[var(--color-muted-text)] dark:placeholder-[var(--color-gray-400)]',
  // 보더
  'border border-[var(--color-gray-300)] dark:border-[var(--color-gray-700)]',
  // 포커스 링
  'focus-visible:ring-4 focus-visible:ring-[var(--color-primary-200)] dark:focus-visible:ring-[var(--color-primary-600)]',
  // disabled
  'disabled:bg-[var(--color-gray-100)] dark:disabled:bg-[color:rgb(31,41,55)] disabled:text-[var(--color-gray-500)]',
].join(' ')

export const errorInput =
  'border-[var(--color-danger-500)] focus-visible:ring-[var(--color-danger-100)] dark:focus-visible:ring-[var(--color-danger-600)]'

export const labelCls =
  'mb-1.5 font-semibold text-[var(--color-secondary-text)] dark:text-[var(--color-gray-100)]'
