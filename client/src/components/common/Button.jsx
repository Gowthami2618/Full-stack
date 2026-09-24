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
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-charcoal-950 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'sky-gradient-btn text-white focus:ring-sky-400 font-semibold shadow-md',
    secondary: 'bg-charcoal-800 hover:bg-charcoal-750 text-slate-100 border border-sky-400/20 focus:ring-sky-500 shadow-sm',
    outline: 'border border-sky-400/40 text-sky-400 hover:bg-sky-400/10 hover:border-sky-400 focus:ring-sky-400',
    danger: 'bg-rose-600/80 hover:bg-rose-600 text-white border border-rose-500/40 focus:ring-rose-500 shadow-sm',
    ghost: 'text-slate-300 hover:text-white hover:bg-white/5 focus:ring-white/20',
    glass: 'glass-panel hover:bg-charcoal-700/80 text-slate-100 border border-sky-400/25 shadow-sm',
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
