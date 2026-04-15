// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { HEADER_CALCULATORS, POLICY_ROUTES } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://주식계산기.kr"),
  title: {
    default: "주식 계산기 모음 | 손절가, 평단가, 수익률 계산기",
    template: "%s | 주식계산기.kr",
  },
  description:
      "손절가 계산기, 수익률 계산기, 평단가 계산기, 목표가 계산기, 본전 회복 계산기, 배당 수익 계산기를 포함한 핵심 투자 계산기를 무료로 제공합니다.",
  keywords: [
    "주식 계산기",
    "손절가 계산기",
    "평단가 계산기",
    "수익률 계산기",
    "목표가 계산기",
    "물타기 계산기",
    "본전 회복 계산기",
    "배당 계산기",
    "배당 수익 계산기",
    "주식계산기.kr",
  ],
  authors: [
    {
      name: "주식계산기.kr",
      url: "https://주식계산기.kr",
    },
  ],
  creator: "주식계산기.kr",
  publisher: "주식계산기.kr",
  alternates: {
    canonical: "https://주식계산기.kr",
  },
  openGraph: {
    title: "주식 계산기 모음 | 손익, 평단가, 리스크 관리 종합 툴",
    description:
        "어려운 수식을 엑셀로 만들 필요 없이, 즉각적이고 정확한 주식 계산기로 투자 판단을 도와드립니다.",
    url: "https://주식계산기.kr",
    siteName: "주식계산기.kr",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "주식 계산기 모음 | 손익, 평단가, 리스크 관리 종합 툴",
    description:
        "수익률, 평단가, 손절가, 배당, 복리 계산기를 한 곳에서 확인하세요.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "_UQf8pcWBmQP9bzljNpCHIzFnkC5LzOwoCLCMz6_t9c",
    other: {
      "naver-site-verification":
          "ce4f0aad0e7935dd7c085660b734744be0894e61",
    },
  },
  category: "finance",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="ko">
      <head>
        <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6405509957088169"
            crossOrigin="anonymous"
        />
      </head>
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 flex flex-col min-h-screen`}
      >
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-4 md:px-6">
          <Link
              href="/"
              className="whitespace-nowrap text-2xl font-extrabold tracking-tight text-slate-900 hover:text-slate-700 transition"
          >
            주식계산기.kr
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm font-semibold text-slate-600 max-[1100px]:w-full max-[1100px]:justify-center">
            {HEADER_CALCULATORS.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="whitespace-nowrap hover:text-slate-900 transition-colors"
                >
                  {item.label}
                </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="flex-grow">{children}</div>

      <footer className="border-t border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8 font-medium">
            {POLICY_ROUTES.map((policy) => (
                <Link
                    key={policy.href}
                    href={policy.href}
                    className="hover:text-slate-900 transition"
                >
                  {policy.label}
                </Link>
            ))}
          </div>

          <p className="mb-3">
            본 사이트에서 제공하는 계산 결과는 참고용이며, 투자 권유를 의미하지
            않습니다. 투자에 대한 최종 판단과 책임은 사용자에게 있습니다.
          </p>

          <p className="mb-6">
            운영 문의:{" "}
            <a
                href="mailto:help@주식계산기.kr"
                className="font-medium text-slate-700 underline-offset-2 hover:underline"
            >
              help@주식계산기.kr
            </a>
          </p>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} 주식계산기.kr All rights reserved.
          </p>
        </div>
      </footer>
      </body>
      </html>
  );
}