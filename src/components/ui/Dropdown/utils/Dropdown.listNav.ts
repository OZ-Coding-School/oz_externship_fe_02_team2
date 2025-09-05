export function firstEnabledIndex<T extends { disabled?: boolean }>(
  arr: readonly T[]
) {
  return arr.findIndex((o) => !o.disabled)
}

export function lastEnabledIndex<T extends { disabled?: boolean }>(
  arr: readonly T[]
) {
  for (let i = arr.length - 1; i >= 0; i--) if (!arr[i].disabled) return i
  return -1
}

export function nextEnabledIndex<T extends { disabled?: boolean }>(
  arr: readonly T[],
  from: number,
  dir: 1 | -1
) {
  if (arr.length === 0) return -1
  let i = from
  for (let step = 0; step < arr.length; step++) {
    i = (i + dir + arr.length) % arr.length
    if (!arr[i].disabled) return i
  }
  return from
}
