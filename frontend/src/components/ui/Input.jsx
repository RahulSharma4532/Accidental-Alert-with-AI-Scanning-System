import React from 'react';

export default function Input({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  containerClassName = '', 
  ...props 
}) {
  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input 
          className={`
            w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-medium
            placeholder:text-slate-300 outline-none transition-all duration-300
            focus:bg-white focus:border-slate-900 focus:shadow-xl focus:shadow-slate-100
            ${Icon ? 'pl-14' : ''}
            ${error ? 'border-red-200 bg-red-50 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="text-[10px] font-bold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
}
