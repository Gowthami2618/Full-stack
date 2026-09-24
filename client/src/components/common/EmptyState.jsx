import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No records found',
  description = 'There are no items to display right now.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 glass-card border-dashed border-sky-400/20 my-4">
      <div className="p-4 rounded-2xl bg-charcoal-800/80 border border-sky-400/30 text-sky-400 mb-4 shadow-glass-subtle">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-serif font-semibold text-slate-100 mb-2">{title}</h4>
      <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} icon={ArrowRight}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
