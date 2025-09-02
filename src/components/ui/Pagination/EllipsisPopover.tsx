import { memo } from 'react'
import { pageButton } from './styles'
import { cn } from '@/lib/utils'
import { Ellipsis } from 'lucide-react'

const EllipsisPopover = memo(function EllipsisPopover({
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
        className={cn(pageButton(), 'cursor-default')}
        aria-haspopup="listbox"
        aria-label="More pages"
      >
        <Ellipsis className="h-4 w-4" aria-hidden="true" />
      </button>
      <div
        className={[
          'absolute left-1/2 z-30 -translate-x-1/2',
          'mt-2 rounded-lg border border-gray-200 bg-white shadow-lg',
          'px-2 py-1',
          'invisible translate-y-1 opacity-0 transition-all duration-150',
          'group-hover:visible group-hover:translate-y-0 group-hover:opacity-100',
          'group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100',
          'max-h-60 w-fit max-w-[90vw] overflow-y-auto',
        ].join(' ')}
        role="listbox"
      >
        <ul className="grid [grid-template-columns:repeat(5,auto)] gap-1">
          {pages.map((p) => (
            <li key={p}>
              <button
                type="button"
                className="text-primary-text min-w-8 rounded-md px-2 py-1 text-center text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={() => onSelect(p)}
                role="option"
              >
                {p}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
})

export default EllipsisPopover
