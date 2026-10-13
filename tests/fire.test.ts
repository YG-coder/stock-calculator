import {describe,expect,it} from "vitest"; import {buildFireInput,fireCurrentInputKey,fireIsRecalculating,fireMissingMessage,fireRequestKey,fireResultState,fireRetirementBand,fireSuccessRate,formatFirePlanPeriod,parseFireFields,type FireValues} from "@/lib/fire"; import {FALLBACK_MAX_PATHS} from "@/lib/montecarlo/worker-client"; import {runSimulation} from "@/lib/montecarlo"; import {buildGrid} from "@/lib/montecarlo/engine"; import {validateInput} from "@/lib/montecarlo/validate";
const base:FireValues={seed:1,paths:100,currentAge:40,retirementAge:50,planToAge:60,currentAssets:0,monthlyContribution:1_000_000,monthlyExpenses:500_000,expectedReturnPercent:0,volatilityPercent:0,inflationPercent:0};
describe("FIRE 계산기",()=>{it("적립과 인출 구간을 연결한다",()=>{const input=buildFireInput(base);expect(input.cashFlow.phases).toHaveLength(2);expect(input.months).toBe(240)});it("결정론에서 잔액이 남으면 성공 100%",()=>{const r=runSimulation(buildFireInput(base));expect(r.terminal.p50).toBe(60_000_000);expect(fireSuccessRate(r)).toBe(1)});it("과도한 생활비는 소진으로 판정",()=>{const r=runSimulation(buildFireInput({...base,monthlyExpenses:2_000_000}));expect(fireSuccessRate(r)).toBe(0);expect(r.depletion?.rate).toBe(1)})});

const blankFields = { seed: "", paths: "10000", currentAge: "", retirementAge: "", planToAge: "", currentAssets: "", monthlyContribution: "", monthlyExpenses: "", expectedReturn: "", volatility: "", inflation: "" };
const filledFields = { ...blankFields, currentAge: "35", retirementAge: "55", planToAge: "85", currentAssets: "100000000", monthlyContribution: "2000000", monthlyExpenses: "3000000", expectedReturn: "7", volatility: "15", inflation: "2" };

describe("FIRE 입력 검증 (회귀: 빈칸·음수)", () => {
  it("나이만 입력하고 나머지를 비우면 계산하지 않고 빈 항목을 돌려준다", () => {
    const r = parseFireFields({ ...blankFields, currentAge: "35", retirementAge: "55", planToAge: "85" });
    expect(r.ok).toBe(false);
    expect(r.values).toBeNull();
    expect(r.missingFields).toEqual(["currentAssets", "monthlyContribution", "monthlyExpenses", "expectedReturn", "volatility", "inflation"]);
    expect(fireMissingMessage(r.missingFields)).toContain("현재 투자자산");
  });
  it("명시적으로 입력한 0은 빈칸과 달리 정상 입력으로 계산한다", () => {
    const r = parseFireFields({ ...filledFields, currentAssets: "0", monthlyContribution: "0", monthlyExpenses: "0", expectedReturn: "0", volatility: "0", inflation: "0" });
    expect(r.ok).toBe(true);
    expect(r.values).toMatchObject({ currentAssets: 0, monthlyContribution: 0, monthlyExpenses: 0, expectedReturnPercent: 0 });
  });
  it("공백만 있는 칸도 빈칸으로 본다", () => {
    expect(parseFireFields({ ...filledFields, inflation: "  " }).missingFields).toEqual(["inflation"]);
  });
  it("월 생활비 음수는 입금으로 계산하지 않고 거부한다", () => {
    const r = parseFireFields({ ...filledFields, monthlyExpenses: "-2000000" });
    expect(r.ok).toBe(false);
    expect(r.errors.join(" ")).toContain("월 생활비는 0원 이상");
  });
  it("월 투자금·현재 자산 음수도 거부한다", () => {
    expect(parseFireFields({ ...filledFields, monthlyContribution: "-1" }).errors.join(" ")).toContain("월 투자금은 0원 이상");
    expect(parseFireFields({ ...filledFields, currentAssets: "-1" }).errors.join(" ")).toContain("현재 투자자산은 0원 이상");
  });
  it("나이 순서 오류를 안내한다", () => {
    expect(parseFireFields({ ...filledFields, retirementAge: "30" }).errors).toContain("은퇴 나이는 현재 나이보다 커야 합니다.");
    expect(parseFireFields({ ...filledFields, planToAge: "50" }).errors).toContain("계획 종료 나이는 은퇴 나이보다 커야 합니다.");
  });
  it("결과 재현 번호는 선택 입력이라 비워도 계산한다", () => {
    const r = parseFireFields(filledFields);
    expect(r.ok).toBe(true);
    expect(r.values?.seed).toBe(0);
  });
  it("정상 입력은 기존 엔진 입력 변환과 같다", () => {
    const r = parseFireFields(filledFields);
    expect(r.ok && buildFireInput(r.values).cashFlow.phases?.[1].monthlyAmount).toBe(-3_000_000);
  });
});

describe("FIRE 소수 나이의 은퇴 시점 자산 (회귀)", () => {
  const v: FireValues = { seed: 0, paths: 10, currentAge: 35.5, retirementAge: 55, planToAge: 85, currentAssets: 10_000_000, monthlyContribution: 0, monthlyExpenses: 0, expectedReturnPercent: 0, volatilityPercent: 0, inflationPercent: 0 };
  it("35.5세→55세 은퇴 시점(234개월)을 결과에 기록하고 실제 값을 돌려준다", () => {
    const r = runSimulation(buildFireInput(v));
    const band = fireRetirementBand(r);
    expect(band?.month).toBe(234);
    expect(band?.p50).toBe(10_000_000);
    expect(band?.p10).toBe(10_000_000);
  });
  it("연 단위 그리드는 그대로 유지하고 은퇴 시점만 추가한다", () => {
    const r = runSimulation(buildFireInput(v));
    const months = r.bands.map((b) => b.month);
    expect(months).toContain(228);
    expect(months).toContain(240);
    expect(months[months.length - 1]).toBe(594);
    expect(months).toEqual([...months].sort((a, b) => a - b));
    expect(new Set(months).size).toBe(months.length);
  });
  it("정수 나이는 기존과 같은 연 단위 그리드다", () => {
    const r = runSimulation(buildFireInput(base));
    expect(r.bands.map((b) => b.month)).toEqual(Array.from({ length: 21 }, (_, i) => i * 12));
    expect(fireRetirementBand(r)?.p50).toBe(120_000_000);
  });
  it("buildGrid는 recordMonths 없이는 기존 결과와 같다", () => {
    expect(Array.from(buildGrid(30))).toEqual([0, 12, 24, 30]);
    expect(Array.from(buildGrid(30, [18, 12, 0, 30]))).toEqual([0, 12, 18, 24, 30]);
  });
  it("범위를 벗어난 기록 시점은 엔진이 거부한다", () => {
    const input = { ...buildFireInput(v), recordMonths: [9999] };
    expect(validateInput(input).some((i) => i.field === "recordMonths")).toBe(true);
    expect(validateInput({ ...input, recordMonths: [1.5] }).some((i) => i.field === "recordMonths")).toBe(true);
  });
});

describe("FIRE 계획 기간 표시 (회귀: 49.5년이 50년으로 반올림)", () => {
  it("594개월은 49년 6개월, 600개월은 50년", () => {
    expect(formatFirePlanPeriod(594)).toBe("49년 6개월");
    expect(formatFirePlanPeriod(600)).toBe("50년");
  });
  it("1년 미만·정확한 연 단위·11개월 나머지", () => {
    expect(formatFirePlanPeriod(6)).toBe("6개월");
    expect(formatFirePlanPeriod(12)).toBe("1년");
    expect(formatFirePlanPeriod(611)).toBe("50년 11개월");
  });
  it("35.5세→85세 실행 결과의 기간은 49년 6개월", () => {
    const r = runSimulation(buildFireInput({ ...base, paths: 10, currentAge: 35.5, retirementAge: 55, planToAge: 85 }));
    expect(r.input.months).toBe(594);
    expect(formatFirePlanPeriod(r.input.months)).toBe("49년 6개월");
  });
});

describe("FIRE 이전 결과 구분 (회귀: 입력 변경 후 이전 결과가 현재 결과처럼 보임)", () => {
  const runWith = (fields: typeof filledFields) => {
    const parsed = parseFireFields(fields);
    if (!parsed.ok) throw new Error("invalid fixture");
    // Worker 의 postMessage 를 거친 결과처럼 구조 복제한다.
    return structuredClone(runSimulation(buildFireInput({ ...parsed.values, paths: 10, volatilityPercent: 0 })));
  };
  const fieldsA = { ...filledFields, paths: "10", volatility: "0" };
  const fieldsB = { ...fieldsA, monthlyExpenses: "3500000" };

  it("계산 직후에는 현재 입력의 결과다", () => {
    expect(fireResultState(runWith(fieldsA), fieldsA)).toBe("current");
  });
  it("입력을 바꾸면 이전 결과로 판정하고, 원래 값으로 되돌리면 다시 현재 결과다", () => {
    const r = runWith(fieldsA);
    expect(fireResultState(r, fieldsB)).toBe("stale");
    expect(fireResultState(r, { ...fieldsA, retirementAge: "56" })).toBe("stale");
    expect(fireResultState(r, { ...fieldsA, seed: "7" })).toBe("stale");
    expect(fireResultState(r, { ...fieldsA })).toBe("current");
  });
  it("필수 입력을 지우거나 음수로 바꾸면 이전 결과로 판정한다", () => {
    const r = runWith(fieldsA);
    expect(fireResultState(r, { ...fieldsA, currentAssets: "" })).toBe("stale");
    expect(fireResultState(r, { ...fieldsA, monthlyExpenses: "-3000000" })).toBe("stale");
  });
  it("계산 중 입력을 바꾼 뒤 늦게 도착한 결과는 현재 결과로 보지 않는다", () => {
    const lateResultForA = runWith(fieldsA); // A 로 실행 요청 → 계산 중 B 로 변경 → A 의 결과 도착
    expect(fireResultState(lateResultForA, fieldsB)).toBe("stale");
    expect(fireResultState(runWith(fieldsB), fieldsB)).toBe("current"); // B 로 재계산 완료
  });
  it("결과의 기간은 수정 중인 입력이 아니라 실행 당시 입력을 따른다", () => {
    const r = runWith({ ...fieldsA, currentAge: "35.5" });
    const editing = { ...fieldsA, currentAge: "35" };
    expect(fireResultState(r, editing)).toBe("stale");
    expect(formatFirePlanPeriod(r.input.months)).toBe("49년 6개월");
  });
  it("메인 스레드 폴백이 경로 수를 낮춰 실행한 결과도 같은 입력이면 현재 결과다", () => {
    const fields = { ...fieldsA, paths: "10000" };
    const parsed = parseFireFields(fields);
    if (!parsed.ok) throw new Error("invalid fixture");
    const capped = runSimulation({ ...buildFireInput({ ...parsed.values, volatilityPercent: 0 }), paths: 2_000 });
    expect(fireResultState(capped, fields, 2_000)).toBe("current");
    expect(fireResultState(capped, fields)).toBe("stale");
  });
});

describe("recordMonths 는 기존 계산 결과를 바꾸지 않는다 (문서 §3 근거)", () => {
  it("변동성 있는 같은 시드에서 연 단위 밴드·최종 분포·소진율이 동일하다", () => {
    const withRecord = buildFireInput({ seed: 42, paths: 500, currentAge: 35.5, retirementAge: 55, planToAge: 85, currentAssets: 100_000_000, monthlyContribution: 1_000_000, monthlyExpenses: 4_000_000, expectedReturnPercent: 6, volatilityPercent: 15, inflationPercent: 2 });
    const { recordMonths, ...withoutRecord } = withRecord;
    expect(recordMonths).toEqual([234]);
    const a = runSimulation(withRecord);
    const b = runSimulation(withoutRecord);
    expect(a.bands.filter((band) => band.month !== 234)).toEqual(b.bands);
    expect(a.terminal).toEqual(b.terminal);
    expect(a.depletion?.rate).toBe(b.depletion?.rate);
    expect(a.depletion?.rate).toBeGreaterThan(0);
    expect(b.bands.some((band) => band.month === 234)).toBe(false);
  });
});

describe("FIRE 재계산 중 안내 판정 (회귀: Worker 미지원 환경의 경로 수 상한 불일치)", () => {
  // Worker 미지원(main-thread 폴백) · 요청 경로 10,000개. 폴백은 2,000경로로 낮춰 실행한다.
  const fieldsA = { ...filledFields, paths: "10000", volatility: "0" };
  const fieldsB = { ...fieldsA, monthlyExpenses: "3500000" };
  const fieldsC = { ...fieldsA, monthlyExpenses: "4000000" };
  const cap = FALLBACK_MAX_PATHS;
  const cappedResult = (fields: typeof fieldsA) => {
    const parsed = parseFireFields(fields);
    if (!parsed.ok) throw new Error("invalid fixture");
    return runSimulation({ ...buildFireInput(parsed.values), paths: cap });
  };

  it("전제: 요청 키(10,000경로)와 상한 적용 키(2,000경로)는 다르다 — 섞어 비교하면 안 된다", () => {
    expect(cap).toBe(2_000);
    expect(fireRequestKey(fieldsB)).not.toBe(fireCurrentInputKey(fieldsB, cap));
  });
  it("입력 변경 후 재계산 요청 → 계산 중에는 '다시 계산하는 중' 안내 대상이다", () => {
    const previous = cappedResult(fieldsA);                 // A 로 계산 완료(2,000경로)
    expect(fireResultState(previous, fieldsA, cap)).toBe("current");
    const submittedKey = fireRequestKey(fieldsB);             // B 로 바꾸고 실행 요청
    expect(fireResultState(previous, fieldsB, cap)).toBe("stale");
    expect(fireIsRecalculating("running", submittedKey, fieldsB)).toBe(true);
  });
  it("실행 요청 후 입력을 다시 바꾸면 재계산 중 안내로 표시하지 않는다", () => {
    const submittedKey = fireRequestKey(fieldsB);
    expect(fireIsRecalculating("running", submittedKey, fieldsC)).toBe(false);
    expect(fireIsRecalculating("running", submittedKey, { ...fieldsB, paths: "20000" })).toBe(false);
    expect(fireIsRecalculating("running", submittedKey, { ...fieldsB, monthlyExpenses: "" })).toBe(false);
    expect(fireIsRecalculating("running", submittedKey, { ...fieldsB, monthlyExpenses: "-1" })).toBe(false);
  });
  it("계산이 끝나거나 요청이 없으면 재계산 중이 아니다", () => {
    const submittedKey = fireRequestKey(fieldsB);
    for (const status of ["idle", "done", "cancelled", "error"]) expect(fireIsRecalculating(status, submittedKey, fieldsB)).toBe(false);
    expect(fireIsRecalculating("running", null, fieldsB)).toBe(false);
  });
  it("완료된 결과 판정은 경로 수 상한을 계속 반영한다", () => {
    const done = cappedResult(fieldsB);
    expect(fireResultState(done, fieldsB, cap)).toBe("current");
    expect(fireResultState(done, fieldsB)).toBe("stale");
    expect(fireResultState(done, fieldsC, cap)).toBe("stale");
  });
  it("Worker 환경(상한 없음)에서도 같은 요청 기준으로 판정한다", () => {
    expect(fireIsRecalculating("running", fireRequestKey(fieldsB), fieldsB)).toBe(true);
    expect(fireIsRecalculating("running", fireRequestKey(fieldsB), fieldsA)).toBe(false);
  });
});
