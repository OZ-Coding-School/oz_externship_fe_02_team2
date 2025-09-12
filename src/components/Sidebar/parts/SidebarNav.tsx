import { Accordion } from '@components/ui/Accordion'
import { NAV_SECTIONS } from '../nav/nav.config'
import { toAccordionItems } from '../nav/nav.utils'
import type { NavProps } from '../Sidebar.types'

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
