import { memo, type ElementType } from 'react'
import { cn } from '@/lib/cn'

/**
 * Skeleton UI — 범용 프리미티브 모음
 */

type CommonProps = {
  className?: string
  /** 스켈레톤 배경톤 (기본: gray-200) */
  tone?: 'subtle' | 'default' | 'strong'
  /** 둥글기 */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'default'
  /** 장식용일 때 true → aria-hidden 적용 */
  decorative?: boolean
}

function toneToBg(tone: CommonProps['tone']) {
  switch (tone) {
    case 'subtle':
      return 'bg-gray-100'
    case 'strong':
      return 'bg-gray-300'
    default:
      return 'bg-gray-200'
  }
}

function roundToCls(r?: CommonProps['rounded']) {
  switch (r) {
    case 'none':
      return 'rounded-none'
    case 'sm':
      return 'rounded-sm'
    case 'md':
      return 'rounded-md'
    case 'lg':
      return 'rounded-lg'
    case 'xl':
      return 'rounded-xl'
    case '2xl':
      return 'rounded-2xl'
    case 'full':
      return 'rounded-full'
    default:
      return 'rounded'
  }
}

/** ---------------------------------------------------
 * Container
 * --------------------------------------------------- */
type ContainerProps<T extends ElementType> = {
  as?: T
  className?: string
  label?: string
  busy?: boolean
  children: React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children'>

function Container<T extends ElementType = 'div'>({
  as,
  className,
  label = 'Loading…',
  busy = true,
  children,
  ...rest
}: ContainerProps<T>) {
  const Comp = (as || 'div') as ElementType
  return (
    <Comp
      className={cn('animate-pulse', className)}
      role={busy ? 'status' : undefined}
      aria-live={busy ? 'polite' : undefined}
      aria-busy={busy || undefined}
      aria-label={busy ? label : undefined}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/** ---------------------------------------------------
 * Block (사각형)
 * --------------------------------------------------- */
type BlockProps<T extends ElementType> = CommonProps & {
  as?: T
  width?: number | string
  height?: number | string
} & Omit<React.ComponentPropsWithoutRef<T>, 'as'>

function Block<T extends ElementType = 'div'>({
  as,
  className,
  tone = 'default',
  rounded = 'default',
  width,
  height,
  decorative = true,
  ...rest
}: BlockProps<T>) {
  const Comp = (as || 'div') as ElementType
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }
  return (
    <Comp
      className={cn(
        toneToBg(tone),
        roundToCls(rounded),
        'w-full',
        'h-4',
        className
      )}
      style={style}
      aria-hidden={decorative || undefined}
      {...rest}
    />
  )
}

/** ---------------------------------------------------
 * Circle (원형)
 * --------------------------------------------------- */
type CircleProps = CommonProps & {
  size?: number
}

function Circle({ className, size = 48, tone = 'default' }: CircleProps) {
  return (
    <div
      className={cn(
        toneToBg(tone),
        'rounded-full',
        `w-[${size}px] h-[${size}px]`,
        className
      )}
    />
  )
}

/** ---------------------------------------------------
 * Text (여러 줄)
 * --------------------------------------------------- */
type TextProps = CommonProps & {
  lines?: number
  widths?: number[] // 각 줄의 % 값
  gap?: number
  size?: 'sm' | 'md' | 'lg'
}

function Text({
  className,
  lines = 1,
  widths,
  gap = 8,
  size = 'md',
  tone = 'default',
  rounded = 'default',
}: TextProps) {
  const h = size === 'sm' ? 10 : size === 'lg' ? 18 : 14
  const arr = Array.from({ length: lines })
  return (
    <div className={cn('flex flex-col', `gap-[${gap}px]`, className)}>
      {arr.map((_, i) => {
        const w = widths?.[i] ?? (i === arr.length - 1 ? 60 : 100)
        return (
          <div
            key={i}
            className={cn(
              toneToBg(tone),
              roundToCls(rounded),
              `h-[${h}px] w-[${Math.max(10, Math.min(100, w))}%]`
            )}
          />
        )
      })}
    </div>
  )
}

/** ---------------------------------------------------
 * Export
 * --------------------------------------------------- */
export const Skeleton = Object.assign(memo(Block), {
  Container: memo(Container),
  Block: memo(Block),
  Text: memo(Text),
  Circle: memo(Circle),
})

export default Skeleton
