import { Bar } from 'react-chartjs-2'
import { MONTHLY_JOIN_DATA } from './config/monthly'
import { ANNUAL_JOIN_DATA } from './config/annual'
import { COMMON_BAR_OPTIONS } from '../options'

type JoinBarProps = {
  /** MONTHLY, ANNUAL */
  period: string
}

export default function JoinBar({ period }: JoinBarProps) {
  // TODO: period에 따라 옵션이랑(이거 색 다르니까) 데이터 다른 거 넘기게 하기
  switch (period) {
    case 'MONTHLY':
      return <Bar options={COMMON_BAR_OPTIONS} data={MONTHLY_JOIN_DATA} />
    case 'ANNUAL':
      return <Bar options={COMMON_BAR_OPTIONS} data={ANNUAL_JOIN_DATA} />
  }
}
