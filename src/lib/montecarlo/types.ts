/**
 * src/lib/montecarlo/types.ts
 * 역할: MonteCarloEngine 계약 타입의 단일 소스. 런타임 로직 없음.
 *
 * 근거 문서
 * - docs/2026-08-21-montecarlo-engine-contract.md (입출력 계약, 수식)
 * - docs/2026-08-22-types-contract-final.md       (이름 확정본)
 * - docs/2026-08-22-portfolio-assumptions-design.md (입력 계층)
 *
 * 이 파일에서 계약 문서 대비 "추가"된 것은 아래 3가지뿐이며, 모두 가산적이라
 * 기존 계약을 깨지 않는다.
 *   1) RunMeta.warnings    — 결과에 동봉하는 경고 목록
 *   2) ValidationIssue     — 입력 거부 사유의 구조화
 *   3) ProgressFn / RunOptions / SimulationRunner 진입점 시그니처
 */

export const ENGINE_VERSION = "1.0.0";

/* ============================================================
   입력
   ============================================================ */

export type Basis = "nominal" | "real";

export interface SimulationInput {
  /** 재현성. 결과에 그대로 실려 나간다. 32비트 부호 없는 정수로 해석한다. */
  seed: number;
  /** 경로 수. 권장 10_000, 상한 50_000. */
  paths: number;
  /** 총 기간(개월). 1 이상 720(60년) 이하. */
  months: number;
  /** 초기 자산 (원). 명목 기준. */
  initialBalance: number;
  cashFlow: CashFlowSpec;
  returns: ReturnSpec;
  /**
   * 연 물가상승률(실수, 예: 0.02). 0 이면 명목 = 실질.
   * 엔진은 기본값을 갖지 않는다 — 호출부가 반드시 명시한다.
   */
  inflationRate: number;
  /** 결과 보고 기준. 화면 권장 기본은 "real" 이지만 엔진은 필수 입력으로 받는다. */
  reportBasis: Basis;
  /** 없으면 성공확률·역산을 계산하지 않는다. */
  goal?: GoalSpec;
}

export interface CashFlowSpec {
  /** 월 금액(원). 양수 = 적립, 음수 = 인출. type 필드를 두지 않는다. */
  monthlyAmount: number;
  /**
   * 적용 시점. 기존 복리 계산기의 모호함(기말 기준인데 표기 없음)을
   * 반복하지 않기 위해 필수.
   *   "start" — 그 달 수익률을 적용하기 전에 반영
   *   "end"   — 그 달 수익률을 적용한 뒤에 반영
   */
  timing: "start" | "end";
  /** 매년 물가만큼 증액할지. 배수는 (1+inflationRate)^floor(m/12). */
  inflationIndexed: boolean;
  /** 적용 구간. [fromMonth, toMonth) 반열림. 미지정 시 전체 기간. */
  fromMonth?: number;
  toMonth?: number;
  /**
   * 불규칙 현금흐름(일시금 등). monthIndex → 금액(원).
   * 규칙: 해당 월의 monthlyAmount 에 **더해진다**(치환이 아니다).
   * 목표 역산의 스칼라 c 에 비례하지 않으므로 아핀 분해에서 상수항(A)에 들어간다.
   */
  overrides?: Record<number, number>;
  /** FIRE·SoRR용 비중첩 다단계 현금흐름. 있으면 기본 월 현금흐름 구간 대신 사용한다. */
  phases?: CashFlowPhase[];
}

export interface CashFlowPhase {
  fromMonth: number;
  toMonth: number;
  monthlyAmount: number;
  timing: "start" | "end";
  inflationIndexed: boolean;
  label?: string;
}

export type ReturnSpec =
  | {
      kind: "parametric";
      /** 연 CAGR(기하평균, 명목, 총수익 기준). 산술평균이 아니다. */
      expectedReturn: number;
      /** 연 변동성. 단순수익률 기준. 상한 0.45. */
      volatility: number;
      /** 미지정 시 { type: "student-t", df: 6 }. v1 은 df 6 전역 고정. */
      shock?: ShockSpec;
    }
  | {
      /** 8단계(/lab 백테스트) 예약. v1 미구현 — 입력하면 거부한다. */
      kind: "bootstrap";
      datasetId: string;
      blockMonths: number;
    };

export type ShockSpec =
  | { type: "student-t"; df: number } // df > 2. v1 은 6 고정
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

  /** 연 단위 그리드의 백분위 밴드. 팬 차트용. reportBasis 기준. */
  bands: PercentileBand[];
  /** 최종 잔액 분포. reportBasis 기준. */
  terminal: Distribution;

  /** goal 이 있을 때만. */
  goal?: GoalResult;
  /** 소진이 한 건이라도 발생했을 때만. */
  depletion?: DepletionResult;

  /** 팬 차트에 겹쳐 그릴 대표 경로. */
  samplePaths: SamplePaths;
  /** 선형 역산용 계수. clamped 가 true 면 undefined. 명목 기준. */
  affine?: AffineCoefficients;

  meta: RunMeta;
}

export interface Percentiles {
  p5: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
}

export interface PercentileBand extends Percentiles {
  month: number;
}

export interface Distribution extends Percentiles {
  min: number;
  max: number;
  /**
   * 참고용. 화면에서 강조하지 않는다.
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
  /** 검증용. 그 납입액에서 경험적 CDF 상 실제로 나오는 성공확률. */
  successProbabilityAt: number;
  /**
   * 오름차순 정렬된 경로별 필요 납입액 (B_j > 0 인 경로만).
   * UI 슬라이더가 이 배열만으로 확률↔납입액을 재계산한다(재시뮬 없음).
   * linear-exact 일 때만 채워진다.
   */
  sortedRequired?: Float64Array;
  /**
   * B_j <= 0 이라 납입액과 무관하게 성패가 고정된 경로.
   * 일시금만 있는 시나리오에서 발생한다.
   */
  fixedPaths: { count: number; successes: number };
}

export interface DepletionResult {
  /** 소진 경로 비율(0~1). */
  rate: number;
  /** 연 단위 소진 시점 히스토그램. 인덱스 = 연차(floor(month/12)). */
  byYear: Int32Array;
  /** 소진된 경로들의 소진 시점(개월) 백분위. */
  percentiles: Percentiles;
}

export interface SamplePaths {
  /** 기록된 월 그리드. 보통 [0, 12, 24, …, months]. */
  months: Int32Array;
  /** 평탄 배열. values[pathIndex * months.length + i]. reportBasis 기준. */
  values: Float64Array;
  count: number;
}

export interface AffineCoefficients {
  /** 납입 수준과 무관한 종말자산 성분(초기자산 + 일시금). 명목. */
  A: Float64Array;
  /** 단위 납입(월 1원)이 만기까지 누적된 값. 명목. */
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
  months: number;
  elapsedMs: number;
  batches: number;
  /** |z| > 8 로 재추출한 횟수. 절단 영향 모니터링용(정합성 경보). */
  truncatedShocks: number;
  /** 잔액 0 클램프 발생 여부. true 면 선형 역산 불가. */
  clamped: boolean;
  /**
   * 결과와 함께 화면에 노출할 경고. 계약 문서 대비 추가된 필드.
   * 예: "세금·수수료 미반영", "잔액 소진으로 선형 역산 불가".
   */
  warnings: string[];
}

/* ============================================================
   프리셋 (데이터 계층 — 엔진은 알지 못한다)
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
   입력 검증
   ============================================================ */

export type ValidationIssue = {
  /** 문제가 된 입력 경로. 예: "returns.volatility" */
  field: string;
  message: string;
};

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
  | { type: "error"; id: string; message: string; issues?: ValidationIssue[] };

/* ============================================================
   엔진 진입점
   ============================================================ */

/** 엔진이 Worker 를 모른 채 진행률을 알리는 콜백. */
export type ProgressFn = (completed: number, total: number) => void;

export interface RunOptions {
  onProgress?: ProgressFn;
  shouldCancel?: () => boolean;
}

export interface SimulationRunner {
  readonly done: boolean;
  readonly completed: number;
  readonly total: number;
  /** 동기 실행. 이벤트 루프 양보는 호출부(Worker) 책임. */
  runBatch(paths: number): void;
  /** done 이후 호출. */
  finish(): SimulationResult;
}
