import { add, floor, fromBigInt, fromNumber, mul, sign, sub, toNumber, type Exact } from "@/lib/exactDecimal";

export type StockMarket = "kospi" | "kosdaq" | "konex" | "kotc" | "unlisted";

export type StockTransactionTaxRate = {
  label: string;
  transactionTaxRate: number;
  ruralTaxRate: number;
  note: string;
};

export const STOCK_TRANSACTION_TAX_REVIEWED_AT = "2026-08-25";
export const STOCK_TRANSACTION_TAX_EFFECTIVE_AT = "2026-01-02";

export const STOCK_TRANSACTION_TAX_RATES: Readonly<Record<StockMarket, StockTransactionTaxRate>> = {
  kospi: {
    label: "코스피",
    transactionTaxRate: 0.0005,
    ruralTaxRate: 0.0015,
    note: "증권거래세 0.05%와 농어촌특별세 0.15%를 합산합니다.",
  },
  kosdaq: {
    label: "코스닥",
    transactionTaxRate: 0.002,
    ruralTaxRate: 0,
    note: "증권거래세 0.20%를 적용합니다.",
  },
  konex: {
    label: "코넥스",
    transactionTaxRate: 0.001,
    ruralTaxRate: 0,
    note: "증권거래세 0.10%를 적용합니다.",
  },
  kotc: {
    label: "K-OTC",
    transactionTaxRate: 0.002,
    ruralTaxRate: 0,
    note: "금융투자협회를 통해 거래하는 K-OTC 주식에는 0.20%를 적용합니다.",
  },
  unlisted: {
    label: "일반 비상장·장외",
    transactionTaxRate: 0.0035,
    ruralTaxRate: 0,
    note: "K-OTC가 아닌 일반 비상장·장외 거래에는 0.35%를 적용합니다.",
  },
};

export type StockTransactionTaxResult = {
  transactionTax: number;
  ruralTax: number;
  totalTax: number;
  netProceeds: number;
  totalRate: number;
};

/** 화면 표시용: 세액은 원 단위 정수(bigint), 차감 후 금액·세율은 정확한 유리수. */
export type StockTransactionTaxExactResult = {
  transactionTax: bigint;
  ruralTax: bigint;
  totalTax: bigint;
  netProceeds: Exact;
  totalRate: Exact;
};

/**
 * 증권거래세 정확 계산. 매도금액은 입력 십진값 그대로의 정확값이다(큰 금액도 Number로 먼저 바꾸지 않는다).
 * 계산 순서·내림 위치는 기존과 같다: 세목별로 매도금액 × 세율의 원 미만을 먼저 버린 뒤 합산하고,
 * 세금 차감 후 금액 = 매도금액 − 합계(반올림 없음, 화면 표시 단계에서만 원 단위 표시).
 */
export function calculateStockTransactionTaxExact(
  saleAmount: Exact,
  market: StockMarket,
): StockTransactionTaxExactResult {
  if (sign(saleAmount) < 0) {
    throw new Error("매도금액은 0 이상의 숫자여야 합니다.");
  }

  const rate = STOCK_TRANSACTION_TAX_RATES[market];
  if (!rate) throw new Error("지원하지 않는 시장 구분입니다.");

  // 세율 상수는 코드에 적힌 십진값(예: 0.0005) 그대로 정확값으로 쓴다.
  const transactionRate = fromNumber(rate.transactionTaxRate);
  const ruralRate = fromNumber(rate.ruralTaxRate);

  // 실제 징수 방식에 맞춰 각 세목에서 원 미만을 먼저 버린 뒤 합산한다.
  // 코스피는 증권거래세와 농어촌특별세를 따로 절사해야 합계가 정확하다.
  const transactionTax = floor(mul(saleAmount, transactionRate));
  const ruralTax = floor(mul(saleAmount, ruralRate));
  const totalTax = transactionTax + ruralTax;

  return {
    transactionTax,
    ruralTax,
    totalTax,
    netProceeds: sub(saleAmount, fromBigInt(totalTax)),
    totalRate: add(transactionRate, ruralRate),
  };
}

/**
 * 증권거래세 계산(기존 Number API). 매도금액 Number의 십진 표기(String)를 정확값으로 읽어
 * calculateStockTransactionTaxExact와 같은 순서로 계산하고, 결과를 Number로 돌려준다.
 */
export function calculateStockTransactionTax(
  saleAmount: number,
  market: StockMarket,
): StockTransactionTaxResult {
  if (!Number.isFinite(saleAmount) || saleAmount < 0) {
    throw new Error("매도금액은 0 이상의 숫자여야 합니다.");
  }
  const r = calculateStockTransactionTaxExact(fromNumber(saleAmount), market);
  return {
    transactionTax: Number(r.transactionTax),
    ruralTax: Number(r.ruralTax),
    totalTax: Number(r.totalTax),
    netProceeds: toNumber(r.netProceeds),
    totalRate: toNumber(r.totalRate),
  };
}
