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
        className="fixed inset-0 bg-slate-900/60 dark:bg-charcoal-950/80 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div
        className={`relative w-full ${maxWidth} glass-panel border border-sky-400/25 rounded-2xl shadow-2xl z-10 my-8 overflow-hidden transform transition-all animate-scaleUp`}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-sky-400/15 bg-white/70 dark:bg-charcoal-900/60">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-950 dark:text-white">{title}</h3>
            {subtitle && <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">{subtitle}</p>}
          </div>
          {showClose && (
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1.5 rounded-lg hover:bg-sky-500/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto text-slate-900 dark:text-slate-100">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
