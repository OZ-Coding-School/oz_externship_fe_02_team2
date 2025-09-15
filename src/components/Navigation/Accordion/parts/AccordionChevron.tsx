import { cn } from '@/lib'
import Up from '@assets/icons/accord-up.svg'
import type { AccordionChevronProps } from '../Accordion.types'

export default function AccordionChevron({ open }: AccordionChevronProps) {
  return (
    <img
      src={Up}
      alt={open ? '메뉴 접기' : '메뉴 펼치기'}
      className={cn(
        'transition-transform duration-200',
        open ? 'rotate-90' : 'rotate-0'
      )}
    />
  )
}
