import { Bar } from 'react-chartjs-2'
import { COMMON_BAR_OPTIONS } from '../options'
import { MONTHLY_LEAVE_DATA } from '../Leave/config/monthly'

type ReasonBarProps = {
  /** 탈퇴 사유: DISSATISFACTION, PRIVACY_CONCERNS, LOW_USAGE, COMPETITOR_SERVICE, OTHER */
  reason: string
}

// TODO: reason에 따라 옵션이랑 데이터 다른 거 넘기게 하기

export default function ReasonBar({ reason }: ReasonBarProps) {
  switch (reason) {
    case 'DISSATISFACTION':
    case 'PRIVACY_CONCERNS':
    case 'LOW_USAGE':
    case 'COMPETITOR_SERVICE':
    case 'OTHER':
      return <Bar options={COMMON_BAR_OPTIONS} data={MONTHLY_LEAVE_DATA} />
  }
}
