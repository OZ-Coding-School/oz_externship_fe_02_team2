import InfoIcon from '@assets/icons/toast_info.svg'
import SuccessIcon from '@assets/icons/toast_success.svg'
import WarningIcon from '@assets/icons/toast_warning.svg'
import ErrorIcon from '@assets/icons/toast_error.svg'

export const TOAST_COMMON_STYLES =
  'animate-fade-in-out-toast flex justify-start items-center gap-x-3 w-5/6 p-[17px] rounded-lg opacity-0 transition'

export const TOAST_STYLES = {
  info: {
    border: 'shadow-[inset_0_0_0_1px_#BFDBFE]',
    bg: 'bg-[#EFF6FF]',
    title: 'body-sm font-medium text-[#1E40AF]',
    content: 'body-sm text-[#1D4ED8]',
  },
  success: {
    border: 'shadow-[inset_0_0_0_1px_#BBF7D0]',
    bg: 'bg-[#F0FDF4]',
    title: 'body-sm font-medium text-success-800',
    content: 'body-sm text-[#15803D]',
  },
  warning: {
    border: 'shadow-[inset_0_0_0_1px_#FEF08A]',
    bg: 'bg-primary-50',
    title: 'body-sm font-medium text-primary-800',
    content: 'body-sm text-primary-700',
  },
  error: {
    border: 'shadow-[inset_0_0_0_1px_#FECACA]',
    bg: 'bg-[#FEF2F2]',
    title: 'body-sm font-medium text-danger-800',
    content: 'body-sm text-[#B91C1C]',
  },
}

export const TOAST_ICON = {
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
}

export const TOAST_DEFAULT_TITLE = {
  info: '정보',
  success: '성공',
  warning: '경고',
  error: '오류',
}

export const TOAST_DEFAULT_CONTENT = {
  info: '정보성 메시지입니다.',
  success: '작업이 성공적으로 완료되었습니다.',
  warning: '주의가 필요한 상황입니다.',
  error: '오류가 발생했습니다.',
}
