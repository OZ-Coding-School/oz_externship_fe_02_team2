import { cn } from '@/lib'
import type { AccordionContentProps } from '../Accordion.types'

export default function AccordionContent({
  iconOnly,
  icon,
  label,
  labelClassName,
}: AccordionContentProps) {
  return (
    <div className="flex items-center gap-x-3">
      <img src={icon} alt={label} />
      {!iconOnly && <p className={cn('truncate', labelClassName)}>{label}</p>}
    </div>
  )
}
