import Up from '@assets/icons/accord-up.svg'
import Down from '@assets/icons/accord-down.svg'

import { useState, type ReactNode } from 'react'
import { cn } from '@/lib'

type AccordionItem = {
  defaultIcon: string
  activeIcon: string
  label: string
  onClick?: () => void
  active?: boolean
}

type AccordionProps = {
  icon: string
  label: string
  rail?: boolean // 사이드바 확장 여부 (≥md) true -> 접힘, false -> 확장
  items?: AccordionItem[]
  children?: ReactNode
}

type AccordionContentProps = { iconOnly: boolean; icon: string; label: string }

// TODO: hover & active 디자인 추가

function AccordionContent({ iconOnly, icon, label }: AccordionContentProps) {
  return (
    <div className="flex items-center gap-x-3">
      <img src={icon} alt={label} />
      {!iconOnly && <p className="truncate">{label}</p>}
    </div>
  )
}

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
    <div className="w-full cursor-pointer">
      {/* 상위 메뉴(펼치기/접기 기능) */}
      <div
        className={cn(
          'hover:bg-primary-50 flex items-center',
          'md:justify-between md:rounded-lg md:px-3 md:py-2',
          'body-sm font-medium'
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <AccordionContent iconOnly={iconOnly} icon={icon} label={label} />

        {/* rail이 아닐 때만 펼치기/접기 아이콘 보임 */}
        {!iconOnly && (
          <img
            src={open ? Down : Up}
            alt={open ? '메뉴 접기' : '메뉴 펼치기'}
          />
        )}
      </div>

      {/* 하위 메뉴 */}
      {open && (
        <div className="body-sm mt-2 text-gray-600">
          <ul className="md:ml-6">
            {items?.map(
              ({ defaultIcon, activeIcon, label, onClick, active }) => {
                const LI_COMMON_STYLE = cn(
                  'flex items-center hover:bg-primary-50 mb-1',
                  'md:w-full md:rounded-lg md:px-3 md:py-2 md:gap-x-3',
                  active &&
                    'bg-primary-100 text-primary-800 hover:bg-primary-100'
                )

                return (
                  <li key={label} onClick={onClick} className={LI_COMMON_STYLE}>
                    <img src={active ? activeIcon : defaultIcon} alt={label} />
                    <span>{label}</span>
                  </li>
                )
              }
            )}
            {children}
          </ul>
        </div>
      )}
    </div>
  )
}
