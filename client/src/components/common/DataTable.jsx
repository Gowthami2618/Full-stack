import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

export const DataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
}) => {
  if (isLoading) {
    return (
      <div className="glass-card overflow-hidden">
        <LoadingSpinner text="Loading records..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState description={emptyMessage} />;
  }

  return (
    <div className="glass-card overflow-hidden border border-sky-400/25 shadow-glass">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-sky-400/25 bg-sky-50/90 dark:bg-navy-900/90 text-xs uppercase tracking-wider text-slate-950 dark:text-white font-extrabold">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-5 py-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-400/15 dark:divide-white/10 bg-white/60 dark:bg-navy-850/60">
            {data.map((row, rowIdx) => (
              <tr
                key={row._id || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors duration-150 ${
                  onRowClick
                    ? 'hover:bg-sky-500/10 dark:hover:bg-sky-500/15 cursor-pointer'
                    : 'hover:bg-sky-500/5 dark:hover:bg-sky-500/10'
                }`}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-5 py-4 text-slate-900 dark:text-slate-100 font-semibold ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                  >
                    {col.render ? col.render(row, rowIdx) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
