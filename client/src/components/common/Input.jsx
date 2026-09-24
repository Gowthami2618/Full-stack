import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      type = 'text',
      className = '',
      id,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-beige-300 flex items-center gap-1"
          >
            {label}
            {required && <span className="text-rose-400">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3.5 text-beige-400/60 pointer-events-none">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            required={required}
            className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 placeholder:text-beige-400/40 ${
              Icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-white/10 hover:border-white/20'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-rose-400 mt-0.5">{error}</span>}
        {helperText && !error && (
          <span className="text-xs text-beige-400/60 mt-0.5">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
