import { Bar } from 'react-chartjs-2'
import { MONTHLY_JOIN_DATA, ANNUAL_JOIN_DATA } from './config'
import { COMMON_BAR_OPTIONS } from '../VerticalBarChart.options'

type JoinBarProps = {
  /** MONTHLY, ANNUAL */
  period: string
}

export default function JoinBar({ period }: JoinBarProps) {
  // TODO: 드롭다운 선택 바뀌면 쿼리 다르게 요청, 데이터 받아오기
  switch (period) {
    case 'MONTHLY':
      return <Bar options={COMMON_BAR_OPTIONS} data={MONTHLY_JOIN_DATA} />
    case 'ANNUAL':
      return <Bar options={COMMON_BAR_OPTIONS} data={ANNUAL_JOIN_DATA} />
  }
}
