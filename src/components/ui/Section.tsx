import React from "react";

export function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="mt-16 space-y-12 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
      {children}
    </section>
  );
}

export function Article({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="border-t border-slate-100 pt-10 first:border-0 first:pt-0">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
      <div className="mt-6 space-y-5 text-lg text-slate-600 leading-relaxed">
        {children}
      </div>
    </article>
  );
}
