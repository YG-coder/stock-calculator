"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HEADER_CALCULATORS } from "@/lib/constants";

export default function SiteHeader() {
  const pathname = usePathname();
  const [showMoreIndicator, setShowMoreIndicator] = useState(true);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="whitespace-nowrap text-xl font-extrabold tracking-tight text-slate-900 transition hover:text-slate-700 sm:text-2xl"
          aria-label="주식계산기.kr 홈"
        >
          주식계산기.kr
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-600 md:flex" aria-label="주요 메뉴">
          {HEADER_CALCULATORS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`whitespace-nowrap transition-colors hover:text-slate-900 ${
                  isActive ? "text-slate-900" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="relative border-t border-slate-100 bg-white md:hidden">
        <nav
          id="mobile-navigation"
          className="overflow-x-auto"
          aria-label="모바일 메뉴"
          onScroll={(event) => {
            const nav = event.currentTarget;
            const remaining = nav.scrollWidth - nav.clientWidth - nav.scrollLeft;
            setShowMoreIndicator(remaining > 4);
          }}
        >
          <div className="mx-auto flex w-max min-w-full max-w-6xl items-center gap-1 px-4 py-2">
            {HEADER_CALCULATORS.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-lg px-3 text-sm transition-colors ${
                    isActive
                      ? "bg-slate-100 font-semibold text-slate-900"
                      : "font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {showMoreIndicator && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 flex w-14 items-center justify-end bg-gradient-to-l from-white via-white/95 to-transparent pr-2"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
