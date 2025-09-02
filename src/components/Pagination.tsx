import { cn } from '@lib/cn'

type Props = {
  totalPages: number
  currentPage: number
  onChange: (page: number) => void
  className?: string
}

type ClampArgs = { n: number; min: number; max: number }
function clamp({ n, min, max }: ClampArgs) {
  return Math.max(min, Math.min(max, n))
}

function range(start: number, end: number) {
  const out: number[] = []
  for (let i = start; i <= end; i++) out.push(i)
  return out
}

function threeWindow(current: number, total: number) {
  if (total <= 3) return range(1, total)
  if (current <= 2) return [1, 2, 3]
  if (current >= total - 1) return [total - 2, total - 1, total]
  return [current - 1, current, current + 1]
}

function normalizeWindow(page: number, total: number, win: number[]) {
  const cleaned = Array.from(new Set(win))
    .map((n) => clamp({ n, min: 1, max: total }))
    .filter((n) => Number.isFinite(n))

  if (cleaned.length) return cleaned

  if (total <= 0) return []
  const start = clamp({ n: page - 1, min: 1, max: Math.max(1, total - 2) })
  const end = Math.min(total, start + 2)
  const out: number[] = []
  for (let i = start; i <= end; i++) out.push(i)
  return out
}

const toInt = (v: unknown, fb = 1) => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.floor(n) : fb
}

function pageButton({
  active = false,
  compact = false,
}: { active?: boolean; compact?: boolean } = {}) {
  return cn(
    'inline-flex select-none items-center justify-center rounded-md border px-3 py-1.5 body-sm disabled:opacity-40 disabled:cursor-not-allowed',
    active
      ? 'border-primary-blue bg-primary-blue text-white'
      : 'border-gray-300 text-secondary-text hover:bg-gray-200',
    compact && 'px-2 py-1 min-2-8 text-sm'
  )
}

export default function Pagination({
  totalPages,
  currentPage,
  onChange,
  className,
}: Props) {
  const safeTotal = Math.max(1, toInt(totalPages, 1))
  if (safeTotal <= 1) return null

  const safePage = clamp({ n: toInt(currentPage, 1), min: 1, max: safeTotal })

  const threeWinRaw = threeWindow(safePage, safeTotal)
  const threeWin = normalizeWindow(safePage, safeTotal, threeWinRaw)

  const first = 1
  const last = safeTotal

  const showFirst = !threeWin.includes(first)
  const showLast = !threeWin.includes(last)

  const leftGapStart = showFirst ? 2 : -1
  const leftGapEnd = showFirst ? threeWin[0] - 1 : -1
  const rightGapStart = showLast ? threeWin[threeWin.length - 1] + 1 : -1
  const rightGapEnd = showLast ? last - 1 : -1

  const go = (p: number) => onChange(clamp({ n: p, min: 1, max: safeTotal }))

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
        ‹
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
      {showFirst && leftGapStart <= leftGapEnd && (
        <EllipsisPopover
          pages={range(leftGapStart, leftGapEnd)}
          onSelect={go}
        />
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
      {showLast && rightGapStart <= rightGapEnd && (
        <EllipsisPopover
          pages={range(rightGapStart, rightGapEnd)}
          onSelect={go}
        />
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
        ›
      </button>
    </nav>
  )
  function EllipsisPopover({
    pages,
    onSelect,
  }: {
    pages: number[]
    onSelect: (p: number) => void
  }) {
    return (
      <div className="group relative inline-block">
        <button
          type="button"
          className={pageButton()}
          aria-haspopup="menu"
          aria-expanded="false"
          tabIndex={0}
        >
          …
        </button>
        {/* Popover */}
        <div
          className={cn(
            'absolute left-1/2 z-30 -translate-x-1/2',
            'mt-2 rounded-lg border border-gray-200 bg-white shadow-lg',
            'px-2 py-1',
            'invisible translate-y-1 opacity-0 transition-all duration-150',
            'group-hover:visible group-hover:translate-y-0 group-hover:opacity-100',
            'group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100',
            'max-h-60 w-fit max-w-[90vw] overflow-y-auto'
          )}
          role="menu"
          aria-orientation="horizontal"
        >
          <ul className="grid [grid-template-columns:repeat(5,auto)] gap-1">
            {pages.map((p) => (
              <li key={p} role="none">
                <button
                  type="button"
                  className={cn(
                    pageButton({ compact: true }),
                    'text-primary-text'
                  )}
                  onClick={() => onSelect(p)}
                  role="menuitem"
                >
                  {p}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
