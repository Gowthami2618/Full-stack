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
    default: 'bg-pink-100/70 dark:bg-plum-900/90 text-[#35152F] dark:text-[#FFF5FC] border-pink-400/30 font-bold',
    sky: 'bg-pink-500/20 text-[#D9008F] dark:text-[#FF5CAB] border-pink-400/45 font-bold shadow-xs',
    rose: 'bg-rose-500/20 text-rose-900 dark:text-rose-200 border-rose-500/40 font-bold shadow-xs',
    emerald: 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 border-emerald-500/40 font-bold shadow-xs',
    amber: 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-400/40 font-bold shadow-xs',
    purple: 'bg-purple-500/20 text-[#6A0DAD] dark:text-[#B517FF] border-purple-400/40 font-bold shadow-xs',
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
