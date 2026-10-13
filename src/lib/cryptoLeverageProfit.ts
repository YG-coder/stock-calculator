/**
 * 코인 선물(선형 USDT 계약) 레버리지 손익.
 *
 * 수량 = 증거금 × 레버리지 ÷ 진입가
 * 진입 수수료 = 수량 × 진입가 × 수수료율 (= 진입 시점 포지션 금액 × 수수료율)
 * 종료 수수료 = 수량 × 종료가 × 수수료율 — 종료 시점 체결가 기준이다.
 * 근거: Bybit "Trading Fee = Order Value × Trading Fee Rate, Order Value = Quantity × Executed Price"
 * (https://www.bybit.com/en/help-center/article/Futures-Contracts-Fees-Explained).
 * 진입·종료 수수료율은 같은 값으로 가정한다(메이커/테이커 구분 없음). 펀딩비·청산은 반영하지 않는다.
 */
export type LeveragePosition = "long" | "short";

export interface LeverageProfitInput {
  entryPrice: number;
  exitPrice: number;
  margin: number;
  leverage: number;
  /** 퍼센트 단위. 0.1 → 0.1% */
  feeRatePercent: number;
  position: LeveragePosition;
}

export interface LeverageProfitResult {
  valid: boolean;
  /** 진입 시점 포지션 금액 (증거금 × 레버리지) */
  positionSize: number;
  quantity: number;
  /** 퍼센트 단위, 포지션 방향 기준 */
  priceChangeRate: number;
  grossPnl: number;
  entryFee: number;
  exitFee: number;
  totalFee: number;
  netPnl: number;
  /** 퍼센트 단위 */
  roe: number;
  beyondLiquidation: boolean;
}

const INVALID: LeverageProfitResult = {
  valid: false, positionSize: 0, quantity: 0, priceChangeRate: 0, grossPnl: 0,
  entryFee: 0, exitFee: 0, totalFee: 0, netPnl: 0, roe: 0, beyondLiquidation: false,
};

export function calculateLeverageProfit(input: LeverageProfitInput): LeverageProfitResult {
  const { entryPrice: entry, exitPrice: exit, margin, leverage: lev, position } = input;
  const fee = input.feeRatePercent / 100;
  if (
    ![entry, exit, margin, lev, fee].every(Number.isFinite) ||
    entry <= 0 || exit <= 0 || margin <= 0 || lev <= 0 || fee < 0
  ) {
    return INVALID;
  }

  const positionSize = margin * lev;
  const quantity = positionSize / entry;
  const priceChangeRate = position === "long" ? (exit - entry) / entry : (entry - exit) / entry;
  const grossPnl = position === "long" ? quantity * (exit - entry) : quantity * (entry - exit);

  const entryFee = quantity * entry * fee;
  const exitFee = quantity * exit * fee;
  const totalFee = entryFee + exitFee;

  const netPnl = grossPnl - totalFee;
  const roe = (netPnl / margin) * 100;
  // 불리한 방향 변동폭이 1/레버리지를 넘으면 실제 거래에서는 그 전에 청산된다.
  const beyondLiquidation = priceChangeRate < -1 / lev;

  return {
    valid: true, positionSize, quantity, priceChangeRate: priceChangeRate * 100,
    grossPnl, entryFee, exitFee, totalFee, netPnl, roe, beyondLiquidation,
  };
}
