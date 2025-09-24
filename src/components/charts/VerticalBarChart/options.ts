import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js'
import { rightEdgeGridPlugin } from './plugin'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  rightEdgeGridPlugin
)

export const COMMON_BAR_OPTIONS: ChartOptions<'bar'> = {
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
        /** 그리드가 카테고리(막대) 중앙을 지나가게 */
        offset: false,
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
