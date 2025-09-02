import { cn } from '@/lib/utils'

export function pageButton({
  active = false,
  compact = false,
}: { active?: boolean; compact?: boolean } = {}) {
  return cn(
    'inline-flex select-none items-center justify-center rounded-md border px-3 py-1.5 body-sm disabled:opacity-40 disabled:cursor-not-allowed',
    active
      ? 'border-primary-blue bg-primary-blue text-white'
      : 'border-gray-300 text-secondary-text hover:bg-gray-200',
    compact && 'px-2 py-1 min-w-8 text-sm'
  )
}
