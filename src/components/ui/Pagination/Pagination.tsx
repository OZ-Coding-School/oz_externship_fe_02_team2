import { useCallback, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PaginationProps } from './types'
import { clamp, normalizeWindow, range, threeWindow, toInt } from './utils'
import { pageButton } from './styles'
import EllipsisPopover from './EllipsisPopover'

export default function Pagination({
  totalPages,
  currentPage,
  onChange,
  className,
}: PaginationProps) {
  const safeTotal = Math.max(1, toInt(totalPages, 1))
  if (safeTotal <= 1) return null

  const safePage = clamp({ n: toInt(currentPage, 1), min: 1, max: safeTotal })

  const threeWin = normalizeWindow(
    safePage,
    safeTotal,
    threeWindow(safePage, safeTotal)
  )

  const first = 1
  const last = safeTotal

  const showFirst = !threeWin.includes(first)
  const showLast = !threeWin.includes(last)

  const leftGapStart = showFirst ? 2 : -1
  const leftGapEnd = showFirst ? threeWin[0] - 1 : -1
  const rightGapStart = showLast ? threeWin[threeWin.length - 1] + 1 : -1
  const rightGapEnd = showLast ? last - 1 : -1

  const go = useCallback(
    (p: number) => onChange(clamp({ n: p, min: 1, max: safeTotal })),
    [onChange, safeTotal]
  )

  const leftPages = useMemo(
    () =>
      showFirst && leftGapStart <= leftGapEnd
        ? range(leftGapStart, leftGapEnd)
        : [],
    [showFirst, leftGapStart, leftGapEnd]
  )

  const rightPages = useMemo(
    () =>
      showLast && rightGapStart <= rightGapEnd
        ? range(rightGapStart, rightGapEnd)
        : [],
    [showLast, rightGapStart, rightGapEnd]
  )

  return (
    <nav
      className={cn('flex items-center gap-2', className)}
      aria-label="Pagination"
    >
      <button
        type="button"
        className={pageButton()}
        disabled={safePage === 1}
        onClick={() => go(safePage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>
      {showFirst && (
        <button
          type="button"
          onClick={() => go(first)}
          className={pageButton({ active: safePage === first })}
        >
          {first}
        </button>
      )}
      {showFirst && leftPages.length > 0 && (
        <EllipsisPopover pages={leftPages} onSelect={go} />
      )}
      {threeWin.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => go(n)}
          className={pageButton({ active: n === safePage })}
          aria-current={n === safePage ? 'page' : undefined}
        >
          {n}
        </button>
      ))}
      {showLast && rightPages.length > 0 && (
        <EllipsisPopover pages={rightPages} onSelect={go} />
      )}
      {showLast && (
        <button
          type="button"
          onClick={() => go(last)}
          className={pageButton({ active: safePage === last })}
        >
          {last}
        </button>
      )}
      <button
        type="button"
        className={pageButton()}
        disabled={safePage === safeTotal}
        onClick={() => go(safePage + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  )
}
