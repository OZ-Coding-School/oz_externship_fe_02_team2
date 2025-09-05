export const WRAPPER_BASE = 'relative inline-block'

export const BUTTON_BASE = [
  'flex w-48 items-center justify-between gap-2',
  'rounded-lg border px-3 py-2 body-sm',
  'border-gray-300 bg-white',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
].join(' ')
export const BUTTON_DISABLED = 'opacity-60 cursor-not-allowed'
export const BUTTON_PLACEHOLDER = 'text-gray-400'
export const CARET = 'transition-transform duration-150'

export const MENU_BASE = [
  'absolute z-50 mt-1 w-full max-h-60 overflow-auto',
  'rounded-lg border border-gray-200 bg-white shadow-lg',
].join(' ')
export const menuAlignClass = (align: 'start' | 'end' = 'start') =>
  align === 'end' ? 'right-0' : 'left-0'

export const OPTION_BASE =
  'cursor-pointer select-none px-3 py-2 body-sm text-gray-800 hover:bg-indigo-50'
export const OPTION_ACTIVE = 'bg-indigo-50'
export const OPTION_SELECTED = 'font-medium'
export const OPTION_DISABLED = 'text-gray-300 cursor-not-allowed'
