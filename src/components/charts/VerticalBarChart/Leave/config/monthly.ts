import type { ChartData } from 'chart.js'

// TODO: API 받아와서 맞추기
const MONTHLY_LEAVE_LABELS = [
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

export const MONTHLY_LEAVE_DATA: ChartData<'bar'> = {
  // TODO: API 받아와서 맞추기
  labels: MONTHLY_LEAVE_LABELS,
  datasets: [
    {
      label: '회원탈퇴 인원 수',
      // TODO: API 받아와서 맞추기
      data: [2, 1, 3, 4, 2, 1, 3, 2, 4, 3, 1, 2],
      backgroundColor: '#EF4444',
      borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
      borderSkipped: false,
      categoryPercentage: 0.9,
    },
  ],
}
