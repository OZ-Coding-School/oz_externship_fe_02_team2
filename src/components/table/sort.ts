export type Getter<T> = (row: T) => unknown

type Comparable = string | number | Date | null | undefined

export function makeComparer<T>(getter: Getter<T>, desc = false) {
  return (a: { row: T; i: number }, b: { row: T; i: number }) => {
    const va = getter(a.row) as Comparable
    const vb = getter(b.row) as Comparable

    // null/undefined 안전 처리
    const na: Comparable = va ?? ''
    const nb: Comparable = vb ?? ''

    let cmp = 0
    if (na instanceof Date && nb instanceof Date) {
      cmp = na.getTime() - nb.getTime()
    } else if (typeof na === 'number' && typeof nb === 'number') {
      cmp = na - nb
    } else {
      cmp = String(na).localeCompare(String(nb), undefined, { numeric: true })
    }

    if (cmp === 0) return a.i - b.i // 안정성 보장
    return desc ? -cmp : cmp
  }
}
