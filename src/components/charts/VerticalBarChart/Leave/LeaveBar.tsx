import { Bar } from 'react-chartjs-2'
import { MONTHLY_LEAVE_DATA, ANNUAL_LEAVE_DATA } from './config'
import { COMMON_BAR_OPTIONS } from '../VerticalBarChart.options'

type LeaveBarProps = {
  /** MONTHLY, ANNUAL */
  period: string
}

export default function LeaveBar({ period }: LeaveBarProps) {
  switch (period) {
    case 'MONTHLY':
      return <Bar options={COMMON_BAR_OPTIONS} data={MONTHLY_LEAVE_DATA} />
    case 'ANNUAL':
      return <Bar options={COMMON_BAR_OPTIONS} data={ANNUAL_LEAVE_DATA} />
  }
}
