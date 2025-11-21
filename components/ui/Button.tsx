
import React from 'react';

// FIX: Added a size prop to support different button sizes and resolve the type error.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', size = 'md', ...props }) => {
  // FIX: Removed 'text-sm' from base classes to be handled by size classes.
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variantClasses = {
    primary: 'bg-brand-primary text-white hover:bg-brand-dark',
    secondary: 'bg-brand-light text-brand-text hover:brightness-95 dark:hover:brightness-110',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-gray-200',
  };

  // FIX: Defined size-specific classes for padding and font size.
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    // FIX: Replaced hardcoded padding/text classes with dynamic size class.
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};
