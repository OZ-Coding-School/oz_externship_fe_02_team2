type Opt = { value: string; label: string }
export function withAllOption(options: Opt[], allLabel: string): Opt[] {
  if (!options || options.length === 0) return []
  return [{ value: '', label: allLabel }, ...options]
}
