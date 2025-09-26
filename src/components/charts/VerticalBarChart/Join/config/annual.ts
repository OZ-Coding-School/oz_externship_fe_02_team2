import type { ChartData } from 'chart.js'

// TODO: 아직 목 데이터 -- n년 받아서 오는 식으로 API 맞춰서 변경
const ANNUAL_JOIN_LABELS = ['2023년', '2024년', '2025년', '2026년']

export const ANNUAL_JOIN_DATA: ChartData<'bar'> = {
  // TODO: API 받아와서 맞추기
  labels: ANNUAL_JOIN_LABELS,
  datasets: [
    {
      label: '회원가입 인원 수',
      // TODO: 여기도 데이터 받아와서 맞춰주기
      data: [233, 175, 270, 0],
      backgroundColor: '#facc15',
      borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
      borderSkipped: false,
      categoryPercentage: 0.9,
    },
  ],
}
