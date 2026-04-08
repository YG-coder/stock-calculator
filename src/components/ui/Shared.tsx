"use client";

import React from "react";
import Link from "next/link";

/* =========================
   number helpers
========================= */

function removeCommas(value: string) {
  return value.replace(/,/g, "");
}

function formatWithCommas(value: string) {
  if (!value) return "";

  const cleaned = value.replace(/[^\d.-]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === "." || cleaned === "-.") {
    return cleaned;
  }

  const isNegative = cleaned.startsWith("-");
  const unsigned = isNegative ? cleaned.slice(1) : cleaned;
  const [integerPart, decimalPart] = unsigned.split(".");

  const formattedInteger = (integerPart || "0").replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  return `${isNegative ? "-" : ""}${formattedInteger}${decimalPart !== undefined ? `.${decimalPart}` : ""
    }`;
}

function formatPlaceholder(placeholder?: string) {
  if (!placeholder) return placeholder;

  return placeholder.replace(/\d[\d,]*/g, (match) => {
    const raw = removeCommas(match);
    if (!/^\d+$/.test(raw)) return match;
    return Number(raw).toLocaleString("ko-KR");
  });
}

/* =========================
   Page Header
========================= */

interface PageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
}

export function PageHeader({ badge, title, description }: PageHeaderProps) {
  return (
    <section className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-5xl px-6 py-20 md:px-8 md:py-24 text-center flex flex-col items-center">
        {badge ? (
          <span className="inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-[13px] font-semibold text-slate-600 tracking-wider uppercase mb-6 shadow-sm border border-slate-200">
            {badge}
          </span>
        ) : null}

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>

        {description ? (
          <p className="mt-8 max-w-3xl text-lg sm:text-xl leading-relaxed text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/* =========================
   Layout / Cards
========================= */

export function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="grid gap-6">{children}</div>;
}

export function CalculatorCard({
  title,
  description,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 ${className}`}
    >
      {title ? (
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
      ) : null}

      {description ? (
        <p className="mt-2 mb-6 text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      ) : (
        <div className="mb-6" />
      )}

      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function ResultCard({
  title,
  children,
  className = "",
  emptyMessage,
  isValid = true,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  emptyMessage?: string;
  isValid?: boolean;
}) {
  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 ${className}`}
    >
      {title ? (
        <h3 className="mb-4 text-lg font-bold tracking-tight text-slate-900">
          {title}
        </h3>
      ) : null}

      {isValid ? (
        children
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center whitespace-pre-line text-slate-400">
          {emptyMessage ?? "값을 입력하면 결과가 표시됩니다."}
        </div>
      )}
    </section>
  );
}

export function ResultHighlight({
  label,
  value,
  unit,
  tone = "default",
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  tone?: "default" | "positive" | "negative";
  className?: string;
}) {
  const toneClass =
    tone === "positive"
      ? "text-red-600"
      : tone === "negative"
        ? "text-blue-600"
        : "text-slate-900";

  return (
    <div className={`rounded-2xl bg-slate-50 p-5 border border-slate-200 ${className}`}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${toneClass}`}>
        {value}
        {unit ? <span className="ml-1 text-lg">{unit}</span> : null}
      </p>
    </div>
  );
}

export function ResultDetail({
  label,
  value,
  unit,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0 ${className}`}
    >
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900">
        {value}
        {unit ? <span className="ml-1">{unit}</span> : null}
      </span>
    </div>
  );
}

/* =========================
   InputField
   - 기존 코드 호환
   - 숫자 입력 시 콤마 표시
========================= */

type InputFieldProps = {
  id?: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  unit?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  disabled?: boolean;
};

export function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value = "",
  onChange,
  className = "",
  unit,
  min,
  max,
  step,
  inputMode,
  disabled = false,
}: InputFieldProps) {
  const isNumeric =
    type === "number" ||
    inputMode === "numeric" ||
    inputMode === "decimal";

  const rawValue = String(value ?? "");
  const displayValue = isNumeric ? formatWithCommas(rawValue) : rawValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNumeric) {
      onChange?.(e);
      return;
    }

    const normalized = removeCommas(e.target.value);

    // 숫자/소수점/음수만 허용
    if (!/^-?\d*\.?\d*$/.test(normalized)) return;

    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: normalized,
        },
        currentTarget: {
          ...e.currentTarget,
          value: normalized,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode={inputMode ?? (isNumeric ? "decimal" : undefined)}
          placeholder={isNumeric ? formatPlaceholder(placeholder) : placeholder}
          value={displayValue}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 ${unit ? "pr-12" : ""
            }`}
        />
        {unit ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/* =========================
   Section / Article
========================= */

export function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`space-y-12 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 ${className}`}
    >
      {children}
    </section>
  );
}

export function Article({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="border-t border-slate-100 pt-10 first:border-0 first:pt-0">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        {title}
      </h2>
      <div className="mt-6 space-y-5 text-lg text-slate-600 leading-relaxed">
        {children}
      </div>
    </article>
  );
}

/* =========================
   FAQ
========================= */

export function FaqSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-8">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">{question}</h3>
      <p className="mt-3 text-slate-600 leading-relaxed">{answer}</p>
    </div>
  );
}

/* =========================
   Related Calculators
========================= */

export function RelatedCalculators({
  links,
}: {
  links: { href: string; title: string; desc: string }[];
}) {
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-lg font-bold text-slate-900">관련 계산기</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <h3 className="font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {item.desc}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* =========================
   Disclaimer
========================= */

export function Disclaimer() {
  return (
    <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-600 shadow-sm">
      <p>
        본 사이트에서 제공하는 계산 결과는 참고용이며, 투자 권유를 의미하지 않습니다.
        실제 투자 판단과 책임은 사용자 본인에게 있습니다.
      </p>
    </section>
  );
}