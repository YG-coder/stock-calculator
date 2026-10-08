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

const INVALID: FundingFeeResult = { valid: false, netOneTime: 0, netTotal: 0, flow: "none" };

/** -0 을 0 으로 바꾼다. Intl.NumberFormat 은 -0 을 "-0" 으로 표시한다. */
const normalizeZero = (value: number) => (value === 0 ? 0 : value);

/**
 * 펀딩비를 사용자 관점의 순현금흐름으로 계산한다.
 *
 * 펀딩비율이 양수면 롱이 지급하고 숏이 수령한다. 음수면 반대다.
 * 따라서 롱은 −(규모 × 비율), 숏은 +(규모 × 비율) 이 1회 순현금흐름이다.
 * (이전 구현은 포지션 방향과 무관하게 규모 × 비율을 그대로 표시해
 *  숏 포지션의 금액 부호·색이 안내 문구와 반대로 나왔다.)
 */
export function calculateFundingFee({
    positionSize,
    fundingRate,
    fundingCount,
    positionType,
}: FundingFeeInput): FundingFeeResult {
    const size = Number(positionSize);
    const rate = Number(fundingRate) / 100;
    const count = Number(fundingCount);

    if (
        !Number.isFinite(size) ||
        !Number.isFinite(rate) ||
        !Number.isFinite(count) ||
        size <= 0 ||
        count <= 0
    ) {
        return INVALID;
    }

    const direction = positionType === "long" ? -1 : 1;
    const netOneTime = normalizeZero(direction * size * rate);
    const netTotal = normalizeZero(netOneTime * count);
    const flow: FundingFlow = netTotal > 0 ? "receive" : netTotal < 0 ? "pay" : "none";

    return { valid: true, netOneTime, netTotal, flow };
}
