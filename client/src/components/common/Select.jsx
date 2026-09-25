import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder = 'Select an option',
      className = '',
      id,
      required,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1 tracking-wide"
          >
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            required={required}
            className={`w-full appearance-none glass-input rounded-xl px-3.5 py-2.5 pr-10 text-sm font-medium transition-all duration-200 cursor-pointer text-slate-900 dark:text-white bg-white dark:bg-charcoal-900 ${
              error
                ? 'border-rose-500 focus:border-rose-500'
                : 'border-sky-400/25 hover:border-sky-400/45'
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-white dark:bg-charcoal-900 text-slate-500 dark:text-slate-400 font-normal">
                {placeholder}
              </option>
            )}
            {children
              ? children
              : options.map((opt) => {
                  const value = typeof opt === 'object' ? opt.value : opt;
                  const labelText = typeof opt === 'object' ? opt.label : opt;
                  return (
                    <option
                      key={value}
                      value={value}
                      className="bg-white dark:bg-charcoal-900 text-slate-900 dark:text-slate-100 py-1 font-medium"
                    >
                      {labelText}
                    </option>
                  );
                })}
          </select>
          <div className="absolute right-3.5 text-slate-600 dark:text-slate-300 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-0.5">{error}</span>}
        {helperText && !error && (
          <span className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{helperText}</span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
