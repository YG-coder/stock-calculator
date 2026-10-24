import { add, div, fromInt, fromNumber, mul, sign, sub, toNumber, compare, EXACT_ZERO, type Exact } from "@/lib/exactDecimal";

/**
 * 코인 선물(선형 USDT 계약) 레버리지 손익.
 *
 * 수량 = 증거금 × 레버리지 ÷ 진입가
 * 진입 수수료 = 수량 × 진입가 × 수수료율 (= 진입 시점 포지션 금액 × 수수료율)
 * 종료 수수료 = 수량 × 종료가 × 수수료율 — 종료 시점 체결가 기준이다.
 * 근거: Bybit "Trading Fee = Order Value × Trading Fee Rate, Order Value = Quantity × Executed Price"
 * (https://www.bybit.com/en/help-center/article/Futures-Contracts-Fees-Explained).
 * 진입·종료 수수료율은 같은 값으로 가정한다(메이커/테이커 구분 없음). 펀딩비·청산은 반영하지 않는다.
 *
 * 계산은 입력 십진값 그대로의 정확한 유리수로 한다(중간에 Number로 반올림하지 않는다).
 * 화면은 calculateLeverageProfitExact를 쓰고, 표시 단계에서만 반올림한다.
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

/** 정확 계산 입력. null은 빈칸·숫자가 아닌 값(기존 NaN)이다. */
export interface LeverageProfitExactInput {
  entryPrice: Exact | null;
  exitPrice: Exact | null;
  margin: Exact | null;
  leverage: Exact | null;
  /** 퍼센트 단위. 0.1 → 0.1% */
  feeRatePercent: Exact | null;
  position: LeveragePosition;
}

export interface LeverageProfitExactResult {
  valid: boolean;
  positionSize: Exact;
  quantity: Exact;
  priceChangeRate: Exact;
  grossPnl: Exact;
  entryFee: Exact;
  exitFee: Exact;
  totalFee: Exact;
  netPnl: Exact;
  roe: Exact;
  beyondLiquidation: boolean;
}

const INVALID: LeverageProfitResult = {
  valid: false, positionSize: 0, quantity: 0, priceChangeRate: 0, grossPnl: 0,
  entryFee: 0, exitFee: 0, totalFee: 0, netPnl: 0, roe: 0, beyondLiquidation: false,
};

const INVALID_EXACT: LeverageProfitExactResult = {
  valid: false, positionSize: EXACT_ZERO, quantity: EXACT_ZERO, priceChangeRate: EXACT_ZERO, grossPnl: EXACT_ZERO,
  entryFee: EXACT_ZERO, exitFee: EXACT_ZERO, totalFee: EXACT_ZERO, netPnl: EXACT_ZERO, roe: EXACT_ZERO, beyondLiquidation: false,
};

const HUNDRED = fromInt(100);

/** 레버리지 손익 정확 계산. 유효성·산식·순서는 calculateLeverageProfit과 같다(분기는 반올림 전 정확값으로 판정). */
export function calculateLeverageProfitExact(input: LeverageProfitExactInput): LeverageProfitExactResult {
  const { entryPrice: entry, exitPrice: exit, margin, leverage: lev, feeRatePercent, position } = input;
  if (!entry || !exit || !margin || !lev || !feeRatePercent) return INVALID_EXACT;
  const fee = div(feeRatePercent, HUNDRED);
  if (sign(entry) <= 0 || sign(exit) <= 0 || sign(margin) <= 0 || sign(lev) <= 0 || sign(fee) < 0) {
    return INVALID_EXACT;
  }

  const positionSize = mul(margin, lev);
  const quantity = div(positionSize, entry);
  const move = position === "long" ? sub(exit, entry) : sub(entry, exit);
  const priceChangeRate = div(move, entry);
  const grossPnl = mul(quantity, move);

  const entryFee = mul(mul(quantity, entry), fee);
  const exitFee = mul(mul(quantity, exit), fee);
  const totalFee = add(entryFee, exitFee);

  const netPnl = sub(grossPnl, totalFee);
  const roe = mul(div(netPnl, margin), HUNDRED);
  // 불리한 방향 변동폭이 1/레버리지를 넘으면 실제 거래에서는 그 전에 청산된다.
  const beyondLiquidation = compare(priceChangeRate, div(fromInt(-1), lev)) < 0;

  return {
    valid: true, positionSize, quantity, priceChangeRate: mul(priceChangeRate, HUNDRED),
    grossPnl, entryFee, exitFee, totalFee, netPnl, roe, beyondLiquidation,
  };
}

/**
 * 레버리지 손익(기존 Number API). 이름·입력·반환 구조와 유효성은 그대로다.
 * 입력 Number의 십진 표기(String)를 정확값으로 읽어 calculateLeverageProfitExact로 계산하고,
 * 각 값은 정확한 결과에 가장 가까운 Number로 돌려준다.
 */
export function calculateLeverageProfit(input: LeverageProfitInput): LeverageProfitResult {
  const { entryPrice, exitPrice, margin, leverage, feeRatePercent, position } = input;
  if (![entryPrice, exitPrice, margin, leverage, feeRatePercent].every(Number.isFinite)) return INVALID;
  const r = calculateLeverageProfitExact({
    entryPrice: fromNumber(entryPrice), exitPrice: fromNumber(exitPrice), margin: fromNumber(margin),
    leverage: fromNumber(leverage), feeRatePercent: fromNumber(feeRatePercent), position,
  });
  if (!r.valid) return INVALID;
  return {
    valid: true, positionSize: toNumber(r.positionSize), quantity: toNumber(r.quantity),
    priceChangeRate: toNumber(r.priceChangeRate), grossPnl: toNumber(r.grossPnl), entryFee: toNumber(r.entryFee),
    exitFee: toNumber(r.exitFee), totalFee: toNumber(r.totalFee), netPnl: toNumber(r.netPnl), roe: toNumber(r.roe),
    beyondLiquidation: r.beyondLiquidation,
  };
}
