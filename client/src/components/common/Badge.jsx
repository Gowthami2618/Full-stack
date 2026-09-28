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
    default: 'bg-aqua-100/70 dark:bg-teal-900/90 text-[#173B4A] dark:text-[#F3FFFF] border-aqua-400/30 font-bold',
    sky: 'bg-aqua-500/20 text-aqua-900 dark:text-[#5DE0EA] border-aqua-400/45 font-bold shadow-xs',
    rose: 'bg-rose-500/20 text-rose-900 dark:text-rose-200 border-rose-500/40 font-bold shadow-xs',
    emerald: 'bg-mint-400/25 text-emerald-900 dark:text-mint-300 border-mint-400/50 font-bold shadow-xs',
    amber: 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-400/40 font-bold shadow-xs',
    purple: 'bg-indigo-500/20 text-indigo-900 dark:text-indigo-200 border-indigo-500/40 font-bold shadow-xs',
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
