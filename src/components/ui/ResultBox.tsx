import React from "react";

export function ResultCard({ title, children, emptyMessage, isValid }: { title: string; children: React.ReactNode; emptyMessage: string; isValid: boolean }) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 flex-1">
        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
          </svg>
          {title}
        </h3>
        {!isValid ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">
            <p className="text-slate-500 font-medium whitespace-pre-line">{emptyMessage}</p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export function ResultHighlight({ label, value, unit, isProfit, isLoss }: { label: string; value: string; unit: string; isProfit?: boolean; isLoss?: boolean }) {
  const colorClass = isProfit ? "text-red-600 bg-red-50 border-red-100" : isLoss ? "text-blue-600 bg-blue-50 border-blue-100" : "text-slate-900 bg-white border-slate-200";
  const labelColorClass = isProfit ? "text-red-500" : isLoss ? "text-blue-500" : "text-slate-500";
  return (
    <div className={`rounded-xl p-6 border shadow-sm ${colorClass}`}>
      <p className={`text-sm font-semibold uppercase tracking-widest mb-1 ${labelColorClass}`}>
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          {value}
        </span>
        <span className={`text-lg font-bold ${labelColorClass}`}>{unit}</span>
      </div>
    </div>
  );
}

export function ResultDetail({ label, value, unit, isProfit, isLoss }: { label: string; value: string; unit: string; isProfit?: boolean; isLoss?: boolean }) {
  const textColor = isProfit ? "text-red-600" : isLoss ? "text-blue-600" : "text-slate-900";
  const bgBorderColor = isProfit ? "bg-red-50/50 border-red-100" : isLoss ? "bg-blue-50/50 border-blue-100" : "bg-white border-slate-200";
  return (
    <div className={`rounded-xl p-5 border shadow-sm ${bgBorderColor}`}>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-xl font-bold ${textColor}`}>
        {value} <span className="text-sm font-normal text-slate-500">{unit}</span>
      </p>
    </div>
  );
}
