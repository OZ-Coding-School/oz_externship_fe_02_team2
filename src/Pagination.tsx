type Props = {
  totalPages: number
  currentPage: number
  onChange: (page: number) => void
  className?: string
}

function clamp(n: number, min: number, max: number) {
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

const baseBtn =
  'inline-flex select-none items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 body-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed'

const activeBtn =
  'inline-flex select-none items-center justify-center rounded-md border border-primary-blue bg-primary-blue px-3 py-1.5 body-sm text-white'

export default function Pagination({
  totalPages,
  currentPage,
  onChange,
  className = '',
}: Props) {
  if (totalPages <= 1) return null

  const toInt = (v: unknown, fb = 1) => {
    const n = Number(v)
    return Number.isFinite(n) ? Math.floor(n) : fb
  }

  const safeTotal = Math.max(1, toInt(totalPages, 1))
  const safePage = clamp(toInt(currentPage, 1), 1, safeTotal)

  const page = clamp(currentPage, 1, totalPages)
  const threeWin = threeWindow(safePage, safeTotal)

  const first = 1
  const last = totalPages

  const showFirst = !threeWin.includes(first)
  const showLast = !threeWin.includes(last)

  const leftGapStart = showFirst ? first + 1 : -1
  const leftGapEnd = showFirst ? threeWin[0] - 1 : -1
  const rightGapStart = showLast ? threeWin[threeWin.length - 1] + 1 : -1
  const rightGapEnd = showLast ? last - 1 : -1

  const go = (p: number) => onChange(clamp(p, 1, totalPages))

  return (
    <nav
      className={`flex items-center gap-2 ${className}`}
      aria-label="Pagination"
    >
      <button
        type="button"
        className={baseBtn}
        disabled={page === 1}
        onClick={() => go(page - 1)}
        aria-label="Previous page"
      >
        ‹
      </button>
      {showFirst && (
        <button
          type="button"
          onClick={() => go(first)}
          className={page === first ? activeBtn : baseBtn}
        >
          {first}
        </button>
      )}
      {showFirst && leftGapStart <= leftGapEnd && (
        <EllipsisPopover
          pages={range(leftGapStart, leftGapEnd)}
          onSelect={go}
          side="left"
        />
      )}
      {threeWin.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => go(n)}
          className={n === page ? activeBtn : baseBtn}
          aria-current={n === page ? 'page' : undefined}
        >
          {n}
        </button>
      ))}
      {showLast && rightGapStart <= rightGapEnd && (
        <EllipsisPopover
          pages={range(rightGapStart, rightGapEnd)}
          onSelect={go}
          side="right"
        />
      )}
      {showLast && (
        <button
          type="button"
          onClick={() => go(last)}
          className={page === last ? activeBtn : baseBtn}
        >
          {last}
        </button>
      )}
      <button
        type="button"
        className={baseBtn}
        disabled={page === totalPages}
        onClick={() => go(page + 1)}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  )
  function EllipsisPopover({
    pages,
    onSelect,
    side,
  }: {
    pages: number[]
    onSelect: (p: number) => void
    side: 'left' | 'right'
  }) {
    return (
      <div className="group relative inline-block">
        <button
          type="button"
          className={baseBtn + ' cursor-default'}
          aria-haspopup="menu"
          aria-expanded="false"
          tabIndex={0}
        >
          …
        </button>
        {/* Popover */}
        <div
          className={[
            // 위치
            'absolute z-30',
            side === 'left' ? 'right-0' : 'left-0',
            // 박스 스타일
            'mt-2 rounded-lg border border-gray-200 bg-white shadow-lg',
            'px-2 py-1',
            // 표시/전환
            'invisible translate-y-1 opacity-0 transition-all duration-150',
            'group-hover:visible group-hover:translate-y-0 group-hover:opacity-100',
            'group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100',
            // 스크롤
            'w-auto max-w-[90vw] overflow-x-auto overscroll-contain',
            'whitespace-nowrap',
          ].join(' ')}
          role="menu"
          aria-orientation="horizontal"
        >
          <ul className="inline-flex flex-nowrap items-center gap-1">
            {pages.map((p) => (
              <button
                key={p}
                type="button"
                className="rounded-md px-2 py-1 text-sm whitespace-nowrap text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={() => onSelect(p)}
                role="menuitem"
              >
                {p}
              </button>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
