import React from "react";

export function FaqSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
      <div className="mt-8 space-y-4">
        {children}
      </div>
    </section>
  );
}

export function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-2xl bg-white p-6 shadow-sm border border-slate-200 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-slate-900">
        <span>{question}</span>
        <span className="ml-6 flex-shrink-0 text-slate-400 group-open:rotate-180 transition-transform">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </summary>
      <p className="mt-4 text-slate-600 leading-relaxed pr-8">
        {answer}
      </p>
    </details>
  );
}
