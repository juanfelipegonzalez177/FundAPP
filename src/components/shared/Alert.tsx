import React from 'react';
import { cn } from '../ui/Button';

interface AlertProps {
  type?: 'success' | 'error' | 'info';
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', children }) => {
  return (
    <div className={cn(
      "p-4 mb-4 text-sm rounded-lg border",
      type === 'success' ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
      type === 'error' ? "bg-red-50 text-red-800 border-red-200" :
      "bg-blue-50 text-blue-800 border-blue-200"
    )}>
      {children}
    </div>
  );
};
