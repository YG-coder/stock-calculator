import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
    "손절가 계산기, 수익률 계산기, 평단가 계산기, 목표가 계산기, 본전 회복 계산기를 포함한 7종의 핵심 기능 주식 계산기 모음 사이트입니다.",
  keywords: [
    "주식 계산기",
    "손절가 계산기",
    "평단가 계산기",
    "수익률 계산기",
    "목표가 계산기",
    "물타기 계산기",
    "본전 회복 계산기",
  ],
  alternates: {
    canonical: "https://주식계산기.kr",
  },
  openGraph: {
    title: "주식 계산기 모음 | 손익, 평단가, 리스크 관리 종합 툴",
    description:
      "어려운 수식을 엑셀로 만들 필요 없이, 즉각적이고 정확한 증권 계산기 7종으로 투자 안전성을 높이세요.",
    url: "https://주식계산기.kr",
    siteName: "주식계산기.kr",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    other: {
      "naver-site-verification":
        "ce4f0aad0e7935dd7c085660b734744be0894e61",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const calculators = [
    { href: "/profit-calculator", label: "수익률 계산기" },
    { href: "/average-price-calculator", label: "평단가 계산기" },
    { href: "/target-price-calculator", label: "목표가 계산기" },
    { href: "/stop-loss-calculator", label: "손절가 계산기" },
    { href: "/break-even-calculator", label: "본전 회복 계산기" },
    { href: "/risk-reward-calculator", label: "손익비 계산기" },
    { href: "/position-size-calculator", label: "포지션 사이즈 계산기" },
  ];

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
          <div className="mx-auto max-w-5xl px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <Link
              href="/"
              className="text-xl font-extrabold text-slate-900 tracking-tight hover:text-slate-700 transition"
            >
              주식계산기.kr
            </Link>

            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-600">
              {calculators.map((calc) => (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="hover:text-slate-900 transition-colors"
                >
                  {calc.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <div className="flex-grow">{children}</div>

        <footer className="border-t border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8 font-medium">
              <Link href="/about" className="hover:text-slate-900 transition">
                사이트 소개
              </Link>
              <Link href="/contact" className="hover:text-slate-900 transition">
                문의하기
              </Link>
              <Link href="/privacy" className="hover:text-slate-900 transition">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="hover:text-slate-900 transition">
                이용약관
              </Link>
            </div>
            <p>
              본 사이트에서 제공하는 계산 결과는 참고용이며, 투자 권유를 의미하지 않습니다.
              투자에 대한 최종 판단과 책임은 사용자에게 있습니다.
            </p>
            <p className="mt-6 text-xs text-slate-400">
              © {new Date().getFullYear()} 주식계산기.kr All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}