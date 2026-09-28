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
            className="text-xs font-bold text-[#173B4A] dark:text-[#F3FFFF] flex items-center gap-1 tracking-wide"
          >
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3.5 text-[#58737D] dark:text-[#A8D0D5] pointer-events-none">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            required={required}
            className={`w-full glass-input rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#173B4A] dark:text-[#F3FFFF] transition-all duration-200 placeholder:text-[#58737D] dark:placeholder:text-[#A8D0D5] ${
              Icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-aqua-400/30 hover:border-aqua-400/50'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-0.5">{error}</span>}
        {helperText && !error && (
          <span className="text-xs text-[#58737D] dark:text-[#A8D0D5] mt-0.5">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
