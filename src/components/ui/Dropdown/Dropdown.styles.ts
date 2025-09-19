import { cn } from '@/lib'

export const WRAPPER_BASE = cn('relative', 'inline-block')

export const BUTTON_BASE = cn(
  'flex w-48 h-9 items-center justify-between gap-2',
  'rounded-lg pl-[13px] pr-[5px] py-[9px] body-sm',
  'shadow-[inset_0_0_0_1px_#D1D5DB] bg-[#EFEFEF]text-[#000000]',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue'
)
export const BUTTON_DISABLED = cn('opacity-60 cursor-not-allowed')
export const BUTTON_PLACEHOLDER = cn('text-gray-400')
export const CARET = cn('transition-transform duration-200')

export const MENU_BASE = cn(
  'absolute z-20 mt-1 w-full max-h-60 overflow-auto',
  'rounded-lg border border-gray-200 bg-white shadow-lg'
)
export const menuAlignClass = (align: 'start' | 'end' = 'start') =>
  cn(align === 'end' ? 'right-0' : 'left-0')

export const OPTION_BASE = cn(
  'cursor-pointer select-none px-3 py-2 body-sm text-gray-800 hover:bg-indigo-50'
)
export const OPTION_ACTIVE = cn('bg-primary-blue/5')
export const OPTION_SELECTED = cn('font-medium')
export const OPTION_DISABLED = cn('text-gray-300 cursor-not-allowed')
