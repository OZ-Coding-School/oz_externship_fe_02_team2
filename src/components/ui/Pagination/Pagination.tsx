import { useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { PaginationProps } from './Pagination.types'
import useResponsivePageSize, {
  clamp,
  normalizeWindow,
  toInt,
  visiblePageRange,
} from './Pagination.utils'
import { pageButton } from './Pagination.styles'

const ICON_SIZE = 'h-4 w-4'

export default function Pagination({
  totalPages,
  currentPage,
  onChange,
  className,
}: PaginationProps) {
  const safeTotal = Math.max(1, toInt(totalPages, 1))
  if (safeTotal <= 1) return null

  const safePage = clamp({ n: toInt(currentPage, 1), min: 1, max: safeTotal })

  const blockSize = useResponsivePageSize()
  const window = normalizeWindow(
    safePage,
    safeTotal,
    visiblePageRange(safePage, safeTotal, blockSize)
  )

  const go = useCallback(
    (p: number) => onChange(clamp({ n: p, min: 1, max: safeTotal })),
    [onChange, safeTotal]
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
        <ChevronLeft className={ICON_SIZE} aria-hidden="true" />
      </button>
      {window.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => go(n)}
          className={pageButton({
            active: n === safePage,
            compact: blockSize >= 10,
          })}
          aria-current={n === safePage ? 'page' : undefined}
        >
          {n}
        </button>
      ))}

      <button
        type="button"
        className={pageButton()}
        disabled={safePage === safeTotal}
        onClick={() => go(safePage + 1)}
        aria-label="Next page"
      >
        <ChevronRight className={ICON_SIZE} aria-hidden="true" />
      </button>
    </nav>
  )
}
