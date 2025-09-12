import { Accordion } from '@components/ui/Accordion'
import type { NavProps } from '../Sidebar.types'
import { NAV_SECTIONS, toAccordionItems } from '../nav'

export default function Nav({ expanded, active, setActive, rail }: NavProps) {
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
