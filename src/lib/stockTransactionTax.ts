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

export function calculateStockTransactionTax(
  saleAmount: number,
  market: StockMarket,
): StockTransactionTaxResult {
  if (!Number.isFinite(saleAmount) || saleAmount < 0) {
    throw new Error("매도금액은 0 이상의 숫자여야 합니다.");
  }

  const rate = STOCK_TRANSACTION_TAX_RATES[market];
  if (!rate) throw new Error("지원하지 않는 시장 구분입니다.");

  const transactionTax = saleAmount * rate.transactionTaxRate;
  const ruralTax = saleAmount * rate.ruralTaxRate;
  const totalTax = transactionTax + ruralTax;

  return {
    transactionTax,
    ruralTax,
    totalTax,
    netProceeds: saleAmount - totalTax,
    totalRate: rate.transactionTaxRate + rate.ruralTaxRate,
  };
}
