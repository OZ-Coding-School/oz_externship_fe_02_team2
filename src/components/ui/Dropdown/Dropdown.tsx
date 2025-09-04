import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { DropdownProps } from './Dropdown.types'
import { cn } from '@/lib/utils'
import {
  BUTTON_BASE,
  BUTTON_DISABLED,
  BUTTON_PLACEHOLDER,
  CARET,
  MENU_BASE,
  menuAlignClass,
  OPTION_BASE,
  OPTION_ACTIVE,
  OPTION_DISABLED,
  OPTION_SELECTED,
  WRAPPER_BASE,
} from './Dropdown.styles'

export default function Dropdown({
  options,
  value,
  defaultValue = null,
  onChange,
  placeholder = '선택',
  disabled = false,
  classes,
  align = 'start',
}: DropdownProps) {
  const isControlled = value !== undefined
  const [internalValue, seInternalValue] = useState<string | null>(defaultValue)
  const selectedValue = (isControlled ? value : internalValue) ?? null

  const selectedIndex = useMemo(
    () => options.findIndex((o) => o.value === selectedValue),
    [options, selectedValue]
  )
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null

  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const listRef = useRef<HTMLUListElement | null>(null)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const btnId = useId()
  const listId = useId()

  const firstEnabledIndex = () => options.findIndex((o) => !o.disabled)
  const lastEnabledIndex = () => {
    for (let i = options.length - 1; i >= 0; i--)
      if (!options[i].disabled) return i
    return -1
  }

  const nextEnabledIndex = (from: number, dir: 1 | -1) => {
    if (options.length === 0) return -1
    let i = from
    for (let step = 0; step < options.length; step++) {
      i = (i + dir + options.length) % options.length
      if (!options[i].disabled) return i
    }
    return from
  }

  const openMenu = useCallback(() => {
    if (disabled) return
    setOpen(true)
    const base =
      selectedIndex >= 0 && !options[selectedIndex]?.disabled
        ? selectedIndex
        : firstEnabledIndex()
    setActiveIndex(base >= 0 ? base : -1)
  }, [disabled, options, selectedIndex])

  const close = useCallback((focusBack = false) => {
    setOpen(false)
    if (focusBack)
      (
        wrapRef.current?.querySelector('button') as HTMLButtonElement | null
      )?.focus()
  }, [])

  const onListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (!open) return
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((i) =>
          nextEnabledIndex(i < 0 ? firstEnabledIndex() : i, 1)
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((i) =>
          nextEnabledIndex(i < 0 ? lastEnabledIndex() : i, -1)
        )
        break
      case 'Home':
        e.preventDefault()
        setActiveIndex(firstEnabledIndex())
        break
      case 'End':
        e.preventDefault()
        setActiveIndex(lastEnabledIndex())
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (activeIndex >= 0) select(options[activeIndex])
        break
      case 'Tab':
        close(false)
        break
      case 'Escape':
        e.preventDefault()
        close(true)
        break
    }
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(true)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  // 열릴 때 리스트로 포커스 이동
  useEffect(() => {
    if (open) setTimeout(() => listRef.current?.focus(), 0)
  }, [open])

  // 하이라이트가 바뀌면 최소 스크롤
  useEffect(() => {
    if (!open || activeIndex < 0) return
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  const select = (opt: {
    value: string
    label: string
    disabled?: boolean
  }) => {
    if (opt.disabled) return
    if (!isControlled) seInternalValue(opt.value)
    onChange?.(opt.value, opt)
    close(true)
  }

  const onButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openMenu()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      openMenu()
    }
  }
  return (
    <div ref={wrapRef} className={cn(WRAPPER_BASE, classes?.wrapper)}>
      <button
        id={btnId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className={cn(
          BUTTON_BASE,
          disabled && BUTTON_DISABLED,
          classes?.button
        )}
        onClick={() => (open ? close(true) : openMenu())}
        onKeyDown={onButtonKeyDown}
      >
        <span className={cn(!selectedOption && BUTTON_PLACEHOLDER)}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={cn(CARET, open && 'rotate-180')}
        >
          <path
            d="M7 10l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={btnId}
          tabIndex={-1}
          ref={listRef}
          onKeyDown={onListKeyDown}
          aria-activedescendant={
            activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined
          }
          className={cn(MENU_BASE, menuAlignClass(align), classes?.menu)}
        >
          {options.map((o, i) => {
            const selected = o.value === selectedValue
            const active = i === activeIndex
            return (
              <li
                id={`${listId}-opt-${i}`}
                key={o.value}
                role="option"
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => !o.disabled && setActiveIndex(i)}
                onClick={() => select(o)}
                className={cn(
                  OPTION_BASE,
                  selected && OPTION_SELECTED,
                  active && OPTION_ACTIVE,
                  o.disabled && OPTION_DISABLED,
                  classes?.option
                )}
              >
                {o.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// 모듈화 예정
