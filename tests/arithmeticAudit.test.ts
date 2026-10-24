import { describe, expect, it } from "vitest";
import { uiHarness, visibleCopy } from "./uiHarness";
import PositionSizeCalculator from "@/components/calculator/PositionSizeCalculator";
import SorrCalculator from "@/components/calculator/SorrCalculator";
import { calculateFundingFee } from "@/lib/fundingFee";
import { calculateUsDividend } from "@/lib/usDividend";

type Shown = { label: string; value: string };
const shown = (h: ReturnType<typeof uiHarness>): Shown[] =>
  h.nodes()
    .filter((n) => typeof n.type === "function" && ["ResultHighlight", "ResultDetail"].includes((n.type as { name: string }).name))
    .map((n) => ({ label: String(n.props.label), value: String(n.props.value) }));
const valueOf = (h: ReturnType<typeof uiHarness>, label: string) => shown(h).find((x) => x.label === label)?.value;

function positionSize(capital: string, risk: string, entry: string, stop: string, usd = false) {
  const h = uiHarness(PositionSizeCalculator);
  if (usd) (h.props("CurrencyToggle") as { onChange: (v: string) => void }).onChange("USD");
  h.change("totalCapital", capital);
  h.change("riskPercent", risk);
  h.change("entryPrice", entry);
  h.change("stopLossPrice", stop);
  return h;
}

describe("포지션 사이즈 — 몫이 정확히 정수인 경계에서 수량이 빠지지 않는다", () => {
  it("자본 100달러·리스크 1%·진입 10.3·손절 10.2 → 10주, 103달러", () => {
    const h = positionSize("100", "1", "10.3", "10.2", true);
    expect(valueOf(h, "권장 매수 수량")).toBe("10");
    expect(valueOf(h, "권장 매수 금액 (포지션 크기)")).toBe("103");
  });

  it("자본 100만원·리스크 1%·진입 1.3·손절 1.2 → 100,000주", () => {
    const h = positionSize("1000000", "1", "1.3", "1.2");
    expect(valueOf(h, "권장 매수 수량")).toBe("100,000");
    expect(valueOf(h, "권장 매수 금액 (포지션 크기)")).toBe("130,000");
  });

  it("자본 31,880원·리스크 7.5%·진입 552·손절 551.9 → 23,910주", () => {
    expect(valueOf(positionSize("31880", "7.5", "552", "551.9"), "권장 매수 수량")).toBe("23,910");
  });

  it("자본 초과 안내의 최대 매수 가능 수량도 정확히 내림한다 (0.3 ÷ 0.1 = 3주)", () => {
    const h = positionSize("0.3", "100", "0.1", "0.05", true);
    expect(valueOf(h, "권장 매수 수량")).toBe("6");
    expect(visibleCopy(h.html()).replace(/\s+/g, " ")).toContain("최대 수량은 3주");
  });

  it("정상 대표값은 기존과 같다 (1,000만원·2%·10,000·9,500 → 400주)", () => {
    const h = positionSize("10000000", "2", "10000", "9500");
    expect(valueOf(h, "권장 매수 수량")).toBe("400");
    expect(valueOf(h, "권장 매수 금액 (포지션 크기)")).toBe("4,000,000");
    expect(valueOf(h, "총 자본 대비 비중")).toBe("40.0");
  });

  it("허용 손실이 1주 손실보다 작으면 0주 안내를 유지한다", () => {
    const h = positionSize("100", "1", "1000", "1");
    expect(valueOf(h, "권장 매수 수량")).toBe("0");
    expect(visibleCopy(h.html())).toContain("매수할 수 있는 수량이 없습니다");
  });
});

describe("빈칸을 0으로 계산하지 않는다", () => {
  it("펀딩비율 빈칸은 계산하지 않고, 0은 직접 입력하면 0으로 계산한다", () => {
    const base = { positionSize: "10000", fundingCount: "3", positionType: "long" as const };
    expect(calculateFundingFee({ ...base, fundingRate: "" }).valid).toBe(false);
    expect(calculateFundingFee({ ...base, fundingRate: "  " }).valid).toBe(false);
    const zero = calculateFundingFee({ ...base, fundingRate: "0" });
    expect(zero.valid).toBe(true);
    expect(zero.netTotal).toBe(0);
  });

  it("미국 배당의 주당 배당금 빈칸은 계산하지 않고, 0은 무배당으로 계산한다", () => {
    const base = { shares: "100", buyPriceUsd: "50", exchangeRate: "1350", withholdingTaxRate: "15" };
    const blank = calculateUsDividend({ ...base, annualDividendPerShareUsd: "" });
    expect(blank.valid).toBe(false);
    expect(blank.missingFields).toEqual(["annualDividendPerShareUsd"]);
    const zero = calculateUsDividend({ ...base, annualDividendPerShareUsd: "0" });
    expect(zero.valid).toBe(true);
    expect(zero.monthlyNetDividendKrw).toBe(0);
  });

  it("순서 위험 계산기는 월 생활비·물가상승률 빈칸이면 결과 대신 입력 안내를 보인다", () => {
    for (const blank of ["sorr-withdraw", "sorr-inflation"]) {
      const h = uiHarness(SorrCalculator);
      const values: Record<string, string> = { "sorr-assets": "1000000000", "sorr-withdraw": "3000000", "sorr-inflation": "2", "sorr-returns": "5, 5" };
      for (const [id, v] of Object.entries(values)) if (id !== blank) h.change(id, v);
      expect(shown(h)).toEqual([]);
      expect(visibleCopy(h.html())).toContain("0이 맞다면 0을 직접 입력하세요");
    }
  });

  it("순서 위험 계산기의 0 입력과 정상 계산은 기존과 같다", () => {
    const h = uiHarness(SorrCalculator);
    h.change("sorr-assets", "1000000000");
    h.change("sorr-withdraw", "0");
    h.change("sorr-inflation", "0");
    h.change("sorr-returns", "10, 10");
    expect(valueOf(h, "입력 순서 최종 자산")).toBe("1,210,000,000");
    const bad = uiHarness(SorrCalculator);
    bad.change("sorr-assets", "1000000000");
    bad.change("sorr-withdraw", "3000000");
    bad.change("sorr-inflation", "2");
    bad.change("sorr-returns", "5");
    expect(visibleCopy(bad.html())).toContain("수익률은 -100%보다 큰 숫자 2개 이상이어야 합니다.");
  });
});
