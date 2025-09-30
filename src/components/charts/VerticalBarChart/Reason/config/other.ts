import type { ChartData } from 'chart.js'

// TODO: API 받아와서 맞추기
const OTHER_LABELS = [
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

export const OTHER_DATA: ChartData<'bar'> = {
  // TODO: API 받아와서 맞추기
  labels: OTHER_LABELS,
  datasets: [
    {
      label: '기타',
      // TODO: API 받아와서 맞추기
      data: [2, 3, 1, 1, 0, 1, 0, 0, 1, 1, 2, 1],
      backgroundColor: '#facc15',
      borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
      borderSkipped: false,
      categoryPercentage: 0.9,
    },
  ],
}
