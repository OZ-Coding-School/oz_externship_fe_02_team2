import { cn } from '@/lib'

export default function Body({
  children,
  id,
  scroll = true,
  className,
  padded = true, // 기본 패딩 on
}: {
  children: React.ReactNode
  id?: string
  scroll?: boolean
  className?: string
  padded?: boolean
}) {
  return (
    <div
      id={id}
      className={cn(
        'bg-white',
        '[&>*:last-child]:mb-0',
        scroll && 'flex-1 overflow-y-auto',
        padded && 'px-6 py-6',
        className
      )}
    >
      {children}
    </div>
  )
}
