import React, { useState, useRef, useEffect } from 'react';
import { ChevronsLeftRight, Sparkles, Image as ImageIcon } from 'lucide-react';

export const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = 'BEFORE (Original Site)',
  afterLabel = 'AFTER (DesignSpace Transformation)',
  title = '',
  aspectRatio = 'aspect-[16/9]',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Fallbacks if images missing
  const defaultBefore =
    beforeImage ||
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80';
  const defaultAfter =
    afterImage ||
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80';

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col gap-3">
      {title && (
        <div className="flex items-center justify-between">
          <h4 className="text-base font-serif font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            {title}
          </h4>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ChevronsLeftRight className="w-3.5 h-3.5 text-sky-400" /> Drag slider to compare
          </span>
        </div>
      )}

      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        className={`relative w-full ${aspectRatio} rounded-2xl overflow-hidden select-none cursor-ew-resize border border-sky-400/25 shadow-2xl glass-panel group`}
      >
        {/* AFTER Image (Background full) */}
        <img
          src={defaultAfter}
          alt="After Renovation"
          className="absolute inset-0 w-full h-full object-cover"
          draggable="false"
        />

        {/* AFTER Badge */}
        <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-slate-900 font-bold text-[11px] tracking-wider uppercase shadow-lg pointer-events-none">
          {afterLabel}
        </div>

        {/* BEFORE Image (Clipped layer) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={defaultBefore}
            alt="Before Renovation"
            className="absolute inset-y-0 left-0 h-full object-cover max-w-none"
            style={{
              width: containerRef.current ? containerRef.current.clientWidth : '100%',
            }}
            draggable="false"
          />
        </div>

        {/* BEFORE Badge */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-charcoal-900/80 backdrop-blur-md text-sky-300 font-bold text-[11px] tracking-wider uppercase border border-sky-400/30 shadow-lg pointer-events-none">
          {beforeLabel}
        </div>

        {/* Divider Line & Handle */}
        <div
          className="absolute inset-y-0 w-1 bg-gradient-to-b from-sky-300 via-white to-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)] z-20 pointer-events-none"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
          {/* Circular grab handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.9)] border-2 border-white group-hover:scale-110 transition-transform">
            <ChevronsLeftRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
