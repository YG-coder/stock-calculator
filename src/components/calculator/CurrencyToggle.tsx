"use client";

type Currency = "KRW" | "USDT";

type Props = {
    value: Currency;
    onChange: (value: Currency) => void;
    label?: string;
};

export default function CurrencyToggle({
    value,
    onChange,
    label = "표시 통화",
}: Props) {
    return (
        <div className="space-y-2">
            <span className="block text-sm font-semibold text-slate-700">{label}</span>

            <div className="inline-flex rounded-2xl border border-slate-300 bg-white p-1">
                {(["KRW", "USDT"] as const).map((currency) => {
                    const active = value === currency;

                    return (
                        <button
                            key={currency}
                            type="button"
                            onClick={() => onChange(currency)}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${active
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            {currency}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}