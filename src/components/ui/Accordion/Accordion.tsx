import { useState } from 'react'
import { cn } from '@/lib'
import type { AccordionProps } from './Accordion.types'
import { AccordionHeader, AccordionList } from './parts'

export default function Accordion({
  icon,
  label,
  rail = false,
  items,
  children,
}: AccordionProps) {
  const [open, setOpen] = useState(true) // 상위 메뉴 접기 펼치기

  /** rail일 때만, 아이콘만 보임. 이외 아이콘+레이블 */
  const iconOnly = rail

  return (
    <div
      className={cn(
        'mb-2 w-full cursor-pointer pb-2 select-none',
        rail && 'flex flex-col items-center rounded-full bg-gray-50 pb-0'
      )}
    >
      {/* 상위 메뉴 */}
      <AccordionHeader
        icon={icon}
        label={label}
        rail={rail}
        open={open}
        iconOnly={iconOnly}
        onClick={() => setOpen((prev) => !prev)}
      />

      {/* 하위 메뉴 */}
      <AccordionList open={open} rail={rail} iconOnly={iconOnly} items={items}>
        {children}
      </AccordionList>
    </div>
  )
}
