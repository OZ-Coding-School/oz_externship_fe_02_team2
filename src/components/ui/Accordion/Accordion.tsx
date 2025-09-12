import { useState } from 'react'
import { cn } from '@/lib'
import type { AccordionProps } from './Accordion.types'
import AccordionContent from './parts/AccordionContent'
import AccordionHeader from './parts/AccordionHeader'

export default function Accordion({
  icon,
  label,
  rail = false,
  items,
  children,
}: AccordionProps) {
  const [open, setOpen] = useState(false) // 상위 메뉴 접기 펼치기

  const iconOnly = rail // rail일 때만, 아이콘만 보임. 이외 아이콘+레이블

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
    </div>
  )
}
