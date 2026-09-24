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
    <div className="glass-card overflow-hidden border border-white/10 shadow-glass">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-charcoal-900/80 text-xs uppercase tracking-wider text-beige-400">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-5 py-3.5 font-semibold ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, rowIdx) => (
              <tr
                key={row._id || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors duration-150 ${
                  onRowClick
                    ? 'hover:bg-white/[0.04] cursor-pointer'
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-5 py-4 text-beige-200 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${col.className || ''}`}
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
