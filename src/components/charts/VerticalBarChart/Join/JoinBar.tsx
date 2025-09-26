import { Bar } from 'react-chartjs-2'
import { MONTHLY_JOIN_DATA, ANNUAL_JOIN_DATA } from './config'
import { COMMON_BAR_OPTIONS } from '../VerticalBarChart.options'

type JoinBarProps = {
  /** MONTHLY, ANNUAL */
  period: string
}

export default function JoinBar({ period }: JoinBarProps) {
  switch (period) {
    case 'MONTHLY':
      return <Bar options={COMMON_BAR_OPTIONS} data={MONTHLY_JOIN_DATA} />
    case 'ANNUAL':
      return <Bar options={COMMON_BAR_OPTIONS} data={ANNUAL_JOIN_DATA} />
  }
}
