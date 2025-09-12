export default function Header({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`body-sm ${className} flex items-center justify-between px-6 py-4 font-medium`}
    >
      {children}
    </div>
  )
}
