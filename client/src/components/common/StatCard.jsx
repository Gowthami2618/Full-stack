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
    sky: 'bg-sky-500/15 text-sky-400 border-sky-400/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    indigo: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  };

  return (
    <GlassCard
      hoverEffect={!!onClick}
      onClick={onClick}
      className="flex flex-col justify-between"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 tracking-tight mt-1">
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
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
          {trend && (
            <span
              className={`font-semibold ${
                trendPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-400/80">{subtitle}</span>}
        </div>
      )}
    </GlassCard>
  );
};

export default StatCard;
