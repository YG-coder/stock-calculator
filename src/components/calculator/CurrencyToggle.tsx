type CurrencyToggleProps<T extends string> = {
    value: T;
    onChange: (value: T) => void;
    options?: readonly [T, T];
};

export default function CurrencyToggle<T extends string>({
    value,
    onChange,
    options,
}: CurrencyToggleProps<T>) {
    const [left, right] = options ?? ([("KRW" as T), ("USDT" as T)] as const);

    return (
        <div className="mb-6 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
                type="button"
                onClick={() => onChange(left)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${value === left
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
            >
                {left}
            </button>
            <button
                type="button"
                onClick={() => onChange(right)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${value === right
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
            >
                {right}
            </button>
        </div>
    );
}