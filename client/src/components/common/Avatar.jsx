import React from 'react';

export const Avatar = ({
  src,
  name = 'User',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-charcoal-700 to-charcoal-900 border border-sky-400/30 text-sky-400 font-medium shrink-0 shadow-sm ${sizeStyles[size]} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default Avatar;
