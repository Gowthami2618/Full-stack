import React from 'react';

export const SkeletonLoader = ({ count = 3, className = 'h-16 w-full' }) => {
  return (
    <div className="flex flex-col gap-3 w-full animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-white/5 border border-white/5 rounded-xl ${className}`}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
