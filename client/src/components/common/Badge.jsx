import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // 'default' | 'sky' | 'rose' | 'emerald' | 'purple'
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  const variantStyles = {
    default: 'bg-slate-200/90 dark:bg-navy-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-sky-400/20 font-bold',
    sky: 'bg-sky-500/20 text-sky-800 dark:text-sky-200 border-sky-400/40 font-bold shadow-xs',
    rose: 'bg-rose-500/20 text-rose-800 dark:text-rose-200 border-rose-500/40 font-bold shadow-xs',
    emerald: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-emerald-500/40 font-bold shadow-xs',
    amber: 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-400/40 font-bold shadow-xs',
    purple: 'bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 border-indigo-500/40 font-bold shadow-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
