import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import Button from './Button';

export const FilterPanel = ({
  filters = [], // array of { id, label, value, options: [{ label, value }], onChange }
  onReset,
  className = '',
}) => {
  return (
    <div
      className={`glass-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 border-sky-400/20 ${className}`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 shrink-0">
        <Filter className="w-3.5 h-3.5" />
        <span>Filters</span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 flex-1 justify-end">
        {filters.map((filter) => (
          <div key={filter.id} className="min-w-[130px]">
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full glass-input text-xs py-1.5 px-3 rounded-lg bg-slate-100/90 dark:bg-charcoal-900 border-sky-400/30 text-slate-900 dark:text-slate-100 font-semibold cursor-pointer focus:border-sky-400"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white dark:bg-charcoal-900 text-slate-900 dark:text-slate-100 font-medium">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {onReset && (
          <Button variant="ghost" size="sm" onClick={onReset} icon={RotateCcw}>
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
