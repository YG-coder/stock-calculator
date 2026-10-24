import { describe, expect, it } from "vitest";
import { toNumber, type Exact } from "@/lib/exactDecimal";
import { calculateUsDividend } from "@/lib/usDividend";
import { calculateStockTransactionTax } from "@/lib/stockTransactionTax";

// 기존 Number API의 호환 변환 toNumber: 정확한 유리수에 가장 가까운 Number(IEEE 754 binary64, 동점은 짝수 쪽).
// 기대값은 독립 기준(Python Fraction의 float 변환 + 이웃 Number와의 정확한 거리 비교 + 십진 문자열 dtoa)으로
// 계산해 64비트 비트열로 고정했다(−0과 +0 구분, 허용오차 없음). 화면 표시 반올림(halfExpand 등)과는 다른 규칙이다.
// 표현 범위보다 작은 값(|x| ≤ 2^-1075)의 0·−0, 큰 값(|x| ≥ 2^1024 − 2^970)의 ±Infinity는 정상 결과다.

const bits = (x: number) => {
  const v = new DataView(new ArrayBuffer(8));
  v.setFloat64(0, x);
  return v.getBigUint64(0).toString(16).padStart(16, "0");
};
const B = (v: number | string) => BigInt(v);
const T = (k: number) => BigInt(10) ** BigInt(k);
const P = (k: number) => BigInt(2) ** BigInt(k);
const TINY = "0." + "0".repeat(60) + "1"; // = 1e-61

// [설명, 분자, 분모, 기대 비트열] — 분자·분모는 기약하지 않은 표현 그대로 넣는다.
const CASES: [string, bigint, bigint, string][] = [
  ["지적 값 1e-61", B(1), T(61), "3344919d5556eb52"], // 1e-61
  ["−1e-61", -B(1), T(61), "b344919d5556eb52"], // -1e-61
  ["1e-100", B(1), T(100), "2b2bff2ee48e0530"], // 1e-100
  ["1e-300", B(1), T(300), "01a56e1fc2f8f359"], // 1e-300
  ["1e-310 서브노멀", B(1), T(310), "000012688b70e62b"], // 1e-310
  ["5e-324 십진(→ 최소 서브노멀)", B(5), T(324), "0000000000000001"], // 5e-324
  ["1/(12·10^61) 월 환산", B(1), B(12) * T(61), "330b6cd1c71e8f18"], // 8.333333333333334e-63
  ["정확한 0", B(0), B(1), "0000000000000000"], // 0.0
  ["−1e-400 → −0", -B(1), T(400), "8000000000000000"], // -0.0
  ["1e-400 → +0(표현 범위 밑, 정상)", B(1), T(400), "0000000000000000"], // 0.0
  ["최소 서브노멀 2^-1074", B(1), P(1074), "0000000000000001"], // 5e-324
  ["−2^-1074", -B(1), P(1074), "8000000000000001"], // -5e-324
  ["2^-1075 동점 → 0(짝수)", B(1), P(1075), "0000000000000000"], // 0.0
  ["−2^-1075 동점 → −0", -B(1), P(1075), "8000000000000000"], // -0.0
  ["2^-1075 + 2^-1200 → 2^-1074", P(125) + B(1), P(1200), "0000000000000001"], // 5e-324
  ["2^-1075 − 2^-1200 → 0", P(125) - B(1), P(1200), "0000000000000000"], // 0.0
  ["3·2^-1075 동점 → 2·2^-1074(짝수)", B(3), P(1075), "0000000000000002"], // 1e-323
  ["5·2^-1075 동점 → 2·2^-1074(짝수)", B(5), P(1075), "0000000000000002"], // 1e-323
  ["최대 서브노멀 (2^52−1)·2^-1074", P(52) - B(1), P(1074), "000fffffffffffff"], // 2.225073858507201e-308
  ["(2^52−½)·2^-1074 동점 → 최소 정상수", P(53) - B(1), P(1075), "0010000000000000"], // 2.2250738585072014e-308
  ["최소 정상수 2^-1022", B(1), P(1022), "0010000000000000"], // 2.2250738585072014e-308
  ["2.2250738585072014e-308 십진", B("22250738585072014"), T(324), "0010000000000000"], // 2.2250738585072014e-308
  ["4.9e-324 십진", B(49), T(325), "0000000000000001"], // 5e-324
  ["2.4e-324 십진 → 0", B(24), T(325), "0000000000000000"], // 0.0
  ["1e-323 십진", B(1), T(323), "0000000000000002"], // 1e-323
  ["1 + 2^-53 동점 → 1", P(53) + B(1), P(53), "3ff0000000000000"], // 1.0
  ["1 + 3·2^-53 동점 → 1 + 2^-51(짝수)", P(53) + B(3), P(53), "3ff0000000000002"], // 1.0000000000000004
  ["1 + 2^-53 + 2^-200 → 1 + 2^-52", P(200) + P(147) + B(1), P(200), "3ff0000000000001"], // 1.0000000000000002
  ["2^53 + 1 동점 → 2^53", P(53) + B(1), B(1), "4340000000000000"], // 9007199254740992.0
  ["2^53 + 3 동점 → 2^53 + 4", P(53) + B(3), B(1), "4340000000000002"], // 9007199254740996.0
  ["−(2^53 + 1) → −2^53", -(P(53) + B(1)), B(1), "c340000000000000"], // -9007199254740992.0
  ["0.1", B(1), B(10), "3fb999999999999a"], // 0.1
  ["0.3", B(3), B(10), "3fd3333333333333"], // 0.3
  ["1/3", B(1), B(3), "3fd5555555555555"], // 0.3333333333333333
  ["−2/3", -B(2), B(3), "bfe5555555555555"], // -0.6666666666666666
  ["9007199254740993 십진", B("9007199254740993"), B(1), "4340000000000000"], // 9007199254740992.0
  ["최대 유한값 (2^53−1)·2^971", (P(53) - B(1)) * P(971), B(1), "7fefffffffffffff"], // 1.7976931348623157e+308
  ["Infinity 경계 바로 아래 → 최대 유한값", P(1024) - P(970) - P(900), B(1), "7fefffffffffffff"], // 1.7976931348623157e+308
  ["2^1024 − 2^970 동점 → Infinity", P(1024) - P(970), B(1), "7ff0000000000000"], // inf
  ["−(2^1024 − 2^970) → −Infinity", -(P(1024) - P(970)), B(1), "fff0000000000000"], // -inf
  ["1e308", T(308), B(1), "7fe1ccf385ebc8a0"], // 1e+308
  ["1e309 → Infinity(표현 범위 밖, 정상)", T(309), B(1), "7ff0000000000000"], // inf
  ["1.7976931348623157e308 십진", B("17976931348623157") * T(292), B(1), "7fefffffffffffff"], // 1.7976931348623157e+308
  ["1.7976931348623158e308 십진(경계 아래)", B("17976931348623158") * T(292), B(1), "7fefffffffffffff"], // 1.7976931348623157e+308
  ["1.7976931348623159e308 십진 → Infinity", B("17976931348623159") * T(292), B(1), "7ff0000000000000"], // inf
  ["211,507,872.905", B(211507872905), B(1000), "41a936b541cf5c29"], // 211507872.905
  ["129,161,474.985", B(129161474985), B(1000), "419ecb640bf0a3d7"], // 129161474.985
  ["월 세후 12,323,880,111·1,267.83·0.9781·1,133.55/12", B(12323880111) * B(126783) * B(9781) * B(113355), B(12) * B(100) * B(10000) * B(100), "431483d69c27ef71"], // 1443614325079004.2
  ["998,001", B(998001), B(1), "412e74e200000000"], // 998001.0
  ["합산 세율 0.0005 + 0.0015", B(5) * B(10000) + B(15) * B(10000), B(10000) * B(10000), "3f60624dd2f1a9fc"], // 0.002
  ["−6.955", -B(6955), B(1000), "c01bd1eb851eb852"], // -6.955
  ["99,999,999,999,999,999,999", T(20) - B(1), B(1), "4415af1d78b58c40"], // 1e+20
  ["3·10^400 / 10^400 = 3", B(3) * T(400), T(400), "4008000000000000"], // 3.0
  ["(2^5000+1) / 2^5000 → 1", P(5000) + B(1), P(5000), "3ff0000000000000"], // 1.0
  ["10^400 / 10^700 = 1e-300", T(400), T(700), "01a56e1fc2f8f359"], // 1e-300
  ["1 / 10^310 서브노멀", B(1), T(310), "000012688b70e62b"], // 1e-310
  ["7·10^700 / 3·10^700 = 7/3", B(7) * T(700), B(3) * T(700), "4002aaaaaaaaaaab"], // 2.3333333333333335
  ["−5·10^500 / 4·10^500 = −1.25", -B(5) * T(500), B(4) * T(500), "bff4000000000000"], // -1.25
  ["10^320 / 10^10 → Infinity(정상)", T(320), T(10), "7ff0000000000000"], // inf
  ["6/4 기약 아님 = 1.5", B(6), B(4), "3ff8000000000000"], // 1.5
  ["10^939 / 10^1000 = 1e-61", T(939), T(1000), "3344919d5556eb52"], // 1e-61
];

describe("toNumber — 정확한 유리수에 가장 가까운 Number", () => {
  it.each(CASES)("%s", (_label, n, d, expected) => {
    const x: Exact = { n, d };
    expect(bits(toNumber(x))).toBe(expected);
  });
});

describe("기존 Number API — 표현 가능한 작은 값을 0으로 만들지 않는다", () => {
  it("증권거래세: 1e-61원 코스피의 세금 차감 후 금액은 1e-61(세액 0원은 그대로)", () => {
    const r = calculateStockTransactionTax(1e-61, "kospi");
    expect(r).toMatchObject({ transactionTax: 0, ruralTax: 0, totalTax: 0 });
    expect(bits(r.netProceeds)).toBe("3344919d5556eb52"); // 1e-61
    expect(bits(r.totalRate)).toBe("3f60624dd2f1a9fc"); // 0.002
    expect(bits(calculateStockTransactionTax(5e-324, "kosdaq").netProceeds)).toBe("0000000000000001");
    expect(bits(calculateStockTransactionTax(1e-300, "konex").netProceeds)).toBe("01a56e1fc2f8f359");
  });
  it("미국주식 배당: 주당 배당금 0.+0×60+1 — 연간 1e-61, 월 1/(12·10^61), 수익률 1e-59", () => {
    const r = calculateUsDividend({ shares: "1", annualDividendPerShareUsd: TINY, buyPriceUsd: "1", exchangeRate: "1", withholdingTaxRate: "0" });
    expect([r.valid, r.missingFields]).toEqual([true, []]);
    const got = Object.fromEntries(Object.entries(r).filter(([, v]) => typeof v === "number").map(([k, v]) => [k, bits(v as number)]));
    expect(got).toEqual({ grossAnnualDividendUsd: "3344919d5556eb52", netAnnualDividendUsd: "3344919d5556eb52", grossAnnualDividendKrw: "3344919d5556eb52", netAnnualDividendKrw: "3344919d5556eb52", monthlyNetDividendKrw: "330b6cd1c71e8f18", grossYield: "33b011c2eaabe7d8", netYield: "33b011c2eaabe7d8", taxAmountUsd: "0000000000000000" });
  });
  it("미국주식 배당: 세율이 있는 작은 값·서브노멀, 표현 범위 밑(1e-400)은 0이고 유효성은 유지", () => {
    const run = (div: string, shares = "1", buy = "1", fx = "1", tax = "0") =>
      calculateUsDividend({ shares, annualDividendPerShareUsd: div, buyPriceUsd: buy, exchangeRate: fx, withholdingTaxRate: tax });
    const pick = (r: ReturnType<typeof run>) =>
      Object.fromEntries(Object.entries(r).filter(([, v]) => typeof v === "number").map(([k, v]) => [k, bits(v as number)]));
    expect(pick(run(TINY, "3", "2", "1350.5", "15"))).toEqual({ grossAnnualDividendUsd: "335eda6c000260fb", netAnnualDividendUsd: "335a39a8999b9f3b", grossAnnualDividendKrw: "3404586857c19193", netAnnualDividendKrw: "34014b257dcaeef0", monthlyNetDividendKrw: "33c70edca7b93e96", grossYield: "33a011c2eaabe7d8", netYield: "339b5164f5577089", taxAmountUsd: "3332830d999b06fd" });
    expect(pick(run("1e-320"))).toEqual({ grossAnnualDividendUsd: "00000000000007e8", netAnnualDividendUsd: "00000000000007e8", grossAnnualDividendKrw: "00000000000007e8", netAnnualDividendKrw: "00000000000007e8", monthlyNetDividendKrw: "00000000000000a9", grossYield: "00000000000316a2", netYield: "00000000000316a2", taxAmountUsd: "0000000000000000" });
    const under = run("1e-400");
    expect(under.valid).toBe(true);
    expect(pick(under)).toEqual({ grossAnnualDividendUsd: "0000000000000000", netAnnualDividendUsd: "0000000000000000", grossAnnualDividendKrw: "0000000000000000", netAnnualDividendKrw: "0000000000000000", monthlyNetDividendKrw: "0000000000000000", grossYield: "0000000000000000", netYield: "0000000000000000", taxAmountUsd: "0000000000000000" });
  });
});
