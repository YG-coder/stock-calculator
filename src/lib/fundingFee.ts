import { div, finiteNumberExact, fromInt, mul, sign, toNumber, EXACT_ZERO, type Exact } from "@/lib/exactDecimal";

export type PositionType = "long" | "short";

export type FundingFeeInput = {
    positionSize: string;
    fundingRate: string;
    fundingCount: string;
    positionType: PositionType;
};

/** receive = 수령, pay = 지급, none = 0 */
export type FundingFlow = "receive" | "pay" | "none";

export type FundingFeeResult = {
    valid: boolean;
    /** 1회당 순현금흐름. 양수 = 수령, 음수 = 지급 */
    netOneTime: number;
    /** 누적 순현금흐름. 양수 = 수령, 음수 = 지급 */
    netTotal: number;
    flow: FundingFlow;
};

/** 화면 표시용 정확 결과. fundingRate는 입력 펀딩비율(%를 100으로 나눈 값)이다. */
export type FundingFeeExactResult = {
    valid: boolean;
    netOneTime: Exact;
    netTotal: Exact;
    flow: FundingFlow;
    fundingRate: Exact;
};

const INVALID: FundingFeeResult = { valid: false, netOneTime: 0, netTotal: 0, flow: "none" };
const INVALID_EXACT: FundingFeeExactResult = {
    valid: false, netOneTime: EXACT_ZERO, netTotal: EXACT_ZERO, flow: "none", fundingRate: EXACT_ZERO,
};

/** -0 을 0 으로 바꾼다. Intl.NumberFormat 은 -0 을 "-0" 으로 표시한다. */
const normalizeZero = (value: number) => (value === 0 ? 0 : value);

/**
 * 펀딩비를 사용자 관점의 순현금흐름으로 정확히 계산한다(입력 십진값 그대로, 중간 반올림 없음).
 *
 * 펀딩비율이 양수면 롱이 지급하고 숏이 수령한다. 음수면 반대다.
 * 따라서 롱은 −(규모 × 비율), 숏은 +(규모 × 비율) 이 1회 순현금흐름이다.
 * (이전 구현은 포지션 방향과 무관하게 규모 × 비율을 그대로 표시해
 *  숏 포지션의 금액 부호·색이 안내 문구와 반대로 나왔다.)
 * 입력 계약은 기존 Number(값)과 같다: 펀딩비율 빈칸은 미입력, 규모·횟수 빈칸은 0(→ 무효),
 * Number가 NaN·±Infinity로 보는 값은 무효. 지급·수령 판정은 반올림 전 정확값의 부호로 한다.
 */
export function calculateFundingFeeExact({
    positionSize,
    fundingRate,
    fundingCount,
    positionType,
}: FundingFeeInput): FundingFeeExactResult {
    // 펀딩비율 빈칸을 0%로 계산하지 않는다. 0%는 직접 입력해야 한다.
    if (fundingRate.trim() === "") return INVALID_EXACT;
    const size = finiteNumberExact(positionSize);
    const ratePercent = finiteNumberExact(fundingRate);
    const count = finiteNumberExact(fundingCount);

    if (!size || !ratePercent || !count || sign(size) <= 0 || sign(count) <= 0) {
        return INVALID_EXACT;
    }

    const rate = div(ratePercent, fromInt(100));
    const direction = fromInt(positionType === "long" ? -1 : 1);
    const netOneTime = mul(mul(direction, size), rate);
    const netTotal = mul(netOneTime, count);
    const flow: FundingFlow = sign(netTotal) > 0 ? "receive" : sign(netTotal) < 0 ? "pay" : "none";

    return { valid: true, netOneTime, netTotal, flow, fundingRate: rate };
}

/**
 * 펀딩비(기존 Number API). 이름·입력·반환 구조와 유효성은 그대로다.
 * calculateFundingFeeExact로 계산하고 금액은 정확한 결과에 가장 가까운 Number(−0은 0)로 돌려준다.
 */
export function calculateFundingFee(input: FundingFeeInput): FundingFeeResult {
    const r = calculateFundingFeeExact(input);
    if (!r.valid) return INVALID;
    return {
        valid: true,
        netOneTime: normalizeZero(toNumber(r.netOneTime)),
        netTotal: normalizeZero(toNumber(r.netTotal)),
        flow: r.flow,
    };
}
