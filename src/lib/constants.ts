export const SITE_URL = "https://주식계산기.kr";

export const CALCULATORS = [
  {
    href: "/profit-calculator",
    label: "수익률",
    title: "주식 수익률 계산기",
    desc: "매수가와 현재가를 기준으로 실제 수익률과 손익을 계산",
    badge: "수익 실현",
  },
  {
    href: "/average-price-calculator",
    label: "평단가",
    title: "물타기 평단가 계산기",
    desc: "추가 매수 후 평균 매입 단가(평단가)를 계산",
    badge: "포지션 조절",
  },
  {
    href: "/target-price-calculator",
    label: "목표가",
    title: "주식 목표가 계산기",
    desc: "원하는 목표 수익률에 맞는 매도 가격을 계산",
    badge: "수익 실현",
  },
  {
    href: "/stop-loss-calculator",
    label: "손절가",
    title: "주식 손절가 계산기",
    desc: "손실 제한을 위한 손절 기준 가격을 계산",
    badge: "리스크 관리",
  },
  {
    href: "/break-even-calculator",
    label: "본전 회복",
    title: "본전 회복 계산기",
    desc: "현재 손실률에서 원금 회복에 필요한 상승률을 계산",
    badge: "리스크 관리",
  },
  {
    href: "/risk-reward-calculator",
    label: "손익비",
    title: "손익비 계산기",
    desc: "기대 수익과 감수 손실의 비율 및 필요 승률을 계산",
    badge: "전략 검증",
  },
  {
    href: "/position-size-calculator",
    label: "포지션 사이즈",
    title: "포지션 사이즈 계산기",
    desc: "허용 손실 기준으로 권장 매수 수량과 투자 금액을 계산",
    badge: "자금 관리",
  },
  {
    href: "/dividend-calculator",
    label: "배당 수익",
    title: "배당 수익 계산기",
    desc: "세전·세후 배당금과 배당수익률을 자동 계산",
    badge: "현금 흐름",
  },
  {
    href: "/compound-interest-calculator",
    label: "복리 계산기",
    title: "복리 계산기",
    desc: "초기 투자금과 추가 투자금을 반영한 복리 수익 계산",
    badge: "장기 투자",
  },
  {
    href: "/overseas-stock-tax-calculator",
    label: "해외주식 세금",
    title: "해외주식 세금 계산기",
    desc: "양도소득세와 세후 수익 계산",
    badge: "세금 분석",
  },
  {
    href: "/crypto",
    label: "코인 계산기",
    title: "코인 계산기 모음",
    desc: "청산가, 수익률, 물타기 계산기 허브",
    badge: "암호화폐",
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