import { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionCard, Article } from "@/components/ui/Shared";

export const metadata: Metadata = {
  title: "주식 계산기 모음 | 평단가, 손절가, 물타기, 수익률 자동 계산",
  description:
    "감정적인 투자를 막는 핵심 도구 모음입니다. 수익률, 목표가, 손절가, 평단가 및 본전 회복 등 투자 시 꼭 필요한 모든 수치를 수학적으로 계산해 드립니다.",
  keywords: [
    "주식 계산기", "평단가 계산기", "수익률 계산기", "손절가 계산기", "물타기 계산기", "주식 계산기 모음"
  ],
  openGraph: {
    title: "주식 계산기 모음 | 투자 필수 툴 허브",
    description: "주식 투자 전 감정을 배제한 기계적 전략 수립을 돕습니다. 빠르고 정확한 증권 계산기 7종을 무료로 이용하세요.",
    type: "website",
  },
};

export default function HomePage() {
  const calculators = [
    { 
      href: "/profit-calculator", 
      title: "수익률 계산기", 
      desc: "현재가 또는 목표가로 손익 및 수익률(%) 자동 계산", 
      badge: "수익 실현" 
    },
    { 
      href: "/average-price-calculator", 
      title: "물타기 평단가 계산기", 
      desc: "추가 매입 시 최종 평단가 시뮬레이션", 
      badge: "포지션 조절" 
    },
    { 
      href: "/stop-loss-calculator", 
      title: "손절가 계산기", 
      desc: "지정한 손실 비율에 따른 기계적 방어 라인 구축", 
      badge: "리스크 관리" 
    },
    { 
      href: "/target-price-calculator", 
      title: "목표가 계산기", 
      desc: "도달하고자 하는 목표 수익률의 정확한 매도 가격 산출", 
      badge: "수익 실현" 
    },
    { 
      href: "/break-even-calculator", 
      title: "본전 회복 계산기", 
      desc: "현재 손실에서 원금을 복구하기 위한 필요 반등 퍼센테이지 계산", 
      badge: "리스크 관리" 
    },
    { 
      href: "/risk-reward-calculator", 
      title: "손익비 계산기", 
      desc: "잃을 금액과 얻을 금액의 손익비 및 필요 트레이딩 승률 계산", 
      badge: "전략 검증" 
    },
    { 
      href: "/position-size-calculator", 
      title: "포지션 사이즈 계산기", 
      desc: "최대 손실 1% 통제를 위한 기계적이고 안전한 권장 매수 수량 산출", 
      badge: "자금 관리" 
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-6 py-20 md:px-8 md:py-32 text-center text-balance flex flex-col items-center">
          <span className="inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-[13px] font-semibold text-slate-600 tracking-wider uppercase mb-6 shadow-sm border border-slate-200">
            당신의 자산을 지키는 필수 금융 툴
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900">
            다양한 투자 계산을<br className="hidden sm:block"/> 간편하게 확인하세요.
          </h1>
          <p className="mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-slate-500">
            평단가, 수익률, 손절가 등 다양한 투자 계산을 간편하게 확인할 수 있습니다. 투자 판단을 위한 참고 도구로 활용해보세요.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-16 md:px-8">
        {/* Calculator Grid */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-24">
          {calculators.map((calc, idx) => (
            <Link
              key={calc.href}
              href={calc.href}
              className={`group flex flex-col justify-start rounded-[24px] bg-white p-8 border border-slate-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 ${idx === calculators.length - 1 ? 'sm:col-span-2 lg:col-span-2 text-center items-center' : ''}`}
            >
              <div className="flex w-full items-center justify-between mb-6">
                <span className="inline-flex rounded-full bg-slate-50 border border-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {calc.badge}
                </span>
                <span className="text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-slate-800 mb-3">
                {calc.title}
              </h2>
              <p className="text-base text-slate-500 leading-relaxed font-medium">
                {calc.desc}
              </p>
            </Link>
          ))}
        </section>

        {/* Global SEO Info */}
        <SectionCard>
          <Article title="왜 주식 계산기가 필요한가요?">
            <p>
              투자에 실패하는 가장 큰 이유는 <strong>'감정적 판단'</strong>입니다. 주가가 떨어지면 더 떨어질까 봐 두려워서 공포 매도를 하고, 주가가 오르면 더 오를까 봐 욕심을 부리다 매도 타이밍을 놓치곤 합니다.
            </p>
            <p>
              이 계산기들은 복잡한 엑셀(Excel)이나 수동 수식을 세팅할 필요 없이, 가장 중요한 투자 지표들을 즉각적으로 도출해 줍니다. 
              기계적이고 반복적인 전략 수립을 통해 리스크를 객관화하고 원칙 매매를 할 수 있는 토대를 마련하세요.
            </p>
          </Article>
          
          <Article title="계산 결과 활용법 안내">
            <p>
              본 사이트에서 제공해 드리는 모든 결괏값은 기초 수학 식에 기반한 참조용 수치입니다. 실제 국내외 증권사 계좌에서 매매하실 때는 <strong>실 거래 수수료, 제세공과금, 시장의 슬리피지(호가 공백)</strong> 등에 따라 표기되는 숫자와 소폭 달라질 수 있으므로 언제나 보수적으로 투자 결정을 내리시길 권장합니다.
            </p>
          </Article>
        </SectionCard>
      </div>
    </main>
  );
}