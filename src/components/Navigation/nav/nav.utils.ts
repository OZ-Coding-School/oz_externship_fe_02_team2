// Acoordion용 아이템으로 변환
import { PATHS } from '@/routes/constants'
import type { NavItemDef } from './nav.types'
import type { AccordionItem } from '@/components/Navigation/Accordion/Accordion.types'

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
    onClick: () => {
      setActive(d.key)
      // TODO: 여기서 네비게이트!!!!
      const segment = PATHS[d.key]
    },
  }))
}
