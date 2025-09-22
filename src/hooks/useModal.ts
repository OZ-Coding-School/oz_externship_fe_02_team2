import { useEffect, useLayoutEffect, useRef } from 'react'

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [active])
}

export function useEscClose(enabled: boolean, onClose: () => void) {
  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [enabled, onClose])
}

export function useFocusTrap(
  active: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
  initialFocus?: () => HTMLElement | null,
  opts?: {
    /** true면 '처음 Tab 누르기 전까지'는 포커스를 주지 않음(기본 true) */
    deferInitialFocus?: boolean
  }
) {
  const activatedRef = useRef<boolean | null>(null)
  useLayoutEffect(() => {
    if (!active) return
    const el = containerRef.current
    if (!el) return

    const defer = opts?.deferInitialFocus !== false // default: true
    const selectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ]
    const list = () =>
      Array.from(el.querySelectorAll<HTMLElement>(selectors.join(',')))

    // 활성화(= 실제 포커스를 내부 요소에 주기 시작) 여부

    if (activatedRef.current === null) activatedRef.current = !defer

    const focusFirst = () => {
      const explicit = initialFocus?.()
      const nodes = list()
      ;(explicit ?? nodes[0] ?? el).focus({
        preventScroll: true,
      } satisfies FocusOptions)
    }
    const focusLast = () => {
      const nodes = list()
      ;(nodes[nodes.length - 1] ?? el).focus({
        preventScroll: true,
      } satisfies FocusOptions)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const nodes = list()
      if (!nodes.length) {
        // 포커스 가능한 요소가 없으면 컨테이너에 머무름
        e.preventDefault()
        el.focus({ preventScroll: true } satisfies FocusOptions)
        return
      }

      // 아직 활성화 전(= 첫 Tab 시점)
      if (!activatedRef.current) {
        e.preventDefault()
        activatedRef.current = true
        if (e.shiftKey) focusLast()
        else focusFirst()
        return
      }

      // 활성화 후: 표준 트랩
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const activeEl = document.activeElement as HTMLElement | null
      const isInside = !!activeEl && el.contains(activeEl)

      if (e.shiftKey) {
        if (activeEl === first || !isInside) {
          e.preventDefault()
          last.focus({ preventScroll: true } satisfies FocusOptions)
        }
      } else {
        if (activeEl === last) {
          e.preventDefault()
          first.focus({ preventScroll: true } satisfies FocusOptions)
        }
      }
    }

    // 포커스가 모달 밖으로 샐 때 즉시 되돌리기
    const onFocusIn = (e: FocusEvent) => {
      if (!el.contains(e.target as Node)) {
        // 아직 활성화 전이면 그대로 "보이는 포커스 없음" 유지
        if (!activatedRef.current) {
          // 외부 포커스 제거
          ;(document.activeElement as HTMLElement | null)?.blur?.()
          return
        }
        // 활성화 후에는 내부로 되돌림
        focusFirst()
      }
    }

    // 키보드/포커스 전역 감시 (캡처 단계 권장)
    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('focusin', onFocusIn, true)

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('focusin', onFocusIn, true)
    }
  }, [active, containerRef, initialFocus, opts?.deferInitialFocus])
}
