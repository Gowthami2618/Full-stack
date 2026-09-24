import React from 'react';

export const ProgressBar = ({
  progress = 0,
  showLabel = true,
  size = 'md', // 'sm' | 'md' | 'lg'
  variant = 'sky', // 'sky' | 'emerald' | 'rose' | 'indigo'
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, Number(progress) || 0));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantClasses = {
    sky: 'bg-gradient-to-r from-sky-400 to-sky-600 shadow-[0_0_12px_rgba(56,189,248,0.35)]',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]',
    rose: 'bg-gradient-to-r from-rose-500 to-pink-400 shadow-[0_0_12px_rgba(244,63,94,0.35)]',
    indigo: 'bg-gradient-to-r from-indigo-500 to-sky-400 shadow-[0_0_12px_rgba(99,102,241,0.35)]',
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Completion Progress</span>
          <span className="text-sky-300 font-semibold">{clamped}%</span>
        </div>
      )}
      <div
        className={`w-full bg-charcoal-800 rounded-full overflow-hidden border border-white/5 ${sizeClasses[size]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${variantClasses[variant] || variantClasses.sky}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
