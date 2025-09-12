import { cn } from '@/lib'
import type { ContentProps } from '../Accordion.types'

export default function Content({
  iconOnly,
  icon,
  label,
  labelClassName,
}: ContentProps) {
  return (
    <div className="flex items-center gap-x-3">
      <img src={icon} alt={label} />
      {!iconOnly && <p className={cn('truncate', labelClassName)}>{label}</p>}
    </div>
  )
}
