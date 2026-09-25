import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '', size = 'md' }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode (☀️)' : 'Switch to Dark Mode (🌙)'}
      className={`relative inline-flex items-center justify-center rounded-xl border border-sky-400/25 transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-400/50 ${
        isDark
          ? 'bg-charcoal-900/80 text-amber-300 hover:bg-charcoal-800 hover:border-amber-400/40 hover:text-amber-200 shadow-glass-subtle'
          : 'bg-white/80 text-sky-600 hover:bg-white hover:border-sky-500/40 hover:text-sky-700 shadow-sm'
      } ${sizeClasses[size]} ${className}`}
    >
      <div className="relative flex items-center justify-center overflow-hidden">
        {isDark ? (
          <Sun className={`${iconSizes[size]} transition-transform duration-500 rotate-0 hover:rotate-45 text-amber-400`} />
        ) : (
          <Moon className={`${iconSizes[size]} transition-transform duration-500 -rotate-12 hover:rotate-0 text-sky-600`} />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
