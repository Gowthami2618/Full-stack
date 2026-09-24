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
            className="text-xs font-medium text-beige-300 flex items-center gap-1"
          >
            {label}
            {required && <span className="text-rose-400">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            required={required}
            className={`w-full appearance-none glass-input rounded-xl px-3.5 py-2.5 pr-10 text-sm transition-all duration-200 cursor-pointer bg-charcoal-900 ${
              error
                ? 'border-rose-500/80 focus:border-rose-500'
                : 'border-white/10 hover:border-white/20'
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-charcoal-900 text-beige-400/50">
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
                      className="bg-charcoal-900 text-beige-100 py-1"
                    >
                      {labelText}
                    </option>
                  );
                })}
          </select>
          <div className="absolute right-3.5 text-beige-400/60 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <span className="text-xs text-rose-400 mt-0.5">{error}</span>}
        {helperText && !error && (
          <span className="text-xs text-beige-400/60 mt-0.5">{helperText}</span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
