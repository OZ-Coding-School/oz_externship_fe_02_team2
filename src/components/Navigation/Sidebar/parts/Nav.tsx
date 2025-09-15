import { Accordion } from '@/components/Navigation/Accordion'
import type { SidebarNavProps } from '../Sidebar.types'
import { NAV_SECTIONS, toAccordionItems } from '../../nav'

export default function Nav({
  expanded,
  active,
  setActive,
  rail,
}: SidebarNavProps) {
  return (
    <>
      {NAV_SECTIONS.map((section) => (
        <Accordion
          key={section.id}
          icon={section.icon}
          label={section.label}
          rail={rail ?? !expanded}
          items={toAccordionItems(section.items, active, setActive)}
        />
      ))}
    </>
  )
}
