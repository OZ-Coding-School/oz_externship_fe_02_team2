import React from 'react'
import { cn } from 'src/lib/cn'
import { getBadgeStyles } from './BadgeStyle'
import { toneToVariant, type Tone, type Variant } from '@/lib'

// Badge 컴포넌트 정의
const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: Variant
    tone?: Tone
    size?: 'sm' | 'md' | 'lg'
  }
>(({ className, variant = 'default', tone, size = 'md', ...props }, ref) => {
  const resolved = tone ? toneToVariant[tone] : variant
  return (
    <div
      ref={ref}
      className={cn(getBadgeStyles(resolved, size), className)}
      data-variant={resolved}
      {...props}
    />
  )
})

Badge.displayName = 'Badge'

export default Badge
