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
        className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div
        className={`relative w-full ${maxWidth} glass-panel border border-white/15 rounded-2xl shadow-2xl z-10 my-8 overflow-hidden transform transition-all animate-scaleUp`}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10 bg-charcoal-900/60">
          <div>
            <h3 className="text-xl font-serif font-semibold text-beige-100">{title}</h3>
            {subtitle && <p className="text-xs text-beige-400 mt-1">{subtitle}</p>}
          </div>
          {showClose && (
            <button
              onClick={onClose}
              className="text-beige-400 hover:text-beige-100 p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
