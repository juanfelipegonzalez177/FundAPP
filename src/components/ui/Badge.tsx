import React from 'react';
import { cn } from './Button';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className, ...props }) => {
  const v = variant === 'success' ? 'badge-success' : 
            variant === 'warning' ? 'badge-warning' : 
            variant === 'error' ? 'badge-error' : 
            variant === 'info' ? 'badge-info' : 'bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary';

  return (
    <span className={cn("badge border font-semibold px-2.5 py-1 rounded-full text-xs tracking-wide", v, className)} {...props}>
      {children}
    </span>
  );
};

