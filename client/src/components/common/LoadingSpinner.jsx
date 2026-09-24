import React from 'react';

export const LoadingSpinner = ({ text = 'Loading data...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 min-h-[160px]">
      <div
        className={`${sizeClasses[size]} border-sky-500/20 border-t-sky-400 rounded-full animate-spin shadow-glass-glow`}
      />
      {text && <p className="text-xs font-medium tracking-wide text-sky-300">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
