import type { ChartData } from 'chart.js'

// TODO: 연도로 변경
const ANNUAL_LEAVE_LABELS = [
  '01월',
  '02월',
  '03월',
  '04월',
  '05월',
  '06월',
  '07월',
  '08월',
  '09월',
  '10월',
  '11월',
  '12월',
]

export const ANNUAL_LEAVE_DATA: ChartData<'bar'> = {
  labels: ANNUAL_LEAVE_LABELS,
  datasets: [
    {
      label: '회원탈퇴 인원 수',
      data: [12, 20, 18, 30, 24, 19, 22, 27, 33, 20, 16, 29],
      backgroundColor: '#EF4444',
      borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
      borderSkipped: false,
      categoryPercentage: 0.9,
    },
  ],
}
