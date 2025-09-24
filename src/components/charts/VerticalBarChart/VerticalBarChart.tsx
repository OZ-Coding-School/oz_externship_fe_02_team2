import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
  type ChartData,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { rightEdgeGridPlugin } from './plugin'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  rightEdgeGridPlugin
)

const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
    rightEdgeGrid: { color: '#ccc', lineWidth: 2, dash: [3, 3] },
    datalabels: { display: false },
  },
  scales: {
    x: {
      border: {
        display: true,
        color: '#666',
        dash: [3, 3],
      },
      grid: {
        display: true,
        color: '#ccc',
        tickColor: '#666',
        tickLength: 6,
        offset: false, // 그리드가 카테고리(막대) 중앙을 지나가게
      },
      ticks: {
        color: '#6B7280',
        padding: 2,
        font: { size: 12, weight: 'normal' },
      },
    },
    y: {
      beginAtZero: true,
      border: {
        display: true,
        color: '#666',
        dash: [3, 3],
      },
      grid: {
        display: true,
        color: '#ccc',
        tickColor: '#666',
        tickLength: 6,
      },
      ticks: {
        stepSize: 9,
        color: '#6B7280',
        padding: 2,
        font: { size: 12, weight: 'normal' },
      },
    },
  },
}

const labels = [
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

export const data: ChartData<'bar'> = {
  labels,
  datasets: [
    {
      label: '회원가입 인원 수',
      data: [12, 20, 18, 30, 24, 19, 22, 27, 33, 20, 16, 29],
      backgroundColor: '#facc15',
      borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
      borderSkipped: false,
      categoryPercentage: 0.9,
    },
  ],
}

export default function VerticalBarChart() {
  return <Bar options={options} data={data} />
}
