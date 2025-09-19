import Dropdown from '@/components/ui/Dropdown/Dropdown'
import type { DropdownProps } from '@/components/ui/Dropdown/Dropdown.types'

type SectionProps = {
  title: string
  dropdown?: DropdownProps
}

export default function Section({ title, dropdown }: SectionProps) {
  return (
    <section className="flex min-w-[1120px] items-center justify-center rounded-lg bg-white p-6 shadow-xs">
      <div className="flex w-full flex-col items-center gap-6">
        <header className="flex h-9 w-full items-center justify-between">
          <h5>{title}</h5>
          {dropdown && <Dropdown {...dropdown} />}
        </header>
        <article className="h-80 w-full">
          {/* 차트 들어올 곳 (children으로 받을까...?) */}
        </article>
      </div>
    </section>
  )
}
