import React from 'react';
import { cn } from './Button';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className, ...props }) => {
  const v = variant === 'success' ? 'badge-success' : 
            variant === 'warning' ? 'badge-warning' : 
            variant === 'error' ? 'badge-error' : 
            variant === 'info' ? 'badge-info' : 'bg-gray-100 text-gray-800';

  return (
    <span className={cn("badge", v, className)} {...props}>
      {children}
    </span>
  );
};
