import React from 'react';

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-6 relative overflow-hidden transition-all duration-300 ${
        hoverEffect ? 'glass-panel-hover cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {/* Subtle top border sky glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/25 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};

export default GlassCard;
