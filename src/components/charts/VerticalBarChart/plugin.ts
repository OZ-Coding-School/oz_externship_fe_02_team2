import type { Plugin, ChartType } from 'chart.js'

type RightEdgeGridOpts = {
  color?: string
  lineWidth?: number
  dash?: number[]
}

declare module 'chart.js' {
  /** 각 차트 타입별 plugin 옵션에 rightEdgeGrid 추가 */
  interface PluginOptionsByType<TType extends ChartType = ChartType> {
    rightEdgeGrid?: TType extends 'bar' ? RightEdgeGridOpts : never
  }
}

/** VerticalBarChart 최우측에 차트 닫는 세로 점선 라인 추가하는 플러그인 */
export const rightEdgeGridPlugin: Plugin<'bar', RightEdgeGridOpts> = {
  id: 'rightEdgeGrid',
  beforeDraw(chart, _args, opts) {
    const { ctx, chartArea } = chart // FYI: ctx === context
    const color = opts?.color ?? '#ccc'
    const lineWidth = opts?.lineWidth ?? 1
    const dash = opts?.dash ?? [3, 3] // 점선 패턴

    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    if (dash) ctx.setLineDash(dash)

    // 오른쪽 경계선만 추가
    ctx.beginPath()
    ctx.moveTo(chartArea.right, chartArea.top)
    ctx.lineTo(chartArea.right, chartArea.bottom)
    ctx.stroke()

    ctx.restore()
  },
}
