import React from "react";

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
