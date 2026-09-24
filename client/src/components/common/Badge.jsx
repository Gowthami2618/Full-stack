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
    default: 'bg-white/10 text-slate-200 border-white/10',
    sky: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
    rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    purple: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
