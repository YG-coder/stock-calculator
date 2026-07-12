import React from "react";

export function CalculatorCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
