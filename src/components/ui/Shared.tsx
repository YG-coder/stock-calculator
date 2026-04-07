import React from "react";
import Link from "next/link";

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
            계산하기 &darr;
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

interface InputFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit?: string;
  type?: string;
  max?: number;
  min?: number;
}

export function InputField({ id, label, placeholder, value, onChange, unit, type = "number", max, min }: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-600 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          min={min}
          max={max}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="block w-full rounded-lg border-0 bg-slate-50 py-3 pl-4 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-base font-medium transition"
        />
        {unit && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-slate-400 font-medium">{unit}</span>
          </div>
        )}
      </div>
    </div>
  );
}

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

export function RelatedCalculators({ links }: { links: { href: string; title: string; desc: string; }[] }) {
  return (
    <section className="mt-12 bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
      <h3 className="text-2xl font-bold text-slate-900">시너지 효과를 내는 금융 유틸리티</h3>
      <p className="mt-2 text-slate-500">투자에 꼭 필요한 효율적인 추가 유틸리티들을 만나보세요.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex flex-col justify-center rounded-2xl bg-slate-50 px-6 py-8 border border-slate-200 transition hover:border-slate-800 hover:shadow-md"
          >
            <span className="font-semibold text-slate-900 group-hover:text-slate-800">{link.title}</span>
            <span className="mt-2 text-sm text-slate-500">{link.desc}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Disclaimer() {
  return (
    <div className="mt-12 mb-8 rounded-lg bg-slate-100 p-4 text-center text-xs text-slate-500 border border-slate-200">
      본 사이트에서 제공하는 계산 결과는 참고용이며, 투자 권유를 의미하지 않습니다. 투자에 대한 최종 판단과 책임은 사용자에게 있습니다.
    </div>
  );
}
