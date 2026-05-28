import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className, 
  disabled,
  ...props 
}) => {
  const baseStyled = "inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold transition-all duration-300 focus:outline-none cursor-pointer select-none active:scale-95";
  const variants = {
    primary: "bg-primary text-white hover:bg-secondary hover:shadow-[0_4px_14px_0_rgba(45,106,79,0.3)] dark:hover:shadow-[0_4px_14px_0_rgba(82,183,136,0.3)] border border-transparent",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white hover:shadow-[0_4px_14px_0_rgba(45,106,79,0.15)]",
    ghost: "bg-transparent text-text hover:bg-primary/10",
    danger: "bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_4px_14px_0_rgba(220,38,38,0.3)] border border-transparent",
  };

  return (
    <button
      className={cn(baseStyled, variants[variant], (disabled || isLoading) && "opacity-60 cursor-not-allowed active:scale-100", className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

