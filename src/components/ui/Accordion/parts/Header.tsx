import { cn } from '@/lib'
import AccordionContent from './Content'
import AccordionChevron from './Chevron'
import type { HeaderProps } from '../Accordion.types'

export default function Header({
  icon,
  label,
  rail,
  open,
  iconOnly,
  onClick,
}: HeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        'transition-colors duration-200',
        rail
          ? 'rounded-full bg-white px-4 py-4 hover:bg-white/60'
          : 'hover:bg-primary-50 rounded-lg bg-transparent px-3 py-2'
      )}
      onClick={onClick}
    >
      <AccordionContent
        iconOnly={iconOnly}
        icon={icon}
        label={label}
        labelClassName="body-sm font-medium"
      />

      {/* rail이 아닐 때만 펼치기/접기 아이콘 보임 */}
      {!iconOnly && <AccordionChevron open={open} />}
    </div>
  )
}
