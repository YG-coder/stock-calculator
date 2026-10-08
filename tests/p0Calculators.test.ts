import { describe, expect, it } from "vitest";
import { calculateOverseasStockTax } from "@/lib/overseasStockTax";
import { calculateUsDividend } from "@/lib/usDividend";
import { calculateFundingFee } from "@/lib/fundingFee";
import { calculateCompoundInterest } from "@/lib/compoundInterest";

describe("해외주식 양도소득세 — 입력 검증", () => {
    it("정상 입력 결과는 기존과 같다 (1,000만→1,500만, 공제 250만)", () => {
        const r = calculateOverseasStockTax({ buyAmount: "10000000", sellAmount: "15000000", deduction: "2500000" });
        expect(r.valid).toBe(true);
        expect(r.grossGain).toBe(5_000_000);
        expect(r.taxableGain).toBe(2_500_000);
        expect(r.taxAmount).toBeCloseTo(550_000, 6);
        expect(r.netGain).toBeCloseTo(4_450_000, 6);
        expect(r.effectiveRate).toBeCloseTo(11, 9);
    });

    it("공제 0원을 직접 입력하면 0원 공제로 계산한다", () => {
        const r = calculateOverseasStockTax({ buyAmount: "10000000", sellAmount: "15000000", deduction: "0" });
        expect(r.valid).toBe(true);
        expect(r.taxAmount).toBeCloseTo(1_100_000, 6);
    });

    it("손실이면 세금은 0원이다", () => {
        const r = calculateOverseasStockTax({ buyAmount: "15000000", sellAmount: "10000000", deduction: "2500000" });
        expect(r.valid).toBe(true);
        expect(r.taxAmount).toBe(0);
        expect(r.grossGain).toBe(-5_000_000);
    });

    it("기본공제가 빈칸이면 계산하지 않는다 (0원 공제로 처리하지 않음)", () => {
        const r = calculateOverseasStockTax({ buyAmount: "10000000", sellAmount: "15000000", deduction: "" });
        expect(r.valid).toBe(false);
        expect(r.missingFields).toEqual(["deduction"]);
    });

    it("매수 금액이 빈칸이면 계산하지 않는다 (취득가 0원으로 처리하지 않음)", () => {
        const r = calculateOverseasStockTax({ buyAmount: "", sellAmount: "15000000", deduction: "2500000" });
        expect(r.valid).toBe(false);
        expect(r.missingFields).toEqual(["buyAmount"]);
    });

    it("매도 금액이 빈칸이면 계산하지 않는다", () => {
        const r = calculateOverseasStockTax({ buyAmount: "10000000", sellAmount: " ", deduction: "2500000" });
        expect(r.valid).toBe(false);
        expect(r.missingFields).toEqual(["sellAmount"]);
    });

    it("아무것도 입력하지 않으면 누락 항목을 모두 돌려준다", () => {
        const r = calculateOverseasStockTax({ buyAmount: "", sellAmount: "", deduction: "" });
        expect(r.valid).toBe(false);
        expect(r.missingFields).toEqual(["buyAmount", "sellAmount", "deduction"]);
    });

    it("음수 입력은 계산하지 않는다", () => {
        expect(calculateOverseasStockTax({ buyAmount: "10000000", sellAmount: "15000000", deduction: "-1" }).valid).toBe(false);
    });
});

describe("미국 배당 — 원천징수세율 입력 검증", () => {
    const base = { shares: "100", annualDividendPerShareUsd: "2", buyPriceUsd: "50", exchangeRate: "1350" };

    it("정상 입력 결과는 기존과 같다 (15%)", () => {
        const r = calculateUsDividend({ ...base, withholdingTaxRate: "15" });
        expect(r.valid).toBe(true);
        expect(r.grossAnnualDividendUsd).toBe(200);
        expect(r.taxAmountUsd).toBeCloseTo(30, 9);
        expect(r.netAnnualDividendKrw).toBeCloseTo(229_500, 6);
        expect(r.monthlyNetDividendKrw).toBeCloseTo(19_125, 6);
        expect(r.netYield).toBeCloseTo(3.4, 9);
    });

    it("0%를 직접 입력하면 세금 0으로 계산한다", () => {
        const r = calculateUsDividend({ ...base, withholdingTaxRate: "0" });
        expect(r.valid).toBe(true);
        expect(r.taxAmountUsd).toBe(0);
    });

    it("원천징수세율이 빈칸이면 계산하지 않는다 (0%로 처리하지 않음)", () => {
        const r = calculateUsDividend({ ...base, withholdingTaxRate: "" });
        expect(r.valid).toBe(false);
        expect(r.missingFields).toEqual(["withholdingTaxRate"]);
    });

    it("100% 이상·음수 세율은 계산하지 않는다", () => {
        expect(calculateUsDividend({ ...base, withholdingTaxRate: "100" }).valid).toBe(false);
        expect(calculateUsDividend({ ...base, withholdingTaxRate: "-5" }).valid).toBe(false);
    });
});

describe("코인 펀딩비 — 포지션 방향별 순현금흐름 (양수=수령, 음수=지급)", () => {
    const base = { positionSize: "10000", fundingCount: "3" };

    it.each([
        ["long", "0.01", -1, -3, "pay"],
        ["long", "-0.01", 1, 3, "receive"],
        ["short", "0.01", 1, 3, "receive"],
        ["short", "-0.01", -1, -3, "pay"],
    ] as const)("%s · 펀딩비율 %s → 1회 %s, 누적 %s, 흐름 %s", (positionType, fundingRate, oneTime, total, flow) => {
        const r = calculateFundingFee({ ...base, fundingRate, positionType });
        expect(r.valid).toBe(true);
        expect(r.netOneTime).toBeCloseTo(oneTime, 9);
        expect(r.netTotal).toBeCloseTo(total, 9);
        expect(r.flow).toBe(flow);
    });

    it.each(["long", "short"] as const)("%s · 펀딩비율 0 → 0 (음수 0 아님), 흐름 없음", (positionType) => {
        const r = calculateFundingFee({ ...base, fundingRate: "0", positionType });
        expect(r.valid).toBe(true);
        expect(Object.is(r.netTotal, 0)).toBe(true);
        expect(Object.is(r.netOneTime, 0)).toBe(true);
        expect(r.flow).toBe("none");
    });

    it("금액 크기는 기존 계산과 같다 (1,000만 원 · 0.01% · 90회 = 90,000원)", () => {
        const r = calculateFundingFee({ positionSize: "10000000", fundingRate: "0.01", fundingCount: "90", positionType: "long" });
        expect(Math.abs(r.netTotal)).toBeCloseTo(90_000, 6);
        expect(Math.abs(r.netOneTime)).toBeCloseTo(1_000, 6);
    });

    it("포지션 규모·횟수가 0 이하이면 계산하지 않는다", () => {
        expect(calculateFundingFee({ positionSize: "0", fundingRate: "0.01", fundingCount: "3", positionType: "long" }).valid).toBe(false);
        expect(calculateFundingFee({ positionSize: "10000", fundingRate: "0.01", fundingCount: "", positionType: "short" }).valid).toBe(false);
    });
});

describe("복리 — 비정상 숫자 처리", () => {
    it("정상 입력 결과는 기존과 같다 (100만, 월 10만, 10%, 10년)", () => {
        const r = calculateCompoundInterest({ initial: "1000000", monthly: "100000", rate: "10", years: "10" });
        expect(r.valid).toBe(true);
        expect(r.overflow).toBe(false);
        expect(Math.round(r.total)).toBe(23_191_539);
        expect(r.principal).toBe(13_000_000);
    });

    it("0% 수익률은 원금 합계와 같다", () => {
        const r = calculateCompoundInterest({ initial: "1000000", monthly: "100000", rate: "0", years: "10" });
        expect(r.total).toBe(13_000_000);
        expect(r.profit).toBe(0);
        expect(r.overflow).toBe(false);
    });

    it("페이지 예시 조건 (500만, 월 30만, 8%, 20년) 결과를 유지한다", () => {
        const r = calculateCompoundInterest({ initial: "5000000", monthly: "300000", rate: "8", years: "20" });
        expect(Math.round(r.total)).toBe(201_340_139);
    });

    it("계산 범위를 넘으면 overflow 로 표시하고 Infinity 를 결과로 내보내지 않는다", () => {
        const r = calculateCompoundInterest({ initial: "1000000", monthly: "100000", rate: "1000", years: "100" });
        expect(r.valid).toBe(true);
        expect(r.overflow).toBe(true);
        expect(r.principal).toBe(121_000_000);
    });

    it("원금과 월 투자금이 모두 0이면 수익률이 커도 0 (NaN 아님)", () => {
        const r = calculateCompoundInterest({ initial: "0", monthly: "0", rate: "1000", years: "100" });
        expect(r.overflow).toBe(false);
        expect(r.total).toBe(0);
        expect(r.profit).toBe(0);
    });
});
