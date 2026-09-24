import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import Button from '../../components/common/Button';
import GlassCard from '../../components/common/GlassCard';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <GlassCard className="max-w-md w-full text-center p-8 border-rose-500/30">
        <div className="p-4 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 w-fit mx-auto mb-4">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-beige-100 mb-2">
          Access Restricted (403)
        </h2>
        <p className="text-xs text-beige-400 mb-6 leading-relaxed">
          You do not have the required permissions or role privileges to view this specific
          workspace or administrative page.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} icon={ArrowLeft}>
            Go Back
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/')} icon={Home}>
            Home Hub
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

export default UnauthorizedPage;
