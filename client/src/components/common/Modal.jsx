import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
  showClose = true,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 dark:bg-navy-950/85 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div
        className={`relative w-full ${maxWidth} glass-panel border border-pink-400/35 rounded-2xl shadow-2xl z-10 my-8 overflow-hidden transform transition-all animate-scaleUp bg-white/98 dark:bg-plum-900/98 backdrop-blur-2xl`}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-pink-400/20 bg-pink-50/80 dark:bg-plum-850/90">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#35152F] dark:text-[#FFF5FC]">{title}</h3>
            {subtitle && <p className="text-xs text-[#765E72] dark:text-[#D2AFC5] font-semibold mt-1">{subtitle}</p>}
          </div>
          {showClose && (
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="text-[#765E72] hover:text-[#35152F] dark:text-[#D2AFC5] dark:hover:text-white p-1.5 rounded-lg hover:bg-pink-500/15 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto text-[#35152F] dark:text-[#FFF5FC] bg-white/95 dark:bg-plum-900/95">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
