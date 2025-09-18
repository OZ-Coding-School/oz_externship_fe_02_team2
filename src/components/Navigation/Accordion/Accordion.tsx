import { useEffect, useState } from 'react'
import { cn } from '@/lib'
import type { AccordionProps } from './Accordion.types'
import { Header, List } from './parts'
import { readAccordionLS } from './Accordion.utils'

const ACCORDION_EVENT = 'studyhub-accordion-change'

export default function Accordion({
  icon,
  label,
  rail = false,
  items,
  children,
  storageKey,
}: AccordionProps) {
  const [open, setOpen] = useState<boolean>(() => readAccordionLS(storageKey))

  // storageKey가 바뀌면 로컬스토리지 값 다시 읽어서 업데이트
  useEffect(() => {
    setOpen(readAccordionLS(storageKey))
  }, [storageKey])

  useEffect(() => {
    if (!storageKey) return

    /** 같은 탭 내 두 아코디언 인스턴스(데스크톱/모바일) 상태 동기화 */
    const onAccordionCustomSync = (e: Event) => {
      const { key, value } =
        (e as CustomEvent<{ key: string; value: boolean }>).detail || {}
      if (key === storageKey) setOpen(value)
    }
    window.addEventListener(
      ACCORDION_EVENT,
      onAccordionCustomSync as EventListener
    )

    /** 다른 탭/창 아코디언 상태 동기화 (storage 이벤트) */
    const onAccordionStorage = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue != null) {
        try {
          const parsed = JSON.parse(e.newValue) as boolean
          setOpen(parsed)
        } catch {
          // noop: JSON 파싱 실패 시 무시
        }
      }
    }
    window.addEventListener('storage', onAccordionStorage)

    return () => {
      window.removeEventListener(
        ACCORDION_EVENT,
        onAccordionCustomSync as EventListener
      )
      window.removeEventListener('storage', onAccordionStorage)
    }
  }, [storageKey])

  /** 아코디언 토글 + 저장 + 브로드캐스트  */
  const toggleAccordion = () => {
    setOpen((prev) => {
      const next = !prev
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(next))
        } catch (e: unknown) {
          if (e instanceof DOMException) {
            // 1) 용량 초과 || 사파리 시크릿 모드 등
            if (
              e.name === 'QuotaExceededError' ||
              e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
            ) {
              // eslint-disable-next-line no-console
              console.warn(
                '[Accordion] localStorage full; state not persisted:',
                storageKey
              )
            } else if (e.name === 'SecurityError') {
              // 2) 보안 정책/프라이버시 설정으로 차단
              // eslint-disable-next-line no-console
              console.warn(
                '[Accordion] localStorage blocked by browser settings:',
                storageKey
              )
            } else {
              // eslint-disable-next-line no-console
              console.warn('[Accordion] localStorage failed:', storageKey, e)
            }
          } else {
            // 3) 그 외 알 수 없는 실패
            // eslint-disable-next-line no-console
            console.warn(
              '[Accordion] Unknown error saving localStorage:',
              storageKey,
              e
            )
          }
        } finally {
          window.dispatchEvent(
            new CustomEvent(ACCORDION_EVENT, {
              detail: { key: storageKey, value: next },
            })
          )
        }
      }
      return next
    })
  }

  /** rail일 때만, 아이콘만 보임. 이외 아이콘+레이블 */
  const iconOnly = rail

  return (
    <div
      className={cn(
        'mb-2 w-full cursor-pointer pb-2 select-none',
        rail && 'flex flex-col items-center rounded-full bg-gray-50 pb-0'
      )}
    >
      {/* 상위 메뉴 */}
      <Header
        icon={icon}
        label={label}
        rail={rail}
        open={open}
        iconOnly={iconOnly}
        onClick={toggleAccordion}
      />

      {/* 하위 메뉴 */}
      <List open={open} rail={rail} iconOnly={iconOnly} items={items}>
        {children}
      </List>
    </div>
  )
}

// 조합형 API
Accordion.Header = Header
Accordion.List = List
