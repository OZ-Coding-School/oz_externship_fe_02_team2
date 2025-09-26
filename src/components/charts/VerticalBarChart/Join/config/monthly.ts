import type { ChartData } from 'chart.js'

// TODO: API 받아와서 맞추기
const MONTHLY_JOIN_LABELS = [
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

export const MONTHLY_JOIN_DATA: ChartData<'bar'> = {
  // TODO: API 받아와서 맞추기
  labels: MONTHLY_JOIN_LABELS,
  datasets: [
    {
      label: '회원가입 인원 수',
      // TODO: API 받아와서 맞추기
      data: [12, 20, 18, 30, 24, 19, 22, 27, 33, 20, 16, 29],
      backgroundColor: '#facc15',
      borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
      borderSkipped: false,
      categoryPercentage: 0.9,
    },
  ],
}
