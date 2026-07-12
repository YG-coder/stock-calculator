import React from "react";

export function PageHeader({ badge, title, description }: { badge: string; title: string; description: string }) {
  return (
    <section className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-5xl px-6 py-16 md:px-8 md:py-24">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 tracking-wide uppercase">
          {badge}
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-slate-900">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          {description}
        </p>
        <div className="mt-8">
          <a
            href="#calculator-section"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            계산 시작하기 &darr;
          </a>
        </div>
      </div>
    </section>
  );
}

export function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid gap-6 lg:grid-cols-2" id="calculator-section">
      {children}
    </section>
  );
}
