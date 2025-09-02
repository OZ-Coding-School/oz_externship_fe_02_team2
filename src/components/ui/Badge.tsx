import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        
        default: 'bg-blue-50 text-blue-700 border border-blue-200',
        
        
        primary: 'bg-blue-50 text-blue-700 border border-blue-200',
        'primary-solid': 'bg-blue-500 text-white',
        
        
        secondary: 'bg-gray-50 text-gray-700 border border-gray-200',
        'secondary-solid': 'bg-gray-500 text-white',
        
        
        success: 'bg-green-50 text-green-700 border border-green-200',
        'success-solid': 'bg-green-500 text-white',
        
        
        warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
        'warning-solid': 'bg-yellow-500 text-white',
        
        
        danger: 'bg-red-50 text-red-700 border border-red-200',
        'danger-solid': 'bg-red-500 text-white',
        
        
        info: 'bg-sky-50 text-sky-700 border border-sky-200',
        'info-solid': 'bg-sky-500 text-white',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

function Badge({ className, variant, size, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {children}
    </div>
  );
}

export { Badge, badgeVariants };