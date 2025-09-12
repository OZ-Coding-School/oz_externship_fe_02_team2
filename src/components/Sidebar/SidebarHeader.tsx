import { Button } from '@components/ui/Button'
import type { SidebarHeaderProps } from './Sidebar.types'
import Burger from '@assets/icons/hamburger.svg'
import { cn } from '@/lib'

export default function SidebarHeader({
  title,
  onClick,
  buttonLabel,
  compact = false,
}: SidebarHeaderProps) {
  return (
    <header
      className={cn(
        'flex items-center truncate py-6 select-none',
        compact ? 'justify-center px-0' : 'justify-between px-6'
      )}
    >
      {!compact && <h4 className="font-bold">{title}</h4>}
      <Button
        btnSize="small"
        btnIcon={<img src={Burger} alt={buttonLabel} />}
        className="bg-transparent p-0 hover:bg-transparent"
        onClick={onClick}
        iconOnly
        aria-label={buttonLabel}
      />
    </header>
  )
}
