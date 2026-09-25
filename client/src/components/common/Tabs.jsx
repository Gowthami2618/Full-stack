import React from 'react';

export const Tabs = ({ tabs = [], activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 border-b border-sky-400/15 overflow-x-auto pb-px ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isActive
                ? 'border-sky-500 dark:border-sky-400 text-sky-600 dark:text-sky-300 bg-sky-500/[0.08]'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-sky-400/30'
            }`}
          >
            {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-sky-500 dark:text-sky-400' : ''}`} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-400/30'
                    : 'bg-slate-200/80 dark:bg-charcoal-800 text-slate-600 dark:text-slate-400'
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
