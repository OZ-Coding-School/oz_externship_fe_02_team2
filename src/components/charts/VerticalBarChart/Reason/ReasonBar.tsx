import { Bar } from 'react-chartjs-2'
import { COMMON_BAR_OPTIONS } from '../VerticalBarChart.options'
import {
  COMPETITOR_SERVICE_DATA,
  DISSATISFACTION_DATA,
  LOW_USAGE_DATA,
  OTHER_DATA,
  PRIVACY_CONCERNS_DATA,
} from './config'

type ReasonBarProps = {
  /** 탈퇴 사유: DISSATISFACTION, PRIVACY_CONCERNS, LOW_USAGE, COMPETITOR_SERVICE, OTHER */
  reason: string
}

export default function ReasonBar({ reason }: ReasonBarProps) {
  // TODO: 드롭다운 선택 바뀌면 쿼리 다르게 요청, 데이터 받아오기
  switch (reason) {
    case 'DISSATISFACTION':
      return <Bar options={COMMON_BAR_OPTIONS} data={DISSATISFACTION_DATA} />
    case 'PRIVACY_CONCERNS':
      return <Bar options={COMMON_BAR_OPTIONS} data={PRIVACY_CONCERNS_DATA} />
    case 'LOW_USAGE':
      return <Bar options={COMMON_BAR_OPTIONS} data={LOW_USAGE_DATA} />
    case 'COMPETITOR_SERVICE':
      return <Bar options={COMMON_BAR_OPTIONS} data={COMPETITOR_SERVICE_DATA} />
    case 'OTHER':
      return <Bar options={COMMON_BAR_OPTIONS} data={OTHER_DATA} />
  }
}
