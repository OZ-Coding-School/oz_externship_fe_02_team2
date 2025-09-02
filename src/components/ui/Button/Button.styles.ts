import type { ButtonSize, ButtonStyle } from './Button.types'

export const commonStyles: string =
  'flex justify-center items-center gap-x-2 cursor-pointer hover:opacity-90 active:opacity-80 transition disabled:cursor-not-allowed disabled:opacity-50'

export const buttonStyles: Record<ButtonStyle, string> = {
  primary: 'text-white bg-primary-blue',
  secondary: 'text-secondary-text bg-white shadow-[inset_0_0_0_1px_#d1d5db]',
  success: 'text-white bg-success',
  danger: 'text-white bg-danger',
  warning: 'text-white bg-primary',
  cancel: 'text-white bg-gray-500',
}

export const buttonSizes: Record<ButtonSize, string> = {
  small: 'rounded-sm px-2 py-1 body-xs font-medium',
  medium: 'rounded-lg px-4 py-2 body-sm font-medium',
  large: 'rounded-lg px-6 py-3 body-base font-medium',
}

export const iconOnlyButtonStyles: Record<ButtonStyle, string> = {
  primary: 'text-white bg-primary-blue',
  secondary: 'text-gray-600 bg-gray-100',
  success: 'text-success bg-success-100',
  danger: 'text-danger bg-danger-100',
  warning: 'text-warning bg-primary-100',
  cancel: 'text-gray-600 bg-gray-100',
}

export const iconOnlyButtonSizes: Record<ButtonSize, string> = {
  small: 'rounded-sm p-1',
  medium: 'rounded-lg p-2',
  large: 'rounded-lg p-3',
}
