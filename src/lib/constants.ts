export const SITE_URL = "https://주식계산기.kr";

export type CalculatorItem = {
  href: string;
  label: string;
  title: string;
  desc: string;
  badge: string;
  category: "stock" | "crypto" | "hub";
};

export const CALCULATORS: CalculatorItem[] = [
  {
    href: "/profit-calculator",
    label: "수익률",
    title: "주식 수익률 계산기",
    desc: "매수가와 현재가를 기준으로 실제 수익률과 손익을 계산",
    badge: "수익 실현",
    category: "stock",
  },
  {
    href: "/average-price-calculator",
    label: "평단가",
    title: "물타기 평단가 계산기",
    desc: "추가 매수 후 평균 매입 단가(평단가)를 계산",
    badge: "포지션 조절",
    category: "stock",
  },
  {
    href: "/target-price-calculator",
    label: "목표가",
    title: "주식 목표가 계산기",
    desc: "원하는 목표 수익률에 맞는 매도 가격을 계산",
    badge: "수익 실현",
    category: "stock",
  },
  {
    href: "/stop-loss-calculator",
    label: "손절가",
    title: "주식 손절가 계산기",
    desc: "손실 제한을 위한 손절 기준 가격을 계산",
    badge: "리스크 관리",
    category: "stock",
  },
  {
    href: "/break-even-calculator",
    label: "본전 회복",
    title: "본전 회복 계산기",
    desc: "현재 손실률에서 원금 회복에 필요한 상승률을 계산",
    badge: "리스크 관리",
    category: "stock",
  },
  {
    href: "/risk-reward-calculator",
    label: "손익비",
    title: "손익비 계산기",
    desc: "기대 수익과 감수 손실의 비율 및 필요 승률을 계산",
    badge: "전략 검증",
    category: "stock",
  },
  {
    href: "/position-size-calculator",
    label: "포지션 사이즈",
    title: "포지션 사이즈 계산기",
    desc: "허용 손실 기준으로 권장 매수 수량과 투자 금액을 계산",
    badge: "자금 관리",
    category: "stock",
  },
  {
    href: "/dividend-calculator",
    label: "배당 수익",
    title: "배당 수익 계산기",
    desc: "세전·세후 배당금과 배당수익률을 자동 계산",
    badge: "현금 흐름",
    category: "stock",
  },
  {
    href: "/compound-interest-calculator",
    label: "복리 계산기",
    title: "복리 계산기",
    desc: "초기 투자금과 추가 투자금을 반영한 복리 수익 계산",
    badge: "장기 투자",
    category: "stock",
  },
  {
    href: "/overseas-stock-tax-calculator",
    label: "해외주식 세금",
    title: "해외주식 세금 계산기",
    desc: "양도소득세와 세후 수익 계산",
    badge: "세금 분석",
    category: "stock",
  },

  {
    href: "/crypto",
    label: "코인 허브",
    title: "코인 계산기 모음",
    desc: "청산가, 수익률, 레버리지, 펀딩비, 물타기 계산기 허브",
    badge: "암호화폐",
    category: "hub",
  },
  {
    href: "/crypto/entry",
    label: "100배 진입",
    title: "코인 100배 진입 계산기",
    desc: "손절폭 기준 권장 배율, 주문 명목가치, 익절가 계산",
    badge: "진입 전략",
    category: "crypto",
  },
  {
    href: "/crypto/liquidation",
    label: "청산가",
    title: "코인 청산가 계산기",
    desc: "레버리지 롱·숏 포지션의 예상 청산 가격 계산",
    badge: "리스크 관리",
    category: "crypto",
  },
  {
    href: "/crypto/leverage-profit",
    label: "레버리지 수익",
    title: "코인 레버리지 수익 계산기",
    desc: "롱·숏 포지션의 실제 수익과 ROE 계산",
    badge: "선물 수익",
    category: "crypto",
  },
  {
    href: "/crypto/profit",
    label: "코인 수익",
    title: "코인 수익 계산기",
    desc: "매수·매도 가격과 수수료 기준 실제 순수익 계산",
    badge: "수익 계산",
    category: "crypto",
  },
  {
    href: "/crypto/funding-fee",
    label: "펀딩비",
    title: "펀딩비 계산기",
    desc: "포지션 규모와 펀딩비율 기준 예상 펀딩비 계산",
    badge: "펀딩비 분석",
    category: "crypto",
  },
  {
    href: "/crypto/average",
    label: "코인 물타기",
    title: "코인 물타기 계산기",
    desc: "추가 매수 후 평균 단가와 총 매수 금액 계산",
    badge: "평균 단가",
    category: "crypto",
  },
  {
    href: "/us-stocks",
    label: "미국주식 계산기",
    title: "미국주식 계산기 모음",
    desc: "세금, 수익률, 배당, 복리 계산기 허브",
    badge: "미국주식",
    category: "hub",
  },
  {
    href: "/us-stocks/exchange-profit",
    label: "환율 반영 수익",
    title: "미국주식 환율 반영 수익 계산기",
    desc: "환율과 수수료를 반영한 원화 기준 실제 수익 계산",
    badge: "환율 분석",
    category: "stock",
  },
];

export const HEADER_CALCULATORS = [
  { href: "/profit-calculator", label: "수익률" },
  { href: "/average-price-calculator", label: "평단가" },
  { href: "/stop-loss-calculator", label: "손절가" },
  { href: "/dividend-calculator", label: "배당 수익" },
  { href: "/compound-interest-calculator", label: "복리 계산기" },
  { href: "/overseas-stock-tax-calculator", label: "해외주식 세금" },
  { href: "/calculators", label: "전체 계산기" },
  { href: "/crypto", label: "코인 계산기" },
];

export const POLICY_ROUTES = [
  { href: "/about", label: "사이트 소개" },
  { href: "/contact", label: "문의하기" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/terms", label: "이용약관" },
];