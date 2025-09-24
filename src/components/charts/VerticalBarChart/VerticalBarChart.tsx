import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'
import { rightEdgeGridPlugin } from './plugin'
import JoinBar from './Join/JoinBar'
import LeaveBar from './Leave/LeaveBar'
import ReasonBar from './Reason/ReasonBar'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  rightEdgeGridPlugin
)

type VerticalBarChartProps =
  | { type: 'join'; period: string }
  | { type: 'leave'; period: string }
  | { type: 'reason'; reason: string }

export default function VerticalBarChart(props: VerticalBarChartProps) {
  switch (props.type) {
    case 'join':
      return <JoinBar period={props.period} />
    case 'leave':
      return <LeaveBar period={props.period} />
    case 'reason':
      return <ReasonBar reason={props.reason} />
  }
}
