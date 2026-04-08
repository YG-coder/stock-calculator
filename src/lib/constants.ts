export const SITE_URL = "https://주식계산기.kr";

export const CALCULATORS = [
  {
    href: "/profit-calculator",
    label: "수익률 계산기",
    title: "수익률 계산기",
    desc: "현재가 또는 목표가로 손익 및 수익률(%) 자동 계산",
    badge: "수익 실현"
  },
  {
    href: "/average-price-calculator",
    label: "평단가 계산기",
    title: "물타기 평단가 계산기",
    desc: "추가 매입 시 최종 평단가 시뮬레이션",
    badge: "포지션 조절"
  },
  {
    href: "/target-price-calculator",
    label: "목표가 계산기",
    title: "목표가 계산기",
    desc: "도달하고자 하는 목표 수익률의 정확한 매도 가격 산출",
    badge: "수익 실현"
  },
  {
    href: "/stop-loss-calculator",
    label: "손절가 계산기",
    title: "손절가 계산기",
    desc: "지정한 손실 비율에 따른 기계적 방어 라인 구축",
    badge: "리스크 관리"
  },
  {
    href: "/break-even-calculator",
    label: "본전 회복 계산기",
    title: "본전 회복 계산기",
    desc: "현재 손실에서 원금을 복구하기 위한 필요 반등 퍼센테이지 계산",
    badge: "리스크 관리"
  },
  {
    href: "/risk-reward-calculator",
    label: "손익비 계산기",
    title: "손익비 계산기",
    desc: "잃을 금액과 얻을 금액의 손익비 및 필요 트레이딩 승률 계산",
    badge: "전략 검증"
  },
  {
    href: "/position-size-calculator",
    label: "포지션 사이즈 계산기",
    title: "포지션 사이즈 계산기",
    desc: "최대 손실 1% 통제를 위한 기계적이고 안전한 권장 매수 수량 산출",
    badge: "자금 관리"
  },
  {
    href: "/dividend-calculator",
    label: "배당 수익 계산기",
    title: "배당 수익 계산기",
    desc: "세전·세후 배당금과 배당수익률 자동 계산",
    badge: "현금 흐름"
  }
];

export const POLICY_ROUTES = [
  { href: "/about", label: "사이트 소개" },
  { href: "/contact", label: "문의하기" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/terms", label: "이용약관" }
];
