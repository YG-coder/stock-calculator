import React from "react";
import Link from "next/link";

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
