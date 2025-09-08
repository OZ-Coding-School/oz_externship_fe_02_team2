import React from 'react';
import { cn } from 'src/lib/cn';
import { getBadgeStyles } from './BadgeStyle';

// Badge 컴포넌트 정의
const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, variant = 'default', size = 'md', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        getBadgeStyles(variant, size),
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = 'Badge';

export default Badge;