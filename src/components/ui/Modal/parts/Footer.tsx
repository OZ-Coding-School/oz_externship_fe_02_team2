export default function Footer({
  children,
  align = 'end',
}: {
  children: React.ReactNode
  align?: 'start' | 'center' | 'end'
}) {
  const map = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  } as const
  return (
    <div className={`mt-6 flex items-center ${map[align]} gap-2 border-t pt-4`}>
      {children}
    </div>
  )
}
