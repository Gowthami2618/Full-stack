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
    sky: 'bg-aqua-500/20 text-aqua-800 dark:text-[#5DE0EA] border-aqua-400/40 shadow-xs',
    amber: 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-400/40 shadow-xs',
    rose: 'bg-rose-500/20 text-rose-800 dark:text-rose-200 border-rose-500/40 shadow-xs',
    emerald: 'bg-mint-400/25 text-emerald-800 dark:text-mint-300 border-mint-400/50 shadow-xs',
    indigo: 'bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 border-indigo-500/40 shadow-xs',
  };

  return (
    <GlassCard
      hoverEffect={!!onClick}
      onClick={onClick}
      className="flex flex-col justify-between border-aqua-400/30 shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-extrabold text-[#58737D] dark:text-[#A8D0D5] uppercase tracking-wider">
            {title}
          </span>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-[#173B4A] dark:text-[#F3FFFF] tracking-tight mt-1">
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
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-aqua-400/20 dark:border-aqua-400/20 text-xs">
          {trend && (
            <span
              className={`font-bold ${
                trendPositive ? 'text-emerald-700 dark:text-mint-300' : 'text-rose-700 dark:text-rose-300'
              }`}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-[#58737D] dark:text-[#D3F2F4] font-semibold">{subtitle}</span>}
        </div>
      )}
    </GlassCard>
  );
};

export default StatCard;
