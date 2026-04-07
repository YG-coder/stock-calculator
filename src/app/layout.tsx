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
    "손절가 계산기, 평단가 계산기, 수익률 계산기를 한 번에 사용할 수 있는 주식 계산기 사이트입니다.",
  keywords: [
    "주식 계산기",
    "손절가 계산기",
    "평단가 계산기",
    "수익률 계산기",
    "주식 수익 계산기",
  ],
  alternates: {
    canonical: "https://주식계산기.kr",
  },
  openGraph: {
    title: "주식 계산기 모음 | 손절가, 평단가, 수익률 계산기",
    description:
      "손절가 계산기, 평단가 계산기, 수익률 계산기를 한 번에 사용할 수 있는 주식 계산기 사이트입니다.",
    url: "https://주식계산기.kr",
    siteName: "주식계산기.kr",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header
          style={{
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/"
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#111827",
                textDecoration: "none",
              }}
            >
              주식계산기.kr
            </Link>

            <nav
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <Link href="/" style={{ color: "#374151", textDecoration: "none" }}>
                홈
              </Link>
              <Link
                href="/average-price-calculator"
                style={{ color: "#374151", textDecoration: "none" }}
              >
                평단가 계산기
              </Link>
              <Link
                href="/stop-loss-calculator"
                style={{ color: "#374151", textDecoration: "none" }}
              >
                손절가 계산기
              </Link>
              <Link href="/about" style={{ color: "#374151", textDecoration: "none" }}>
                사이트 소개
              </Link>
              <Link href="/contact" style={{ color: "#374151", textDecoration: "none" }}>
                문의하기
              </Link>
              <Link href="/privacy" style={{ color: "#374151", textDecoration: "none" }}>
                개인정보처리방침
              </Link>
              <Link href="/terms" style={{ color: "#374151", textDecoration: "none" }}>
                이용약관
              </Link>
            </nav>
          </div>
        </header>

        <main style={{ minHeight: "calc(100vh - 140px)" }}>{children}</main>

        <footer
          style={{
            borderTop: "1px solid #e5e7eb",
            marginTop: "40px",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "24px 20px",
              color: "#6b7280",
              fontSize: "14px",
              lineHeight: 1.7,
            }}
          >
            <p style={{ marginBottom: "8px" }}>
              주식계산기.kr은 투자 판단을 보조하기 위한 계산 도구를 제공합니다.
            </p>
            <p>투자 결과에 대한 책임은 이용자 본인에게 있습니다.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}