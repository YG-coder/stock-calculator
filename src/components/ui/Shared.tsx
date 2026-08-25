"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CALCULATOR_HELP_BY_PATH } from "@/lib/calculatorHelp";

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
  const pathname = usePathname();
  const help = CALCULATOR_HELP_BY_PATH[pathname];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      {help ? <GettingStarted {...help} /> : null}
      {children}
    </div>
  );
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
  children?: React.ReactNode;
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
  grouping?: boolean;
  /** 입력칸 아래 항상 보이는 한 줄 설명. */
  hint?: string;
  /** "자세히"를 눌렀을 때 펼쳐지는 설명. 예시와 값이 결과에 미치는 영향. */
  help?: string;
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
  grouping = true,
  hint,
  help,
}: InputFieldProps) {
  const isNumeric =
    type === "number" ||
    inputMode === "numeric" ||
    inputMode === "decimal";

  const rawValue = String(value ?? "");
  const displayValue = isNumeric && grouping ? formatWithCommas(rawValue) : rawValue;

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
          placeholder={isNumeric && grouping ? formatPlaceholder(placeholder) : placeholder}
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

      {hint ? <p className="text-sm leading-relaxed text-slate-500">{hint}</p> : null}
      {help ? <FieldHelp>{help}</FieldHelp> : null}
    </div>
  );
}

/** 입력칸에 딸린 접이식 상세 설명. 기본은 접힘. */
export function FieldHelp({ children }: { children: React.ReactNode }) {
  return (
    <details className="group">
      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1 text-sm font-medium text-slate-500 underline decoration-dotted underline-offset-4 hover:text-slate-700">
        <span aria-hidden="true">?</span> 자세히
      </summary>
      <div className="mt-2 space-y-2 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
        {typeof children === "string"
          ? children.split("\n\n").map((line) => <p key={line}>{line}</p>)
          : children}
      </div>
    </details>
  );
}

/* =========================
   도움말 / 고급 설정 / 결과 안내
========================= */

export type GettingStartedProps = {
  /** 무엇을 계산하는 도구인지 */
  what: string;
  /** 무엇을 입력해야 하는지 */
  input: string;
  /** 결과를 어떻게 읽는지 */
  read: string;
  /** 처음 써보는 사람을 위한 입력 예시 */
  example: string;
};

/** 계산기 상단의 "처음 사용하시나요?" 접이식 안내. 기본은 접힘. */
export function GettingStarted({ what, input, read, example }: GettingStartedProps) {
  return (
    <details className="rounded-2xl border border-slate-200 bg-white">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900">
        <span aria-hidden="true">💡</span> 처음 사용하시나요?
      </summary>
      <div className="space-y-4 border-t border-slate-100 px-4 py-4 text-sm leading-relaxed text-slate-600">
        <div>
          <h3 className="mb-1 font-semibold text-slate-800">무엇을 계산하나요</h3>
          <p>{what}</p>
        </div>
        <div>
          <h3 className="mb-1 font-semibold text-slate-800">무엇을 입력하나요</h3>
          <p>{input}</p>
        </div>
        <div>
          <h3 className="mb-1 font-semibold text-slate-800">결과를 어떻게 읽나요</h3>
          <p>{read}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <h3 className="mb-1 font-semibold text-slate-800">입력 예시</h3>
          <p>{example}</p>
          <p className="mt-1 text-xs text-slate-500">
            도구 사용법을 익히기 위한 예시이며 시장 전망이나 권장 투자안이 아닙니다.
          </p>
        </div>
      </div>
    </details>
  );
}

/** 일반 사용자가 건드릴 필요 없는 입력을 접어두는 영역. */
export function AdvancedPanel({ children }: { children: React.ReactNode }) {
  return (
    <details className="rounded-2xl border border-slate-200">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-800">
        <span aria-hidden="true">⚙</span> 고급 설정
      </summary>
      <div className="space-y-4 border-t border-slate-100 px-4 py-4">{children}</div>
    </details>
  );
}

/** 결과 카드 아래 작은 글씨 안내. */
export function ResultNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-2 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
      {children}
    </div>
  );
}

/** 입력값을 올리면 결과가 어떻게 달라지는지 — 시뮬레이션 계산기 공통. */
export function InputEffectNote() {
  return (
    <p className="text-sm leading-relaxed text-slate-500">
      수익률을 높이면 예상 결과가 전체적으로 커집니다. 변동성을 높이면 결과의 폭이 넓어져
      좋은 쪽은 더 커지고 나쁜 쪽은 더 나빠지며, 목표를 넘지 못할 가능성도 함께 커집니다.
      기간을 늘리면 복리 효과와 불확실성이 동시에 커집니다.
    </p>
  );
}

/** 백분위 결과 해석 고지 — 시뮬레이션 계산기 공통. */
export function PercentileNote() {
  return (
    <>
      <p>
        <strong>보수적인 경우</strong>는 만들어본 미래 중 결과가 하위 10% 부근이었던 상황입니다.
        손실이 이보다 크지 않다는 뜻이 아니며 최저 금액을 보장하지 않습니다.
      </p>
      <p>
        이 결과는 입력한 가정에 따른 계산이며 실제 투자 결과를 예측하거나 보장하지 않습니다.
        세금과 거래비용은 반영하지 않았습니다.
      </p>
    </>
  );
}

type SelectFieldProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
};

export function SelectField({ id, label, value, onChange, children, className = "" }: SelectFieldProps) {
  return <div className={`space-y-2 ${className}`}><label htmlFor={id} className="block text-sm font-semibold text-slate-700">{label}</label><select id={id} value={value} onChange={onChange} className="block min-h-[50px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-500">{children}</select></div>;
}

type TextareaFieldProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
};

export function TextareaField({ id, label, value, onChange, placeholder, className = "" }: TextareaFieldProps) {
  return <div className={`space-y-2 ${className}`}><label htmlFor={id} className="block text-sm font-semibold text-slate-700">{label}</label><textarea id={id} value={value} onChange={onChange} placeholder={placeholder} className="min-h-32 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500" /></div>;
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
