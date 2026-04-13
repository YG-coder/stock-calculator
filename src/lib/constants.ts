export const SITE_URL = "https://주식계산기.kr";

export type CalculatorItem = {
  href: string;
  label: string;
  title: string;
  desc: string;
  badge: string;
  kind: "calculator" | "hub";
  groups?: ("stocks" | "crypto" | "us-stocks")[];
  featured?: boolean;
  isCommon?: boolean; // ✅ 공용 여부 추가
};

export const CALCULATORS: CalculatorItem[] = [
  // ===== 국내 주식 =====
  {
    href: "/profit-calculator",
    label: "수익률",
    title: "주식 수익률 계산기",
    desc: "매수가와 현재가 기준 수익률 계산",
    badge: "수익 실현",
    kind: "calculator",
    groups: ["stocks"],
    isCommon: true, // ✅ 공용
    featured: true,
  },
  {
    href: "/average-price-calculator",
    label: "평단가",
    title: "물타기 평단가 계산기",
    desc: "추가 매수 후 평균 단가 계산",
    badge: "포지션 조절",
    kind: "calculator",
    groups: ["stocks"],
    isCommon: true,
    featured: true,
  },
  {
    href: "/target-price-calculator",
    label: "목표가",
    title: "주식 목표가 계산기",
    desc: "원하는 목표 수익률에 맞는 매도 가격 계산",
    badge: "수익 실현",
    kind: "calculator",
    groups: ["stocks"],
    isCommon: true,
  },
  {
    href: "/stop-loss-calculator",
    label: "손절가",
    title: "주식 손절가 계산기",
    desc: "손실 제한 기준 가격 계산",
    badge: "리스크 관리",
    kind: "calculator",
    groups: ["stocks"],
    isCommon: true,
    featured: true,
  },
  {
    href: "/break-even-calculator",
    label: "본전 회복",
    title: "본전 회복 계산기",
    desc: "현재 손실률에서 원금 회복에 필요한 상승률 계산",
    badge: "리스크 관리",
    kind: "calculator",
    groups: ["stocks"],
    isCommon: true,
  },
  {
    href: "/risk-reward-calculator",
    label: "손익비",
    title: "손익비 계산기",
    desc: "기대 수익과 감수 손실의 비율 및 필요 승률 계산",
    badge: "전략 검증",
    kind: "calculator",
    groups: ["stocks"],
    isCommon: true,
  },
  {
    href: "/position-size-calculator",
    label: "포지션 사이즈",
    title: "포지션 사이즈 계산기",
    desc: "허용 손실 기준으로 권장 매수 수량과 투자 금액 계산",
    badge: "자금 관리",
    kind: "calculator",
    groups: ["stocks"],
    isCommon: true,
  },
  {
    href: "/dividend-calculator",
    label: "배당 수익",
    title: "배당 수익 계산기",
    desc: "세전·세후 배당금과 배당수익률 계산",
    badge: "현금 흐름",
    kind: "calculator",
    groups: ["stocks"],
    isCommon: true,
  },
  {
    href: "/compound-interest-calculator",
    label: "복리",
    title: "복리 계산기",
    desc: "장기 투자 복리 수익 계산",
    badge: "장기 투자",
    kind: "calculator",
    groups: ["stocks"],
    isCommon: true,
    featured: true,
  },

  // ===== 미국 주식 (전용만) =====
  {
    href: "/overseas-stock-tax-calculator",
    label: "세금",
    title: "해외주식 세금 계산기",
    desc: "세후 수익이 얼마나 남는지 계산",
    badge: "세금 분석",
    kind: "calculator",
    groups: ["us-stocks"],
  },
  {
    href: "/us-stocks/exchange-profit",
    label: "환율 수익",
    title: "환율 반영 수익 계산기",
    desc: "환율까지 반영한 실제 수익 확인",
    badge: "환율 분석",
    kind: "calculator",
    groups: ["us-stocks"],
  },
  {
    href: "/us-stocks/dividend",
    label: "배당",
    title: "미국주식 배당 계산기",
    desc: "세후 배당금과 배당수익률 계산",
    badge: "배당 분석",
    kind: "calculator",
    groups: ["us-stocks"],
  },

  // ===== 코인 =====
  {
    href: "/crypto/entry",
    label: "진입",
    title: "코인 100배 진입 계산기",
    desc: "권장 배율 및 주문 금액 계산",
    badge: "진입 전략",
    kind: "calculator",
    groups: ["crypto"],
  },
  {
    href: "/crypto/liquidation",
    label: "청산가",
    title: "코인 청산가 계산기",
    desc: "레버리지 청산 가격 계산",
    badge: "리스크 관리",
    kind: "calculator",
    groups: ["crypto"],
  },
  {
    href: "/crypto/leverage-profit",
    label: "레버리지 수익",
    title: "코인 레버리지 수익 계산기",
    desc: "롱·숏 포지션 수익과 ROE 계산",
    badge: "선물 수익",
    kind: "calculator",
    groups: ["crypto"],
  },
  {
    href: "/crypto/profit",
    label: "코인 수익",
    title: "코인 수익 계산기",
    desc: "매수·매도 가격 기준 순수익 계산",
    badge: "수익 계산",
    kind: "calculator",
    groups: ["crypto"],
  },
  {
    href: "/crypto/funding-fee",
    label: "펀딩비",
    title: "펀딩비 계산기",
    desc: "포지션 기준 예상 펀딩비 계산",
    badge: "펀딩비 분석",
    kind: "calculator",
    groups: ["crypto"],
  },
  {
    href: "/crypto/average",
    label: "코인 물타기",
    title: "코인 물타기 계산기",
    desc: "평균 단가 및 총 매수 금액 계산",
    badge: "평균 단가",
    kind: "calculator",
    groups: ["crypto"],
  },

  // ===== 허브 =====
  {
    href: "/stocks",
    label: "국내주식",
    title: "주식 계산기 모음",
    desc: "국내주식 투자 계산기 모음",
    badge: "주식",
    kind: "hub",
    featured: true,
  },
  {
    href: "/crypto",
    label: "코인",
    title: "코인 계산기 모음",
    desc: "암호화폐 계산기 모음",
    badge: "암호화폐",
    kind: "hub",
    featured: true,
  },
  {
    href: "/us-stocks",
    label: "미국주식",
    title: "미국주식 계산기 모음",
    desc: "세금, 환율, 배당 계산기",
    badge: "미국주식",
    kind: "hub",
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