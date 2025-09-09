import { Button } from '@components/ui/Button'
import type { SidebarHeaderProps } from './Sidebar.types'
import Burger from '@assets/icons/hamburger.svg'

export default function SidebarHeader({
  title,
  onClick,
  buttonLabel,
  compact = false,
}: SidebarHeaderProps) {
  return (
    <header
      className={`flex items-center ${compact ? 'justify-center px-0' : 'justify-between px-6'} py-6`}
    >
      {!compact && <h4 className="font-bold">{title}</h4>}
      <Button
        btnSize="small"
        btnIcon={<img src={Burger} alt={buttonLabel} />}
        className="hover:animate-spin-once bg-transparent p-0 hover:bg-transparent"
        onClick={onClick}
        iconOnly
        aria-label={buttonLabel}
      />
    </header>
  )
}
