"use client";

import React, { useMemo } from "react";

export interface InputFieldProps {
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

function sanitizeNumericString(value: string) {
  const cleaned = value.replace(/,/g, "").replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 1) return cleaned;
  return `${parts[0]}.${parts.slice(1).join("")}`;
}

function formatNumericString(value: string | number) {
  const str = String(value ?? "").replace(/,/g, "");
  if (!str) return "";

  const [integerPart, decimalPart] = str.split(".");
  const formattedInteger = integerPart
    ? new Intl.NumberFormat("ko-KR").format(Number(integerPart))
    : "";

  if (decimalPart !== undefined) {
    return `${formattedInteger}.${decimalPart}`;
  }

  return formattedInteger;
}

function formatPlaceholder(placeholder?: string) {
  if (!placeholder) return placeholder;
  return placeholder.replace(/\d[\d,]*/g, (match) => {
    const raw = match.replace(/,/g, "");
    if (!/^\d+$/.test(raw)) return match;
    return new Intl.NumberFormat("ko-KR").format(Number(raw));
  });
}

export function InputField({
  id,
  label,
  placeholder,
  value,
  onChange,
  unit,
  type = "number",
  max,
  min,
}: InputFieldProps) {
  const useGrouping = type === "number";

  const displayValue = useMemo(() => {
    if (!useGrouping) return value;
    if (value === "" || value === null || value === undefined) return "";
    return formatNumericString(value);
  }, [useGrouping, value]);

  const displayPlaceholder = useMemo(() => {
    return useGrouping ? formatPlaceholder(placeholder) : placeholder;
  }, [useGrouping, placeholder]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!useGrouping) {
      onChange(e);
      return;
    }

    const rawValue = sanitizeNumericString(e.target.value);
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: rawValue,
      },
      currentTarget: {
        ...e.currentTarget,
        value: rawValue,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-slate-600 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={useGrouping ? "text" : type}
          inputMode={type === "number" ? "decimal" : undefined}
          min={min}
          max={max}
          placeholder={displayPlaceholder}
          value={displayValue}
          onChange={handleChange}
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
