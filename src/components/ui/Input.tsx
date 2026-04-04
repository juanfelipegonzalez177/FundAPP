import React from 'react';
import { cn } from './Button'; // simple cn reuse or separate it

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <input
          className={cn(
            "flex w-full rounded-lg border border-gray-300 bg-[#F3F4F6] px-3.5 py-2.5 text-sm transition-colors",
            "focus:border-[#2D6A4F] focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
