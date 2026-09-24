import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const ErrorState = ({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while fetching information from the server.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 glass-card border-rose-500/20 bg-rose-950/20 my-4">
      <div className="p-3.5 rounded-2xl bg-rose-900/40 border border-rose-500/30 text-rose-400 mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-rose-200 mb-1.5">{title}</h4>
      <p className="text-xs text-rose-300/80 max-w-sm mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} icon={RefreshCw}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
