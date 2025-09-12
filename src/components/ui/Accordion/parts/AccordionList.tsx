import { cn } from '@/lib'
import AccordionContent from './AccordionContent'
import type { AccordionListProps } from '../Accordion.types'

export default function AccordionList({
  open,
  rail,
  iconOnly,
  items,
  children,
}: AccordionListProps) {
  return (
    <div
      className={cn(
        'grid overflow-hidden',
        'transition-[grid-template-rows,opacity] duration-200 ease-out', // 높이+투명도 전환
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      )}
    >
      <ul
        className={cn(
          rail ? 'mb-1.5' : 'ml-6',
          rail && !open && 'mb-0',
          'min-h-0'
        )}
      >
        {items?.map(({ defaultIcon, activeIcon, label, onClick, active }) => {
          const LI_COMMON_STYLE = cn(
            'flex items-center w-full px-3 mt-1',
            'transition-colors duration-200',
            rail ? 'rounded-full py-3' : 'rounded-lg py-2',
            active
              ? 'bg-primary-100  hover:bg-primary-100'
              : 'hover:bg-primary-50'
          )

          return (
            <li key={label} onClick={onClick} className={LI_COMMON_STYLE}>
              <AccordionContent
                icon={active ? activeIcon : defaultIcon}
                label={label}
                iconOnly={iconOnly}
                labelClassName={`body-sm ${active ? 'text-primary-800' : 'text-gray-600'}`}
              />
            </li>
          )
        })}

        {children}
      </ul>
    </div>
  )
}
