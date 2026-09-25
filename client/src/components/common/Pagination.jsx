import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  limit = 10,
  onPageChange,
}) => {
  if (totalPages <= 1 && totalItems <= limit) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
      <div>
        Showing <span className="font-bold text-slate-950 dark:text-white">{startItem}</span> to{' '}
        <span className="font-bold text-slate-950 dark:text-white">{endItem}</span> of{' '}
        <span className="font-bold text-slate-950 dark:text-white">{totalItems}</span> entries
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-sky-400/20 glass-panel text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-sky-400/50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
          .map((page, index, array) => {
            const showEllipsis = index > 0 && page - array[index - 1] > 1;
            return (
              <React.Fragment key={page}>
                {showEllipsis && <span className="px-1 text-slate-400">...</span>}
                <button
                  type="button"
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    currentPage === page
                      ? 'sky-gradient-btn text-white font-bold shadow-xs'
                      : 'border border-sky-400/20 glass-panel text-slate-700 dark:text-slate-300 hover:border-sky-400/50 hover:text-sky-600 dark:hover:text-white'
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            );
          })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-sky-400/20 glass-panel text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-sky-400/50 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
