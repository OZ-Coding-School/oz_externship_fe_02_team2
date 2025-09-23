import { PATHS } from '@/routes/constants'
import type { NavItemDef } from './nav.types'
import type { AccordionItem } from '@/components/Navigation/Accordion/Accordion.types'

/** Accordion용 아이템으로 변환 */
export function toAccordionItems(
  defs: NavItemDef[],
  active: string | null,
  setActive: (k: string) => void,
  navigate: (p: string) => void
): AccordionItem[] {
  return defs.map((d) => ({
    defaultIcon: d.defaultIcon,
    activeIcon: d.activeIcon,
    label: d.label,
    active: active === d.key,
    onClick: () => {
      setActive(d.key)
      navigate(`/${PATHS.APP}/${d.key}`) // TODO: 테스트 경로임. 추후 배포 버전 맞추어 경로 수정.
    },
  }))
}
