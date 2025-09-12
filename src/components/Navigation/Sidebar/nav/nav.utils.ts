// Acoordion용 아이템으로 변환
import type { NavItemDef, NavKey } from './nav.types'
import type { AccordionItem } from '@/components/ui/Accordion/Accordion.types'

export function toAccordionItems(
  defs: readonly NavItemDef[],
  active: NavKey | null,
  setActive: (k: NavKey) => void
): AccordionItem[] {
  return defs.map((d) => ({
    defaultIcon: d.defaultIcon,
    activeIcon: d.activeIcon,
    label: d.label,
    active: active === d.key,
    onClick: () => setActive(d.key),
  }))
}
