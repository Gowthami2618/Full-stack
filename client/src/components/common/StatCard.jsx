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
    sky: 'bg-pink-500/20 text-[#D9008F] dark:text-[#FF5CAB] border-pink-400/40 shadow-xs',
    amber: 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-400/40 shadow-xs',
    rose: 'bg-rose-500/20 text-rose-800 dark:text-rose-200 border-rose-500/40 shadow-xs',
    emerald: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 shadow-xs',
    indigo: 'bg-purple-500/20 text-[#6A0DAD] dark:text-[#B517FF] border-purple-400/40 shadow-xs',
  };

  return (
    <GlassCard
      hoverEffect={!!onClick}
      onClick={onClick}
      className="flex flex-col justify-between border-pink-400/30 shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-extrabold text-[#765E72] dark:text-[#D2AFC5] uppercase tracking-wider">
            {title}
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-[#35152F] dark:text-[#FFF5FC] tracking-tight mt-1">
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
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-pink-400/20 dark:border-pink-400/20 text-xs">
          {trend && (
            <span
              className={`font-bold ${
                trendPositive ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
              }`}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-[#765E72] dark:text-[#D2AFC5] font-semibold">{subtitle}</span>}
        </div>
      )}
    </GlassCard>
  );
};

export default StatCard;
