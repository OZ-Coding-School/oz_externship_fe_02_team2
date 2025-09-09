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

type AccordionContentProps = {
  iconOnly: boolean
  icon: string
  label: string
  labelClassName?: string
}

// TODO: hover & active 디자인 추가
// TODO: 부드러운 UX 위한 transition & animation 등 추가

function AccordionContent({
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
      {/* 상위 메뉴(펼치기/접기 기능) */}
      <div
        className={cn(
          'flex items-center justify-between',
          rail
            ? 'rounded-full bg-white px-4 py-4 hover:bg-white/60'
            : 'hover:bg-primary-50 rounded-lg bg-transparent px-3 py-2'
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <AccordionContent
          iconOnly={iconOnly}
          icon={icon}
          label={label}
          labelClassName="body-sm font-medium"
        />

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
        <div className="">
          <ul className={rail ? 'mb-1.5' : 'ml-6'}>
            {items?.map(
              ({ defaultIcon, activeIcon, label, onClick, active }) => {
                const LI_COMMON_STYLE = cn(
                  'flex items-center',
                  'w-full px-3 mt-1',
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
              }
            )}
            {children}
          </ul>
        </div>
      )}
    </div>
  )
}
