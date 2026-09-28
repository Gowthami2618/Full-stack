import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'glass'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-charcoal-950 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'sky-gradient-btn text-white focus:ring-sky-400 font-bold shadow-md hover:shadow-lg',
    secondary: 'bg-sky-50/80 dark:bg-navy-800 hover:bg-sky-100 dark:hover:bg-navy-750 text-slate-900 dark:text-white border border-sky-400/35 focus:ring-sky-500 shadow-xs font-semibold',
    outline: 'border-2 border-sky-500/60 dark:border-sky-400/60 text-sky-700 dark:text-sky-300 hover:bg-sky-500/10 dark:hover:bg-sky-500/20 hover:border-sky-500 focus:ring-sky-400 font-bold',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-500/40 focus:ring-rose-500 shadow-xs font-bold',
    ghost: 'text-slate-800 dark:text-slate-100 hover:text-sky-700 dark:hover:text-sky-300 hover:bg-sky-500/10 dark:hover:bg-sky-500/15 focus:ring-sky-400/20 font-semibold',
    glass: 'glass-panel hover:bg-sky-50 dark:hover:bg-navy-750 text-slate-900 dark:text-white border border-sky-400/30 shadow-xs font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
