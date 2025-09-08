import { cn } from '@/lib'

export const WRAPPER_BASE = cn('relative', 'inline-block')

export const BUTTON_BASE = cn(
  'flex w-48 items-center justify-between gap-2',
  'rounded-lg border px-3 py-2 body-sm',
  'border-gray-300 bg-white text-gray-500',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'
)
export const BUTTON_DISABLED = cn('opacity-60 cursor-not-allowed')
export const BUTTON_PLACEHOLDER = cn('text-gray-400')
export const CARET = cn('transition-transform duration-150')

export const MENU_BASE = cn(
  'absolute z-20 mt-1 w-full max-h-60 overflow-auto',
  'rounded-lg border border-gray-200 bg-white shadow-lg'
)
export const menuAlignClass = (align: 'start' | 'end' = 'start') =>
  cn(align === 'end' ? 'right-0' : 'left-0')

export const OPTION_BASE = cn(
  'cursor-pointer select-none px-3 py-2 body-sm text-gray-800 hover:bg-indigo-50'
)
export const OPTION_ACTIVE = cn('bg-indigo-50')
export const OPTION_SELECTED = cn('font-medium')
export const OPTION_DISABLED = cn('text-gray-300 cursor-not-allowed')
