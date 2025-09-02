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

const baseBtn =
  'inline-flex select-none items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 body-sm text-secondary-text hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed'

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

  const page = safePage
  const threeWin = threeWindow(safePage, safeTotal)

  const first = 1
  const last = safeTotal

  const showFirst = !threeWin.includes(first)
  const showLast = !threeWin.includes(last)

  const leftGapStart = showFirst ? 2 : -1
  const leftGapEnd = showFirst ? threeWin[0] - 1 : -1
  const rightGapStart = showLast ? threeWin[threeWin.length - 1] + 1 : -1
  const rightGapEnd = showLast ? last - 1 : -1

  const go = (p: number) => onChange(clamp(p, 1, safeTotal))

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
        disabled={page === safeTotal}
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
  }: {
    pages: number[]
    onSelect: (p: number) => void
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
            'absolute left-1/2 z-30 -translate-x-1/2',
            // 박스 스타일
            'mt-2 rounded-lg border border-gray-200 bg-white shadow-lg',
            'px-2 py-1',
            // 표시/전환
            'invisible translate-y-1 opacity-0 transition-all duration-150',
            'group-hover:visible group-hover:translate-y-0 group-hover:opacity-100',
            'group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100',
            // 스크롤
            'max-h-60 w-fit max-w-[90vw] overflow-y-auto',
          ].join(' ')}
          role="menu"
          aria-orientation="horizontal"
        >
          <ul className="grid [grid-template-columns:repeat(5,auto)] gap-1">
            {pages.map((p) => (
              <li key={p} role="none">
                <button
                  type="button"
                  className="text-primary-text min-w-8 rounded-md px-2 py-1 text-center text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
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
