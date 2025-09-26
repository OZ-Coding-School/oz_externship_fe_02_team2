import JoinBar from './Join/JoinBar'
import LeaveBar from './Leave/LeaveBar'
import ReasonBar from './Reason/ReasonBar'

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
