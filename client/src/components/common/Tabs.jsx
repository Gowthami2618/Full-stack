import React from 'react';

export const Tabs = ({ tabs = [], activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 border-b border-sky-400/20 overflow-x-auto pb-px max-w-full no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold border-b-2 whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 rounded-t-lg ${
              isActive
                ? 'border-sky-500 dark:border-sky-400 text-sky-700 dark:text-sky-300 bg-sky-500/15 shadow-xs'
                : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-sky-500/10'
            }`}
          >
            {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'}`} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-sky-500/25 text-sky-800 dark:text-sky-200 border border-sky-400/40'
                    : 'bg-slate-200/90 dark:bg-navy-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
