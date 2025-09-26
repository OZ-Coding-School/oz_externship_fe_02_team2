import type { ChartData } from 'chart.js'

// TODO: API 받아와서 맞추기
const COMPETITOR_SERVICE_LABELS = [
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

export const COMPETITOR_SERVICE_DATA: ChartData<'bar'> = {
  // TODO: API 받아와서 맞추기
  labels: COMPETITOR_SERVICE_LABELS,
  datasets: [
    {
      label: '경쟁 서비스 이용',
      // TODO: API 받아와서 맞추기
      data: [0, 0, 1, 0, 2, 3, 0, 0, 0, 1, 0, 0],
      backgroundColor: '#facc15',
      borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
      borderSkipped: false,
      categoryPercentage: 0.9,
    },
  ],
}
