import React from 'react';

export default function StatusBadge({ status, className = '' }) {
  const getStatusConfig = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'pending':
      case 'awaiting':
        return { 
          bg: 'bg-amber-50', 
          text: 'text-amber-600', 
          dot: 'bg-amber-400',
          border: 'border-amber-100'
        };
      case 'approved':
      case 'completed':
      case 'active':
      case 'success':
        return { 
          bg: 'bg-emerald-50', 
          text: 'text-emerald-600', 
          dot: 'bg-emerald-400',
          border: 'border-emerald-100'
        };
      case 'rejected':
      case 'failed':
      case 'cancelled':
        return { 
          bg: 'bg-red-50', 
          text: 'text-red-600', 
          dot: 'bg-red-400',
          border: 'border-red-100'
        };
      case 'processing':
      case 'in_progress':
        return { 
          bg: 'bg-blue-50', 
          text: 'text-blue-600', 
          dot: 'bg-blue-400',
          border: 'border-blue-100'
        };
      default:
        return { 
          bg: 'bg-slate-50', 
          text: 'text-slate-600', 
          dot: 'bg-slate-400',
          border: 'border-slate-100'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`
      inline-flex items-center gap-3 px-3 py-1.5 rounded-lg border
      ${config.bg} ${config.text} ${config.border}
      text-[9px] font-black uppercase tracking-wider
      ${className}
    `}>
      <div className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse shrink-0`} />
      {status?.replace('_', ' ')}
    </div>
  );
}
