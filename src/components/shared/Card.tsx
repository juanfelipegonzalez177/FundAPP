import React from 'react';
import { cn } from '../ui/Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn("bg-white border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.08)] rounded-xl overflow-hidden", className)} 
      {...props}
    >
      {children}
    </div>
  );
};
