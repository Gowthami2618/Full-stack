import React from 'react';
import GlassCard from './GlassCard';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  variant = 'sky',
  onClick,
}) => {
  const iconVariants = {
    sky: 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-400/40 shadow-xs',
    amber: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-400/40 shadow-xs',
    rose: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40 shadow-xs',
    emerald: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 shadow-xs',
    indigo: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/40 shadow-xs',
  };

  return (
    <GlassCard
      hoverEffect={!!onClick}
      onClick={onClick}
      className="flex flex-col justify-between border-sky-400/25 shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            {title}
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 dark:text-white tracking-tight mt-1">
            {value}
          </span>
        </div>
        {Icon && (
          <div className={`p-3 rounded-2xl border shrink-0 ${iconVariants[variant] || iconVariants.sky}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-sky-400/20 dark:border-sky-400/20 text-xs">
          {trend && (
            <span
              className={`font-bold ${
                trendPositive ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
              }`}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-700 dark:text-slate-200 font-semibold">{subtitle}</span>}
        </div>
      )}
    </GlassCard>
  );
};

export default StatCard;
