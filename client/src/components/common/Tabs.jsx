import React from 'react';

export const Tabs = ({ tabs = [], activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 border-b border-aqua-400/25 overflow-x-auto pb-px max-w-full no-scrollbar ${className}`}>
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
                ? 'border-aqua-500 dark:border-aqua-400 text-aqua-800 dark:text-[#5DE0EA] bg-aqua-500/15 shadow-xs'
                : 'border-transparent text-[#58737D] dark:text-[#D3F2F4] hover:text-[#173B4A] dark:hover:text-white hover:bg-aqua-500/10'
            }`}
          >
            {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-aqua-600 dark:text-[#5DE0EA]' : 'text-[#58737D] dark:text-[#A8D0D5]'}`} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-aqua-500/25 text-aqua-900 dark:text-[#5DE0EA] border border-aqua-400/40'
                    : 'bg-aqua-100/70 dark:bg-teal-900 text-[#173B4A] dark:text-[#D3F2F4]'
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
