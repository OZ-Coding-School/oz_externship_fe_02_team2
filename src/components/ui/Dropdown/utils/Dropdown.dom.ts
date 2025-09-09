export function scrollChildIntoViewNearest(
  container: HTMLElement | null,
  index: number
) {
  if (!container || index < 0 || index >= container.children.length) return
  const el = container.children[index] as HTMLElement
  el?.scrollIntoView({ block: 'nearest' })
}
