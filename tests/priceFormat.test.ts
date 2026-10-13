import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/number";

describe("코인 가격 표시 정밀도 (회귀: 저가 코인이 0으로 표시)", () => {
  it("청산가 근사식 결과 0.000905 를 0 이 아니라 그대로 표시한다", () => {
    // CryptoLiquidationCalculator 근사식(변경 없음): 롱 청산가 = 진입가 × (1 − 1/레버리지 + 유지증거금률)
    const liquidation = 0.001 * (1 - 1 / 10 + 0.005);
    expect(formatPrice(liquidation)).toBe("0.000905");
    expect(formatPrice(0.001 * (1 - 1 / 10))).toBe("0.0009");
  });
  it("평균 단가 0.0015 를 표시한다", () => {
    expect(formatPrice((0.001 * 100 + 0.002 * 100) / 200)).toBe("0.0015");
  });
  it("1 미만은 유효숫자 4자리", () => {
    expect(formatPrice(0.123456)).toBe("0.1235");
    expect(formatPrice(0.00000012345)).toBe("0.0000001235");
  });
  it("1 이상은 기존처럼 소수 둘째 자리까지", () => {
    expect(formatPrice(70_000)).toBe("70,000");
    expect(formatPrice(63_315.5)).toBe("63,315.5");
    expect(formatPrice(1234.5678)).toBe("1,234.57");
    expect(formatPrice(1)).toBe("1");
  });
  it("0·비유한값은 기존과 같이 0", () => {
    expect(formatPrice(0)).toBe("0");
    expect(formatPrice(Number.NaN)).toBe("0");
  });
});
