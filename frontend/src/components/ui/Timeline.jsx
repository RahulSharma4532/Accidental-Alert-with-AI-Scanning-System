import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function Timeline({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="space-y-8">
      {items.map((item, idx) => (
        <div key={idx} className="relative pl-10 group">
          {/* Connector Line */}
          {idx !== items.length - 1 && (
            <div className="absolute left-[15px] top-8 w-[2px] h-[calc(100%+32px)] bg-slate-100 group-hover:bg-slate-200 transition-colors" />
          )}

          {/* Icon/Dot */}
          <div className={`
            absolute left-0 top-0 w-8 h-8 rounded-xl flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-110
            ${item.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 
              item.status === 'error' ? 'bg-red-50 text-red-500' : 
              'bg-slate-50 text-slate-400'}
          `}>
            {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
             item.status === 'error' ? <AlertCircle className="w-5 h-5" /> : 
             <Clock className="w-5 h-5" />}
          </div>

          {/* Content */}
          <div className="bg-white border border-slate-50 p-6 rounded-[2rem] hover:border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all duration-500">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                {item.title}
              </h4>
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                {item.date}
              </span>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
              {item.description}
            </p>
            {item.badge && (
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">
                {item.badge}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
