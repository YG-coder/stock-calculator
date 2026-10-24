/**
 * 주식·코인 계산기 17개 전용 십진 정확 계산과 표시.
 *  - 1묶음: 목표가·손절가·본전 회복·손익비
 *  - 2묶음: 평균단가·수익률·포지션 규모(정수 수량 내림은 lib/positionSize.ts)
 *  - 3묶음: 배당·미국주식 배당(lib/usDividend.ts)·미국주식 환율 수익·증권거래세(lib/stockTransactionTax.ts, 세목별 원 미만 내림)
 *  - 4묶음: 코인 평균가·진입·수익·청산가·레버리지 수익(lib/cryptoLeverageProfit.ts)·펀딩비(lib/fundingFee.ts)
 *
 * 화면 입력은 십진 문자열이다. 이를 Number로 바꿔 계산하면
 *  - 300 × 1.005 = 301.49999999999994 처럼 정확히 x.5인 값이 아래로 표시되고(301.5 → 301),
 *  - 15자리를 넘는 금액이나 뺄셈 상쇄(100 − 99.9999999999)에서 표시 숫자가 틀린다.
 * 여기서는 입력 문자열을 그대로 정확한 유리수로 읽어 계산하고, 화면에 표시할 때 한 번만 반올림한다.
 * 반올림 방향은 각 계산기가 쓰던 기존 규칙을 그대로 재현한다(부호·조건 판정은 반올림 전 정확값으로 한다).
 *  - formatGrouped: Intl.NumberFormat("ko-KR", { maximumFractionDigits }) — 0에서 먼 쪽(halfExpand), 뒤쪽 0 생략, 3자리 쉼표
 *    (Intl처럼 0으로 반올림되는 작은 음수는 "-0"으로 표시한다. 기존 표시 규칙이며 여기서 바꾸지 않는다)
 *  - toFixedExact: Number.prototype.toFixed — 동점이면 절댓값이 큰 쪽, 고정 자릿수, 쉼표 없음
 *  - formatRoundedInteger: Intl.NumberFormat("ko-KR").format(Math.round(x)) — 0.5는 +∞ 쪽, 3자리 쉼표
 * 다른 계산기는 기존 부동소수 경로를 그대로 쓴다.
 */
export type Exact = { n: bigint; d: bigint }; // d > 0

const ZERO = BigInt(0);
const ONE = BigInt(1);
const TWO = BigInt(2);
const TEN = BigInt(10);
const DECIMAL = /^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/;

export const EXACT_ZERO: Exact = { n: ZERO, d: ONE };

function fromDecimalString(text: string): Exact | null {
  const m = DECIMAL.exec(text);
  if (!m) return null;
  const [, sign, intPart, fracPart = "", exp = "0"] = m;
  if (intPart === "" && fracPart === "") return null;
  let n = BigInt((intPart || "0") + fracPart);
  let d = TEN ** BigInt(fracPart.length);
  const e = Number(exp);
  if (e > 0) n *= TEN ** BigInt(e);
  else if (e < 0) d *= TEN ** BigInt(-e);
  return { n: sign === "-" ? -n : n, d };
}

/**
 * 기존 parsePositive(Number(값))과 같은 유효성 계약으로 입력을 정확히 읽는다.
 * 빈칸·'-'·'.'·음수·0은 0, 0보다 큰 십진 표기는 그 값 그대로(자릿수 손실 없음).
 * 십진 표기가 아닌 문자열(예: "0x10", "Infinity")만 기존처럼 Number로 해석한다(화면 입력 필터는 받지 않는 값).
 */
export function parsePositiveExact(value: string): Exact {
  const t = String(value ?? "").trim();
  const exact = fromDecimalString(t);
  if (exact) return exact.n > ZERO ? exact : EXACT_ZERO;
  const n = Number(t);
  if (!Number.isFinite(n) || n <= 0) return EXACT_ZERO;
  return fromDecimalString(String(n)) ?? EXACT_ZERO;
}

/**
 * 기존 Number(값)과 같은 유효성 계약으로 입력을 정확히 읽는다(부호 포함).
 * 빈칸·공백은 Number("")처럼 0, 십진 표기는 그 값 그대로(자릿수 손실 없음),
 * Number가 NaN·Infinity로 보는 값('-', '.', 'abc')은 null.
 * 십진 표기가 아닌데 Number가 유한값으로 읽는 문자열(예: "0x10")만 기존처럼 Number로 해석한다(화면 입력 필터는 받지 않는 값).
 */
export function parseNumberExact(value: string): Exact | null {
  const t = String(value ?? "").trim();
  if (t === "") return EXACT_ZERO;
  const exact = fromDecimalString(t);
  if (exact) return exact;
  const n = Number(t);
  return Number.isFinite(n) ? fromDecimalString(String(n)) : null;
}

/** 기존 requiredNumber(값)과 같은 계약: 빈칸이면 null(미입력), 그 밖은 parseNumberExact와 같다. */
export function requiredNumberExact(value: string): Exact | null {
  return String(value ?? "").trim() === "" ? null : parseNumberExact(value);
}

/**
 * 기존 Number(값)과 같은 유효성 계약으로 입력을 정확히 읽는다(4묶음 코인 계산기).
 * 빈칸·공백은 Number("")처럼 0이고, Number가 NaN·±Infinity로 보는 값은 null이다.
 * parseNumberExact와 다른 점: Number가 ±Infinity로 보는 큰 지수 문자열(예: "1e400")도 기존처럼 무효(null)다.
 * 유한하면 입력 십진값을 그대로 쓴다(자릿수 손실 없음).
 */
export function finiteNumberExact(value: string): Exact | null {
  return Number.isFinite(Number(value)) ? parseNumberExact(value) : null;
}

/** 기존 requiredNumber(값)과 같은 계약: 빈칸이면 null(미입력), 그 밖은 finiteNumberExact와 같다. */
export function requiredFiniteNumberExact(value: string): Exact | null {
  return String(value ?? "").trim() === "" ? null : finiteNumberExact(value);
}

/** 코드에 적힌 유한한 Number 상수(세율 등)를 그 십진 표기 그대로 정확값으로 바꾼다(예: 0.0005 → 5/10000). */
export function fromNumber(value: number): Exact {
  const exact = Number.isFinite(value) ? fromDecimalString(String(value)) : null;
  if (!exact) throw new Error("유한한 숫자가 아닙니다.");
  return exact;
}

export const add = (a: Exact, b: Exact): Exact => ({ n: a.n * b.d + b.n * a.d, d: a.d * b.d });
export const sub = (a: Exact, b: Exact): Exact => ({ n: a.n * b.d - b.n * a.d, d: a.d * b.d });
export const mul = (a: Exact, b: Exact): Exact => ({ n: a.n * b.n, d: a.d * b.d });
/** b ≠ 0 */
export const div = (a: Exact, b: Exact): Exact =>
  b.n < ZERO ? { n: -a.n * b.d, d: a.d * -b.n } : { n: a.n * b.d, d: a.d * b.n };
export const fromInt = (k: number): Exact => ({ n: BigInt(k), d: ONE });
export const fromBigInt = (k: bigint): Exact => ({ n: k, d: ONE });
export const isPositive = (a: Exact): boolean => a.n > ZERO;
/** 부호: 음수 −1, 0, 양수 1 (반올림 전 정확값 기준) */
export const sign = (a: Exact): number => (a.n > ZERO ? 1 : a.n < ZERO ? -1 : 0);
/** 내림(−∞ 쪽) 정수 */
export function floor(a: Exact): bigint {
  const q = a.n / a.d;
  return a.n % a.d !== ZERO && a.n < ZERO ? q - ONE : q;
}
/** a < b → 음수, a = b → 0, a > b → 양수 */
export const compare = (a: Exact, b: Exact): number => {
  const diff = a.n * b.d - b.n * a.d;
  return diff > ZERO ? 1 : diff < ZERO ? -1 : 0;
};

/** |x| × 10^digits 를 0에서 먼 쪽으로 정수 반올림 */
function roundAbsScaled(x: Exact, digits: number): bigint {
  const abs = x.n < ZERO ? -x.n : x.n;
  const scaled = abs * TEN ** BigInt(digits);
  const q = scaled / x.d;
  return (scaled % x.d) * TWO >= x.d ? q + ONE : q;
}

function groupThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function splitScaled(m: bigint, digits: number): [string, string] {
  const s = m.toString().padStart(digits + 1, "0");
  return [s.slice(0, s.length - digits), digits > 0 ? s.slice(s.length - digits) : ""];
}

/** Intl.NumberFormat("ko-KR", { maximumFractionDigits }) 와 같은 표시(halfExpand·뒤쪽 0 생략·쉼표) */
export function formatGrouped(x: Exact, maximumFractionDigits: number): string {
  const [i, f] = splitScaled(roundAbsScaled(x, maximumFractionDigits), maximumFractionDigits);
  const frac = f.replace(/0+$/, "");
  return `${x.n < ZERO ? "-" : ""}${groupThousands(i)}${frac ? `.${frac}` : ""}`;
}

/** Number.prototype.toFixed(digits) 와 같은 표시(동점은 절댓값이 큰 쪽, 쉼표 없음, 지수 표기 없음) */
export function toFixedExact(x: Exact, digits: number): string {
  const [i, f] = splitScaled(roundAbsScaled(x, digits), digits);
  return `${x.n < ZERO ? "-" : ""}${i}${digits > 0 ? `.${f}` : ""}`;
}

/** Intl.NumberFormat("ko-KR", { minimumFractionDigits: d, maximumFractionDigits: d }) 와 같은 표시(halfExpand·고정 자릿수·쉼표) */
export function formatGroupedFixed(x: Exact, digits: number): string {
  const [i, f] = splitScaled(roundAbsScaled(x, digits), digits);
  return `${x.n < ZERO ? "-" : ""}${groupThousands(i)}${digits > 0 ? `.${f}` : ""}`;
}

/** Intl.NumberFormat("ko-KR", { maximumSignificantDigits }) 와 같은 표시(halfExpand·뒤쪽 0 생략·쉼표) */
export function formatSignificant(x: Exact, maximumSignificantDigits: number): string {
  if (x.n === ZERO) return "0";
  const abs: Exact = { n: x.n < ZERO ? -x.n : x.n, d: x.d };
  const pow10 = (e: number): Exact => (e >= 0 ? { n: TEN ** BigInt(e), d: ONE } : { n: ONE, d: TEN ** BigInt(-e) });
  // k = floor(log10|x|), 즉 10^k ≤ |x| < 10^(k+1)
  let k = abs.n.toString().length - abs.d.toString().length;
  while (compare(pow10(k), abs) > 0) k -= 1;
  while (compare(pow10(k + 1), abs) <= 0) k += 1;
  let fractionDigits = maximumSignificantDigits - 1 - k;
  let m =
    fractionDigits >= 0
      ? roundAbsScaled(abs, fractionDigits)
      : roundAbsScaled({ n: abs.n, d: abs.d * TEN ** BigInt(-fractionDigits) }, 0);
  if (m === TEN ** BigInt(maximumSignificantDigits)) {
    m /= TEN; // 반올림 올림으로 자릿수가 하나 늘어난 경우(예: 0.99996 → 1.000)
    fractionDigits -= 1;
  }
  const sign = x.n < ZERO ? "-" : "";
  if (fractionDigits <= 0) return `${sign}${groupThousands((m * TEN ** BigInt(-fractionDigits)).toString())}`;
  const [i, f] = splitScaled(m, fractionDigits);
  const frac = f.replace(/0+$/, "");
  return `${sign}${groupThousands(i)}${frac ? `.${frac}` : ""}`;
}

/**
 * lib/number.ts formatPrice와 같은 코인 가격 표시: 0 < |x| < 1 은 유효숫자 4자리, 그 밖은 최대 소수 2자리.
 * 가격 구간 판정은 반올림 전 정확값으로 한다.
 */
export function formatPriceExact(x: Exact): string {
  const below1 = x.n !== ZERO && (x.n < ZERO ? -x.n : x.n) < x.d;
  return below1 ? formatSignificant(x, 4) : formatGrouped(x, 2);
}

/** Intl.NumberFormat("ko-KR").format(Math.round(x)) 와 같은 표시(0.5는 +∞ 쪽) */
export function formatRoundedInteger(x: Exact): string {
  const t: Exact = { n: x.n * TWO + x.d, d: x.d * TWO }; // x + 1/2
  let q = t.n / t.d;
  if (t.n % t.d !== ZERO && t.n < ZERO) q -= ONE; // floor
  return `${q < ZERO ? "-" : ""}${groupThousands((q < ZERO ? -q : q).toString())}`;
}

const MANTISSA_TOP = TWO ** BigInt(52); // 정상수 가수의 맨 앞 비트(2^52)
const MANTISSA_CARRY = TWO ** BigInt(53); // 반올림으로 가수가 넘친 값(2^53)
const LOW_32 = TWO ** BigInt(32);

/** v > 0 의 이진 자릿수 */
const bitLength = (v: bigint): number => v.toString(2).length;

/**
 * 기존 Number 결과를 돌려주는 API(calculateUsDividend·calculateStockTransactionTax)의 호환용 변환.
 * 화면 표시에는 쓰지 않는다. 정확한 유리수 x에 가장 가까운 Number를 돌려준다.
 * 규칙은 IEEE 754 binary64의 기본 반올림(가장 가까운 값, 동점이면 가수가 짝수인 쪽)이다.
 * 화면 표시 반올림(formatGrouped·toFixedExact의 0에서 먼 쪽)과는 다른 규칙이다.
 *  - 고정 소수 자릿수로 먼저 반올림하지 않는다. 가수와 나머지는 정수 나눗셈 한 번으로 정확히 구한다.
 *  - 분자·분모를 따로 Number로 바꾸지 않는다. 둘이 Number 범위를 넘어도 몫이 유한하면 그 값을 얻는다.
 *  - 정상수(53비트 가수)와 서브노멀(2^-1074 단위) 모두 같은 규칙으로 반올림한다.
 *  - Number 자체의 범위 때문에 생기는 결과:
 *    - |x| ≤ 2^-1075는 0이다(음수는 −0). 정확히 2^-1075는 동점이라 짝수 쪽인 0이 된다.
 *    - |x| ≥ 2^1024 − 2^970은 ±Infinity다.
 *    - 정확한 0은 +0이다.
 */
export function toNumber(x: Exact): number {
  if (x.d === ZERO) throw new RangeError("분모가 0입니다.");
  if (x.n === ZERO) return 0;
  const negative = x.n < ZERO !== x.d < ZERO;
  const n = x.n < ZERO ? -x.n : x.n;
  const d = x.d < ZERO ? -x.d : x.d;

  // e = floor(log2(n/d)), 즉 2^e ≤ n/d < 2^(e+1)
  let e = bitLength(n) - bitLength(d);
  if (e >= 0 ? n < d << BigInt(e) : n << BigInt(-e) < d) e -= 1;
  if (e >= 1024) return negative ? -Infinity : Infinity;

  // 가수 단위 2^q: 정상수는 q = e − 52(가수 53비트), 서브노멀은 2^-1074로 고정
  let q = Math.max(e - 52, -1074);
  const num = q < 0 ? n << BigInt(-q) : n;
  const den = q > 0 ? d << BigInt(q) : d;
  let m = num / den; // x / 2^q 의 정수 부분
  const twiceRemainder = (num - m * den) * TWO;
  if (twiceRemainder > den || (twiceRemainder === den && (m & ONE) === ONE)) m += ONE;
  if (m === MANTISSA_CARRY) {
    m = MANTISSA_TOP; // 2^53·2^q = 2^52·2^(q+1)
    q += 1;
  }

  // m·2^q 를 binary64 비트로 조립한다(Math.pow·문자열 변환을 거치지 않아 그대로 정확하다)
  const normal = m >= MANTISSA_TOP; // 서브노멀에서 반올림 올림으로 2^52가 되면 최소 정상수
  const biasedExponent = normal ? q + 52 + 1023 : 0;
  if (biasedExponent >= 2047) return negative ? -Infinity : Infinity;
  const fraction = normal ? m - MANTISSA_TOP : m;
  const view = new DataView(new ArrayBuffer(8));
  view.setUint32(0, ((negative ? 0x80000000 : 0) | (biasedExponent << 20) | Number(fraction / LOW_32)) >>> 0);
  view.setUint32(4, Number(fraction % LOW_32));
  return view.getFloat64(0);
}

/**
 * 입력에서 읽은 십진값(분모가 10의 거듭제곱)의 정확한 표기. 앞뒤 불필요한 0은 생략한다.
 * (기존 화면은 String(Number(입력))이라 0.00000001이 "1e-8"로, 17자리를 넘는 입력은 잘려 보였다.)
 */
export function toPlainDecimal(x: Exact): string {
  const d = x.d.toString();
  const digits = /^10*$/.test(d) ? d.length - 1 : 60;
  return digits === 0 ? toFixedExact(x, 0) : toFixedExact(x, digits).replace(/0+$/, "").replace(/\.$/, "");
}
