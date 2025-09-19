import type { Option } from '@/components/ui/Dropdown/Dropdown.types'

export const DROPDOWN_PERIOD_OPTIONS: readonly Option[] = [
  { value: 'MONTHLY', label: '월별' },
  { value: 'ANNUAL', label: '연별' },
]

export const DROPDOWN_REASON_OPTIONS: readonly Option[] = [
  { value: 'DISSATISFACTION', label: '서비스 불만족' },
  { value: 'PRIVACY_CONCERNS', label: '개인정보 우려' },
  { value: 'LOW_USAGE', label: '사용 빈도 낮음' },
  { value: 'COMPETITOR_SERVICE', label: '경쟁 서비스 이용' },
  { value: 'OTHER', label: '기타' },
]
