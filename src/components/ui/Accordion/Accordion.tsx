import Up from '@assets/icons/accord-up.svg'
import Down from '@assets/icons/accord-down.svg'
import { useState, type ReactNode } from 'react'
import { cn } from '@/lib'

type AccordionProps = {
  icon: string
  label: string
  rail?: boolean // 사이드바 확장 여부 (≥md) true -> 접힘, false -> 확장
  children?: ReactNode
}

type AccordionContentsProps = { iconOnly: boolean; icon: string; label: string }

// TODO: hover & active 디자인 추가

function AccordionContents({ iconOnly, icon, label }: AccordionContentsProps) {
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
  children,
}: AccordionProps) {
  const [open, setOpen] = useState(false)

  const iconOnly = rail // rail일 때만, 아이콘만 보임. 이외 아이콘+레이블

  return (
    <div className="w-full cursor-pointer">
      {/* 상위 메뉴(펼치기/접기 기능) */}
      <div
        className={cn(
          'flex items-center',
          'md:justify-between md:rounded-lg md:px-3 md:py-2',
          'body-sm font-medium'
        )}
        onClick={(open) => setOpen(!open)}
      >
        <AccordionContents iconOnly={iconOnly} icon={icon} label={label} />

        {/* rail이 아닐 때만 펼치기/접기 아이콘 보임 */}
        {!iconOnly && (
          <img
            src={open ? Up : Down}
            alt={open ? '메뉴 접기' : '메뉴 펼치기'}
          />
        )}
      </div>
      {/* 하위 메뉴 */}
      <div className="body-sm mt-2 text-gray-600">
        <ul className="md:ml-6">{children}</ul>
        {/* TODO: ul 안에 li 안에 AccordionContents 넣고 map 돌리기 */}
        {/* li md 스타일: md:rounded-lg md:items-center md:px-3 md:py-2 */}
      </div>
    </div>
  )
}
