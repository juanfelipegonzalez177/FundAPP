import React from 'react';
import { cn } from '../ui/Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn("bg-surface border border-border-custom shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden transition-all duration-300", className)} 
      {...props}
    >
      {children}
    </div>
  );
};

