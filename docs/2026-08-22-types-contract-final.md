# 타입 계약 최종본 — `types.ts` 그대로 옮겨 쓰는 버전

- **작성일**: 2026-08-22
- **상태**: 설계 확정. 코드 0줄.
- **역할**: 지금까지 3개 문서에 흩어져 있던 타입을 **하나로 합치고 이름을 고정**한다. 구현은 이 블록을 `src/lib/montecarlo/types.ts`에 옮기는 것으로 시작한다.

## 이름 고정

논의 과정에서 `MonteCarloInput` / `SimulationInput` 두 이름이 오갔다. **`SimulationInput` / `SimulationResult`로 확정**한다(엔진 계약 문서 기준). 파일·훅 이름은 `montecarlo`를 쓰되 타입은 `Simulation*`이다 — 엔진이 몬테카를로 외의 결정론 실행(σ=0 회귀 테스트)도 담당하기 때문이다.

Worker 래퍼는 **둘 다 둔다.** 역할이 다르다.

| 파일 | 책임 | React 의존 |
|---|---|---|
| `lib/montecarlo/worker-client.ts` | Worker 수명주기, 메시지 프로토콜, 취소 | 없음 |
| `hooks/useMonteCarlo.ts` | 디바운스, 상태, 리렌더 | 있음 |

클라이언트만 따로 테스트할 수 있게 하려는 분리다.

---

## 전체 타입

```ts
// src/lib/montecarlo/types.ts
// 계약 정의만. 런타임 코드 없음.

export const ENGINE_VERSION = "1.0.0";

/* ============================================================
   입력
   ============================================================ */

export type Basis = "nominal" | "real";

export interface SimulationInput {
  /** 재현성. 결과에 그대로 실려 나간다. */
  seed: number;
  /** 경로 수. 기본 10_000, 상한 50_000. 모바일은 5_000. */
  paths: number;
  /** 총 기간(개월). 상한 720(60년). */
  months: number;
  /** 초기 자산 (원). */
  initialBalance: number;
  cashFlow: CashFlowSpec;
  returns: ReturnSpec;
  /** 연 물가상승률(실수). 0 이면 명목=실질. */
  inflationRate: number;
  /** 결과 보고 기준. 기본 "real". */
  reportBasis: Basis;
  /** 없으면 성공확률·역산을 계산하지 않는다. */
  goal?: GoalSpec;
}

export interface CashFlowSpec {
  /** 월 금액. 양수 = 적립, 음수 = 인출. type 필드를 두지 않는다. */
  monthlyAmount: number;
  /** 적용 시점. 기존 복리 계산기의 모호함을 반복하지 않기 위해 필수. */
  timing: "start" | "end";
  /** 매년 물가만큼 증액할지. */
  inflationIndexed: boolean;
  /** 적용 구간. 미지정 시 전체. FIRE 는 두 구간을 이어 붙인다. */
  fromMonth?: number;
  toMonth?: number;
  /** 불규칙 현금흐름(일시금 등). monthIndex → 금액. */
  overrides?: Record<number, number>;
}

export type ReturnSpec =
  | {
      kind: "parametric";
      /** 연 CAGR(기하평균, 명목, 총수익 기준). 산술평균이 아니다. */
      expectedReturn: number;
      /** 연 변동성. 단순수익률 기준. 상한 0.45. */
      volatility: number;
      /** 미지정 시 { type: "student-t", df: 6 }. */
      shock?: ShockSpec;
    }
  | {
      /** 8단계 예약. v1 미구현. */
      kind: "bootstrap";
      datasetId: string;
      blockMonths: number;
    };

export type ShockSpec =
  | { type: "student-t"; df: number }   // df > 2. v1 은 6 고정
  | { type: "normal" };

export interface GoalSpec {
  /** v1 은 "terminal-target" 만 구현. 나머지는 타입만 예약. */
  kind: "terminal-target" | "never-depleted" | "income-target";
  /** terminal-target 의 목표 금액. reportBasis 와 같은 기준으로 해석한다. */
  targetAmount?: number;
  /** 목표 확률(0~1). 주어지면 역산을 수행한다. */
  targetProbability?: number;
}

/* ============================================================
   출력
   ============================================================ */

export interface SimulationResult {
  /** 입력 에코. 화면에 가정을 그대로 붙이기 위해. */
  input: SimulationInput;
  assumptions: ReturnAssumption;

  /** 연 단위 그리드의 백분위 밴드. 팬 차트용. */
  bands: PercentileBand[];
  /** 최종 잔액 분포. */
  terminal: Distribution;

  /** goal 이 있을 때만. */
  goal?: GoalResult;
  /** 인출 시나리오에서만. */
  depletion?: DepletionResult;

  /** 팬 차트에 겹쳐 그릴 대표 경로. */
  samplePaths: SamplePaths;
  /** 선형 역산용 계수. clamped 가 true 면 undefined. */
  affine?: AffineCoefficients;

  meta: RunMeta;
}

export interface Percentiles {
  p5: number; p10: number; p25: number;
  p50: number;
  p75: number; p90: number; p95: number;
}

export interface PercentileBand extends Percentiles {
  month: number;
}

export interface Distribution extends Percentiles {
  min: number;
  max: number;
  /**
   * 참고용. 화면에 표시하지 않는다.
   * Student's t 충격에서 exp 의 기댓값이 발산해 표본 평균이 불안정하다.
   */
  mean: number;
}

export interface GoalResult {
  kind: GoalSpec["kind"];
  /** 입력된 납입액 그대로일 때의 성공확률(0~1). */
  successProbability: number;
  /** targetProbability 가 주어졌을 때만. */
  inversion?: InversionResult;
}

export interface InversionResult {
  /** 목표 확률을 만족하는 최소 월 납입액. */
  requiredMonthlyAmount: number;
  method: "linear-exact" | "bisection";
  /** 검증용. 그 납입액에서 실제로 나온 성공확률. */
  successProbabilityAt: number;
  /**
   * 오름차순 정렬된 경로별 필요 납입액.
   * UI 슬라이더가 이 배열만으로 확률↔납입액을 재계산한다(재시뮬 없음).
   * linear-exact 일 때만 채워진다.
   */
  sortedRequired?: Float64Array;
  /**
   * B_j = 0 이라 납입액과 무관하게 성패가 고정된 경로.
   * 일시금만 있는 시나리오에서 발생한다.
   */
  fixedPaths: { count: number; successes: number };
}

export interface DepletionResult {
  /** 소진 경로 비율(0~1). */
  rate: number;
  /** 연 단위 소진 시점 히스토그램. 인덱스 = 연차. */
  byYear: Int32Array;
  /** 소진된 경로들의 소진 시점(개월) 백분위. */
  percentiles: Percentiles;
}

export interface SamplePaths {
  /** 기록된 월 그리드. 보통 [0, 12, 24, …]. */
  months: Int32Array;
  /** 평탄 배열. values[pathIndex * months.length + i]. */
  values: Float64Array;
  count: number;
}

export interface AffineCoefficients {
  /** 초기 자산이 만기까지 불어난 배수 × 초기 자산. */
  A: Float64Array;
  /** 단위 납입(월 1원)이 만기까지 누적된 값. */
  B: Float64Array;
}

export interface ReturnAssumption {
  kind: ReturnSpec["kind"];
  /** 화면 표기용. "연 7.0% · 변동성 15.0%" */
  label: string;
  /** "Student's t (df 6, |z|≤8 재추출)" */
  shockLabel: string;
  /** 실제 사용된 월 파라미터. 검증·디버깅용. */
  muM: number;
  sigmaM: number;
  /** 프리셋에서 왔을 때만. 사용자가 값을 고치면 지운다. */
  presetId?: string;
  source?: string;
  asOf?: string;
  returnBasis: "total-return";
}

export interface RunMeta {
  engineVersion: string;
  seed: number;
  pathsRun: number;
  elapsedMs: number;
  batches: number;
  /** |z| > 8 로 재추출한 횟수. 절단 영향 모니터링용. */
  truncatedShocks: number;
  /** 잔액 0 클램프 발생 여부. true 면 선형 역산 불가. */
  clamped: boolean;
}

/* ============================================================
   프리셋
   ============================================================ */

export interface PortfolioPreset {
  id: string;
  label: string;
  summary: string;

  /** 엔진이 직접 쓰는 포트폴리오 수준 가정. */
  cagr: number;
  volatility: number;
  returnBasis: "total-return";

  /** 표시용. 계산에 쓰지 않는다. */
  composition: { label: string; weight: number }[];

  /** 하나라도 없으면 프리셋을 만들지 않는다. */
  source: { label: string; url?: string; period: string };
  asOf: string;

  caveat?: string;
}

/* ============================================================
   Worker 프로토콜
   ============================================================ */

export type WorkerRequest =
  | { type: "ping" }
  | { type: "run"; id: string; input: SimulationInput }
  | { type: "cancel"; id: string };

export type WorkerResponse =
  | { type: "pong"; engineVersion: string }
  | { type: "progress"; id: string; completed: number; total: number }
  | { type: "result"; id: string; result: SimulationResult }
  | { type: "cancelled"; id: string }
  | { type: "error"; id: string; message: string };

/* ============================================================
   엔진 진입점
   ============================================================ */

export interface SimulationRunner {
  readonly done: boolean;
  readonly completed: number;
  readonly total: number;
  /** 동기 실행. 이벤트 루프 양보는 호출부(Worker) 책임. */
  runBatch(paths: number): void;
  finish(): SimulationResult;
}
```

---

## 설계 근거 — 왜 이 형태인가

### `Float64Array`를 그대로 노출한다

`sortedRequired`, `A`, `B`, `samplePaths.values`는 전부 typed array다. Worker → 메인 전달 시 **transfer 대상**이 되어 복사가 없다. 10,000경로 기준 `sortedRequired`만 80KB인데, 일반 배열이면 구조화 복제로 매번 복사된다.

대신 **transfer 후 Worker 쪽 참조는 detach된다.** 같은 버퍼를 두 번 보내지 않도록 `worker-client.ts`가 결과를 한 번만 전달하고, 이후 조회는 메인 스레드에서만 한다.

### `sortedRequired`가 결과에 실려 나가는 이유

목표달성확률 화면의 슬라이더 3개가 재시뮬 없이 동작하려면, **정렬된 배열 자체가 메인 스레드에 있어야 한다.** 매번 Worker에 물어보면 메시지 왕복(~1ms)이 슬라이더 프레임에 끼어든다. 배열을 통째로 넘겨두면 `onInput` 핸들러에서 인덱싱·이진 탐색만 한다.

### `truncatedShocks`를 세는 이유

`|z| > 8` 재추출은 df 6에서 이론상 1억 표본당 약 6,500회다. 실측치가 이 규모에서 크게 벗어나면 RNG나 보정에 문제가 있다는 신호다. 성능 계측이 아니라 **정합성 경보**로 둔다.

### `clamped`가 `affine`의 유효성을 지배한다

잔액이 0에 닿는 순간 경로가 상태 의존이 되어 선형성이 깨진다. 엔진이 이를 감지해 `clamped = true`로 표시하고 `affine`을 채우지 않는다. **호출부는 `affine`의 존재 여부만 보고** 선형 역산과 이분 탐색을 가른다 — 판단 로직이 UI에 흩어지지 않는다.

### `targetAmount`의 기준

`reportBasis`와 **같은 기준**으로 해석한다. 기본이 `"real"`이므로 "10년 뒤 1억"은 오늘 구매력 기준 1억이다. 이 해석을 UI에 명시하지 않으면 사용자가 명목으로 오해한다.

---

## 물가 기본값 — 2.0%, 한국은행 물가안정목표

장기 시뮬레이션의 기본값은 **정책 목표치**를 쓴다. 20~40년 지평에서 특정 시점의 실측 물가를 기본값으로 박으면 그 해의 국면이 전 기간에 고정된다.

```ts
export const DEFAULT_INFLATION = {
  value: 0.02,
  label: "연 2.0%",
  source: "한국은행 물가안정목표 (소비자물가 상승률 전년동기대비 2%)",
  asOf: "2026-08-22",
  caveat: "2026년 중 실제 소비자물가는 목표를 웃도는 흐름입니다. 최근 물가가 높다고 보시면 값을 직접 올려 확인해 보세요.",
} as const;
```

값을 고정값으로 박지 않고 **사용자가 조정 가능한 입력**으로 두는 것이 핵심이다. 기본값에는 출처·기준일을 붙이고, 캐비엇에서 최근 흐름이 목표를 상회한다는 사실을 알린다. 세법 수치와 마찬가지로 **값을 갱신할 때마다 1차 출처로 재확인**한다.

민감도가 큰 항목이라 UI에서 물가 입력을 접어두지 말고 기본 노출한다. 40년 · CAGR 7% 기준으로 물가 2%와 3%는 실질 최종 자산을 30% 이상 갈라놓는다.

## 결과 공유 방식 — 로컬 우선, URL은 가정만

| 방식 | 채택 | 이유 |
|---|---|---|
| URL에 전체 입력 직렬화 | ❌ | 투자금·목표금액·납입액이 URL·브라우저 기록·리퍼러에 남는다 |
| **localStorage 저장/불러오기** | ✅ v1 | 기기 안에만 남는다. "최근 시나리오 3개" 수준이면 충분 |
| URL에 **가정만** (CAGR·σ·기간·물가·시드) | ✅ v1 | 금액이 없으므로 개인정보가 아니다. "이 가정으로 계산해보세요" 공유용 |
| 서버 저장 + 공유 코드 | 나중 | 계정·보관 정책이 선행돼야 한다 |

URL에는 **금액 계열 필드를 절대 싣지 않는다.** `initialBalance`, `monthlyAmount`, `targetAmount`는 직렬화 대상에서 제외하고, 링크를 연 사람은 가정만 채워진 빈 폼을 본다. 이 규칙을 직렬화 함수 한 곳에 화이트리스트로 박아둔다 — 나중에 필드가 늘어도 기본값이 "제외"가 되게.

---

## 다음 단계

1. 빈 Worker `ping → pong` (dev + `next build && next start` 양쪽)
2. 이 문서의 타입 블록을 `types.ts`로
3. `rng.ts` → 캘리브레이션 테이블 생성 스크립트 → `returns.ts`
4. `engine.ts` + 러너
5. `worker-client.ts` → `useMonteCarlo.ts`

**남은 결정은 프리셋 수치 출처 하나다.** 확보 전까지는 "직접 입력"만으로 진행할 수 있으므로 v1 착수를 막지 않는다.
