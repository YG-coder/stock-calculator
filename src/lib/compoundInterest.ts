export type CompoundInterestInput = {
    initial: string;
    monthly: string;
    rate: string;
    years: string;
};

export type CompoundInterestResult = {
    valid: boolean;
    /** 결과가 JavaScript 숫자 범위를 넘어 계산할 수 없음. total·profit 은 표시하지 않는다. */
    overflow: boolean;
    total: number;
    principal: number;
    profit: number;
};

/**
 * 월복리 적립 계산. 월 수익률 = 연 수익률 ÷ 12, 매월 말 납입.
 *
 * 극단적인 수익률·기간에서는 (1 + r/12)^(12t) 가 Infinity 가 된다.
 * 이전 구현은 이를 화면에서 "0원"으로 표시했으므로, 유한하지 않은 결과는
 * overflow 로 따로 알려 화면이 "-" 와 안내를 보이게 한다.
 */
export function calculateCompoundInterest({
    initial,
    monthly,
    rate,
    years,
}: CompoundInterestInput): CompoundInterestResult {
    const P = Number(initial);
    const PMT = Number(monthly);
    const r = Number(rate) / 100;
    const t = Number(years);

    if (
        !Number.isFinite(P) ||
        !Number.isFinite(PMT) ||
        !Number.isFinite(r) ||
        !Number.isFinite(t) ||
        P < 0 ||
        PMT < 0 ||
        r < 0 ||
        t <= 0
    ) {
        return { valid: false, overflow: false, total: 0, principal: 0, profit: 0 };
    }

    const n = 12;
    const growth = Math.pow(1 + r / n, n * t);
    // 원금·납입액이 0 인 항은 계산하지 않는다. 0 × Infinity = NaN 을 막기 위함.
    const total =
        r === 0
            ? P + PMT * n * t
            : (P > 0 ? P * growth : 0) + (PMT > 0 ? PMT * ((growth - 1) / (r / n)) : 0);

    const principal = P + PMT * n * t;
    const profit = total - principal;

    if (!Number.isFinite(total) || !Number.isFinite(profit)) {
        return { valid: true, overflow: true, total: 0, principal, profit: 0 };
    }

    return { valid: true, overflow: false, total, principal, profit };
}
