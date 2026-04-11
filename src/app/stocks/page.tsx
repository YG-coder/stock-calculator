import Link from "next/link";
import { CALCULATORS } from "@/lib/constants";

export default function StocksPage() {
    const calculators = CALCULATORS.filter((c) =>
        c.groups?.includes("stocks")
    );

    return (
        <main className="max-w-5xl mx-auto py-16 px-6">
            <h1 className="text-3xl font-bold mb-10">주식 계산기 모음</h1>

            <div className="grid gap-6 sm:grid-cols-2">
                {calculators.map((calc) => (
                    <Link
                        key={calc.href}
                        href={calc.href}
                        className="p-6 border rounded-xl hover:shadow"
                    >
                        <h2 className="text-lg font-bold">{calc.title}</h2>
                        <p className="text-sm text-gray-500 mt-2">{calc.desc}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}