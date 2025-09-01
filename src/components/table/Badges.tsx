export const Badge = ({
  children,
  tone = 'gray',
}: {
  children: React.ReactNode
  tone?: 'gray' | 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}) => {
  const map = {
    gray: 'bg-gray-100 text-gray-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-emerald-100 text-emerald-700',
    red: 'bg-rose-100 text-rose-700',
    yellow: 'bg-amber-100 text-amber-700',
    purple: 'bg-violet-100 text-violet-700',
  } as const
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${map[tone]}`}
    >
      {children}
    </span>
  )
}

export const TagList = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-wrap gap-1">
    {tags.map((t) => (
      <Badge key={t} tone="gray">
        {t}
      </Badge>
    ))}
  </div>
)

export const Stars = ({
  value = 0,
  of = 5,
}: {
  value?: number
  of?: number
}) => (
  <div className="text-sm text-amber-500" aria-label={`별점 ${value} / ${of}`}>
    {'★'.repeat(Math.round(value))}
    {'☆'.repeat(of - Math.round(value))}
    <span className="text-base-content/60 ml-1 text-xs">
      {value} / {of}
    </span>
  </div>
)
