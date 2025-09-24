// DoughnutChart.tsx
import { useMemo } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  type ChartDataset,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Doughnut } from 'react-chartjs-2'
import { labelLinePlugin } from './plugin'
import { rightEdgeGridPlugin } from '../VerticalBarChart/plugin'

ChartJS.register(
  ArcElement,
  Tooltip,
  ChartDataLabels,
  labelLinePlugin,
  rightEdgeGridPlugin
)

// TODO: 레이블 - 색상 - 값 데이터를 하나의 객체로 연결
const LABELS = [
  '서비스 불만족',
  '개인정보 우려',
  '사용 빈도 낮음',
  '기타',
  '경쟁 서비스 이용',
] as const

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'] as const

const VALUES = [35, 25, 20, 15, 5] as const // 명

export default function DoughnutChart() {
  const total = useMemo(() => VALUES.reduce((a, b) => a + b, 0), [])

  const data: ChartData<'doughnut', number[], string> = {
    labels: [...LABELS],
    datasets: [
      {
        data: [...VALUES],
        backgroundColor: [...COLORS],
        borderWidth: 6,
        hoverOffset: 6,
      } satisfies ChartDataset<'doughnut', number[]>,
    ],
  }

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 32 },
    cutout: '45%',
    radius: '100%',
    plugins: {
      legend: { display: false },
      rightEdgeGrid: false,
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = Number(ctx.raw)
            const percent = Math.round((value / total) * 100)
            return `  총 ${value}명 (${percent}%)`
          },
        },
      },
      datalabels: {
        color: (ctx) => COLORS[ctx.dataIndex],
        font: { size: 12, weight: 'normal' },
        formatter: (value: number) => `${Math.round((value / total) * 100)}%`,
        anchor: 'end',
        align: 'end',
        offset: 8,
        clamp: true,
      },
      labelLine: {
        colors: COLORS,
        lineWidth: 1,
        length: 14,
        gap: -1.5,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: false,
    },
  }

  /** 커스텀 범례 배열 */
  const legends = LABELS.map((label, i) => ({
    label,
    color: COLORS[i],
    value: VALUES[i],
  }))

  return (
    <div className="flex h-full w-full items-center justify-center gap-8">
      <div className="h-full">
        <Doughnut data={data} options={options} />
      </div>

      <ul className="w-64 max-w-64 space-y-2">
        {legends.map((legend) => (
          <li key={legend.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-4 w-4 rounded-full"
                style={{ background: legend.color }}
              />
              <span className="body-sm">{legend.label}</span>
            </div>
            <div>
              <span className="body-sm text-primary-text font-medium">
                {legend.value}
              </span>
              <span className="body-sm text-primary-text">명</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
