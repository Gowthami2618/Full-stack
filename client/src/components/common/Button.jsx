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
    primary: 'aqua-gradient-btn text-white focus:ring-aqua-400 font-bold shadow-md hover:shadow-lg',
    secondary: 'bg-white/80 dark:bg-teal-900/80 hover:bg-aqua-500 hover:text-white dark:hover:bg-aqua-400 dark:hover:text-teal-950 text-[#1685A5] dark:text-[#D3F2F4] border border-aqua-400/40 focus:ring-aqua-400 shadow-xs font-bold transition-all',
    outline: 'border-2 border-aqua-500/60 dark:border-aqua-400/60 text-aqua-800 dark:text-[#5DE0EA] hover:bg-aqua-500/15 dark:hover:bg-aqua-500/25 hover:border-aqua-500 focus:ring-aqua-400 font-bold',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white border border-rose-500/40 focus:ring-rose-500 shadow-xs font-bold',
    ghost: 'text-[#173B4A] dark:text-[#F3FFFF] hover:text-aqua-700 dark:hover:text-[#5DE0EA] hover:bg-aqua-500/15 dark:hover:bg-aqua-500/20 focus:ring-aqua-400/20 font-bold',
    glass: 'glass-panel hover:bg-white/95 dark:hover:bg-teal-800/90 text-[#173B4A] dark:text-[#F3FFFF] border border-aqua-400/35 shadow-xs font-bold',
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
