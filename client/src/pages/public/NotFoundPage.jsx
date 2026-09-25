import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';
import Button from '../../components/common/Button';
import GlassCard from '../../components/common/GlassCard';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <GlassCard className="max-w-md w-full text-center p-8 border-white/10">
        <div className="p-4 rounded-2xl bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-400/20 w-fit mx-auto mb-4">
          <HelpCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-950 dark:text-white mb-2">404</h2>
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Page Not Found</p>
        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-6 leading-relaxed">
          The architectural plan or page you are looking for has been relocated or does not exist.
        </p>
        <Button variant="primary" size="sm" onClick={() => navigate('/')} icon={Home} className="mx-auto">
          Return to Dashboard
        </Button>
      </GlassCard>
    </div>
  );
};

export default NotFoundPage;
