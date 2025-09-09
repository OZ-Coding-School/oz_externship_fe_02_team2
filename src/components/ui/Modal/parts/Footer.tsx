export default function Footer({
  children,
  align = 'end',
  className = '',
}: {
  children: React.ReactNode
  align?: 'start' | 'center' | 'end'
  className?: string
}) {
  const map = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  } as const

  return (
    <div
      className={`flex items-center ${map[align]} gap-2 px-6 py-4 ${className}`}
    >
      {children}
    </div>
  )
}
