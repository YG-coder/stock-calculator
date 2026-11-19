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

/** 금리가 작을 때 매월 말 1원씩 납입해서 얻는 이자. */
function smallRateDepositInterest(rate: number, months: number): number {
    // 작은 금리에서는 납입 원금을 빼면 이자가 소실된다. 이항 전개의 이자 항
    // C(months, 2)·rate + C(months, 3)·rate² + … 를 직접 더한다.
    let term = months * ((months - 1) * rate / 2);
    let sum = term;
    for (let k = 3; ; k++) {
        term *= (months - k + 1) * rate / k;
        const next = sum + term;
        if (next === sum) return sum;
        sum = next;
    }
}

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

    const months = 12 * t;
    const monthlyRate = r / 12;
    const principal = P + (PMT > 0 ? PMT * months : 0);
    let total = principal;
    let profit = 0;
    if (monthlyRate > 0) {
        const growthMinusOne = Math.expm1(months * Math.log1p(monthlyRate));
        if (monthlyRate * Math.max(1, months) < 0.01) {
            profit = P * growthMinusOne + PMT * smallRateDepositInterest(monthlyRate, months);
            total = principal + profit;
        } else {
            const depositFactor = months === 1 ? 1 : growthMinusOne / monthlyRate;
            total = (P > 0 ? P * (1 + growthMinusOne) : 0) + (PMT > 0 ? PMT * depositFactor : 0);
            profit = total - principal;
        }
    }

    if (!Number.isFinite(total) || !Number.isFinite(profit)) {
        return { valid: true, overflow: true, total: 0, principal, profit: 0 };
    }

    return { valid: true, overflow: false, total, principal, profit };
}
