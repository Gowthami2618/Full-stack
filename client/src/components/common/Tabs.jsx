import React from 'react';

export const Tabs = ({ tabs = [], activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 border-b border-pink-400/25 overflow-x-auto pb-px max-w-full no-scrollbar ${className}`}>
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
                ? 'border-[#F72585] dark:border-[#FF5CAB] text-[#D9008F] dark:text-[#FF5CAB] bg-pink-500/15 shadow-xs'
                : 'border-transparent text-[#765E72] dark:text-[#D2AFC5] hover:text-[#35152F] dark:hover:text-white hover:bg-pink-500/10'
            }`}
          >
            {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-[#F72585] dark:text-[#FF5CAB]' : 'text-[#765E72] dark:text-[#D2AFC5]'}`} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-pink-500/25 text-[#D9008F] dark:text-[#FF5CAB] border border-pink-400/40'
                    : 'bg-pink-100/70 dark:bg-plum-900 text-[#35152F] dark:text-[#D2AFC5]'
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
