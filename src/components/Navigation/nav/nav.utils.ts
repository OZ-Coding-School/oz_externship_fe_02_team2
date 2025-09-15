// Acoordion용 아이템으로 변환
import type { NavItemDef } from './nav.types'
import type { AccordionItem } from '@/components/ui/Accordion/Accordion.types'

export function toAccordionItems(
  defs: NavItemDef[],
  active: string | null,
  setActive: (k: string) => void
): AccordionItem[] {
  return defs.map((d) => ({
    defaultIcon: d.defaultIcon,
    activeIcon: d.activeIcon,
    label: d.label,
    active: active === d.key,
    onClick: () => setActive(d.key),
  }))
}
