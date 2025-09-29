import type { Plugin, ArcElement, ChartType } from 'chart.js'

type LabelLineOptions = {
  lineWidth?: number
  length?: number
  colors?: readonly string[]
  /** 도넛 바깥 테두리로부터의 시작 간격(px) */
  gap?: number
}

declare module 'chart.js' {
  /** 각 차트 타입별 plugin 옵션에 labelLine 추가 */
  interface PluginOptionsByType<TType extends ChartType = ChartType> {
    labelLine?: TType extends 'doughnut' ? LabelLineOptions : never
  }
}

export const labelLinePlugin: Plugin<'doughnut', LabelLineOptions> = {
  id: 'labelLine',
  afterDatasetsDraw(chart, _args, opts) {
    const { ctx } = chart
    const meta = chart.getDatasetMeta(0)

    ;(meta.data as ArcElement[]).forEach((arc, i) => {
      const angle = (arc.startAngle + arc.endAngle) / 2
      const ox = arc.x,
        oy = arc.y,
        r = arc.outerRadius

      const lw = opts?.lineWidth ?? 2
      const gap = opts?.gap ?? 0
      const length = opts?.length ?? 14
      const color = opts?.colors?.[i] ?? '#9CA3AF'

      /** 실제 보이는 색 경계 반지름 */
      const bw =
        typeof arc.options.borderWidth === 'number'
          ? arc.options.borderWidth
          : 0
      const isInner = arc.options.borderAlign === 'inner'
      const visualOuter = isInner ? r - bw : r

      /** 선 시작점(도넛과 거의 붙게) */
      const r0 = visualOuter + gap

      const sx = ox + Math.cos(angle) * r0
      const sy = oy + Math.sin(angle) * r0
      const mx = ox + Math.cos(angle) * (r0 + length)
      const my = oy + Math.sin(angle) * (r0 + length)

      ctx.save()
      ctx.strokeStyle = color
      ctx.lineWidth = lw

      ctx.beginPath()
      ctx.moveTo(sx, sy)
      ctx.lineTo(mx, my)
      ctx.stroke()

      ctx.restore()
    })
  },
}
