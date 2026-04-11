export const SITE_URL = "https://주식계산기.kr";

export type CalculatorItem = {
  href: string;
  label: string;
  title: string;
  desc: string;
  badge: string;
  category: "stock" | "crypto" | "hub";
  hubs?: ("stocks" | "crypto" | "us-stocks")[];
  featured?: boolean;
};

export const CALCULATORS: CalculatorItem[] = [
  // ===== 국내 주식 =====
  {
    href: "/profit-calculator",
    label: "수익률",
    title: "주식 수익률 계산기",
    desc: "매수가와 현재가 기준 수익률 계산",
    badge: "수익 실현",
    category: "stock",
    hubs: ["stocks"],
    featured: true,
  },
  {
    href: "/average-price-calculator",
    label: "평단가",
    title: "물타기 평단가 계산기",
    desc: "추가 매수 후 평균 단가 계산",
    badge: "포지션 조절",
    category: "stock",
    hubs: ["stocks", "us-stocks"],
    featured: true,
  },
  {
    href: "/stop-loss-calculator",
    label: "손절가",
    title: "주식 손절가 계산기",
    desc: "손실 제한 기준 가격 계산",
    badge: "리스크 관리",
    category: "stock",
    hubs: ["stocks"],
    featured: true,
  },
  {
    href: "/compound-interest-calculator",
    label: "복리",
    title: "복리 계산기",
    desc: "장기 투자 복리 수익 계산",
    badge: "장기 투자",
    category: "stock",
    hubs: ["stocks", "us-stocks"],
    featured: true,
  },

  // ===== 미국 주식 =====
  {
    href: "/overseas-stock-tax-calculator",
    label: "세금",
    title: "해외주식 세금 계산기",
    desc: "세후 수익이 얼마나 남는지 계산",
    badge: "세금 분석",
    category: "stock",
    hubs: ["us-stocks"],
  },
  {
    href: "/us-stocks/exchange-profit",
    label: "환율 수익",
    title: "환율 반영 수익 계산기",
    desc: "환율까지 반영한 실제 수익 확인",
    badge: "환율 분석",
    category: "stock",
    hubs: ["us-stocks"],
  },
  {
    href: "/us-stocks/dividend",
    label: "배당",
    title: "미국주식 배당 계산기",
    desc: "세후 배당금과 배당수익률 계산",
    badge: "배당 분석",
    category: "stock",
    hubs: ["us-stocks"],
  },

  // ===== 코인 =====
  {
    href: "/crypto",
    label: "코인",
    title: "코인 계산기 모음",
    desc: "청산가, 수익률, 레버리지 계산기",
    badge: "암호화폐",
    category: "hub",
    featured: true,
  },
  {
    href: "/crypto/entry",
    label: "진입",
    title: "코인 100배 진입 계산기",
    desc: "권장 배율 및 주문 금액 계산",
    badge: "진입 전략",
    category: "crypto",
    hubs: ["crypto"],
  },
  {
    href: "/crypto/liquidation",
    label: "청산가",
    title: "코인 청산가 계산기",
    desc: "레버리지 청산 가격 계산",
    badge: "리스크 관리",
    category: "crypto",
    hubs: ["crypto"],
  },

  // ===== 허브 =====
  {
    href: "/stocks",
    label: "국내주식",
    title: "주식 계산기 모음",
    desc: "국내주식 투자 계산기 모음",
    badge: "주식",
    category: "hub",
    featured: true,
  },
  {
    href: "/us-stocks",
    label: "미국주식",
    title: "미국주식 계산기 모음",
    desc: "세금, 환율, 배당 계산기",
    badge: "미국주식",
    category: "hub",
    featured: true,
  },
];

export const HEADER_CALCULATORS = [
  { href: "/stocks", label: "주식 계산기" },
  { href: "/crypto", label: "코인 계산기" },
  { href: "/us-stocks", label: "미국주식 계산기" },
];

export const POLICY_ROUTES = [
  { href: "/about", label: "사이트 소개" },
  { href: "/contact", label: "문의하기" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/terms", label: "이용약관" },
];