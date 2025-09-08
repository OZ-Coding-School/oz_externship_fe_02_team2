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
    <div
      className={`mt-auto flex items-center ${map[align]} gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4`}
    >
      {children}
    </div>
  )
}
