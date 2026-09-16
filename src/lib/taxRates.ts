/**
 * 세율·공제액 단일 소스.
 *
 * 이 파일이 계산기 코드와 화면 문구가 참조하는 유일한 위치다.
 * 값을 바꿀 때는 반드시 공식 자료로 다시 확인하고 asOf 와 reviewedAt 을 함께 갱신한다.
 * 확인되지 않은 값은 넣지 않는다.
 */

/** 아래 값들을 마지막으로 검토한 날짜 */
export const TAX_REVIEWED_AT = "2026-08-21";

/** 적용 기준 연도 */
export const TAX_BASIS_YEAR = "2026";

export type TaxSource = {
    label: string;
    url: string;
    /** 해당 사이트에서 찾아볼 문서·항목 이름 */
    document?: string;
};

/** 공식 출처. 세부 경로는 개편으로 바뀔 수 있어 기관 사이트를 링크하고 문서명을 함께 적는다. */
export const TAX_SOURCES = {
    nts: {
        label: "국세청",
        url: "https://www.nts.go.kr",
        document: "해외주식과 세금 / 금융소득종합과세 안내",
    },
    ntsLaw: {
        label: "국세청 국세법령정보시스템",
        url: "https://taxlaw.nts.go.kr",
        document: "소득세법 제104조·제118조의7·제129조",
    },
    hometax: {
        label: "홈택스",
        url: "https://hometax.go.kr",
        document: "양도소득세 확정신고",
    },
    law: {
        label: "국가법령정보센터",
        url: "https://www.law.go.kr",
        document: "소득세법",
    },
} as const satisfies Record<string, TaxSource>;

/** 해외주식 양도소득세 */
export const OVERSEAS_STOCK_TAX = {
    /** 양도소득세 20% + 지방소득세 2% */
    rate: 0.22,
    rateDisplay: "22%",
    rateBreakdown: "양도소득세 20% + 지방소득세 2%",
    /** 연 1회, 전 증권사 합산 */
    basicDeduction: 2_500_000,
    basicDeductionDisplay: "250만 원",
    filingPeriod: "양도한 다음 해 5월 1일~31일",
    asOf: TAX_REVIEWED_AT,
    sources: [TAX_SOURCES.nts, TAX_SOURCES.hometax],
} as const;

/** 국내 배당소득세 원천징수 */
export const DOMESTIC_DIVIDEND_TAX = {
    /** 소득세 14% + 지방소득세 1.4% */
    rate: 0.154,
    /** 입력 필드 기본값용 퍼센트 표기. rate 와 함께 갱신할 것. */
    ratePercent: 15.4,
    rateDisplay: "15.4%",
    rateBreakdown: "소득세 14% + 지방소득세 1.4%",
    asOf: TAX_REVIEWED_AT,
    sources: [TAX_SOURCES.nts, TAX_SOURCES.ntsLaw],
} as const;

/** 미국주식 배당 현지 원천징수 (한미 조세조약) */
export const US_DIVIDEND_WITHHOLDING = {
    rate: 0.15,
    ratePercent: 15,
    rateDisplay: "15%",
    rateBreakdown: "한미 조세조약에 따른 미국 현지 원천징수",
    note: "미국에서 15%가 원천징수된 뒤 지급됩니다. 현지 세율이 국내 원천징수율보다 높아 지급 단계에서 국내 원천징수가 추가로 이뤄지지는 않지만, 이 배당은 국내 배당소득에 포함됩니다. 이자·배당 합계가 연 2,000만 원을 넘으면 종합과세 대상이 되어 추가 납부가 생길 수 있고, 미국에서 낸 세금은 외국납부세액공제 대상이 될 수 있습니다. 최종 세부담은 전체 금융소득과 공제 한도에 따라 달라지므로 이 계산기 결과는 현지 원천징수까지만 반영한 값입니다.",
    asOf: TAX_REVIEWED_AT,
    sources: [TAX_SOURCES.nts],
} as const;

/** 금융소득종합과세 기준 */
export const FINANCIAL_INCOME_THRESHOLD = {
    amount: 20_000_000,
    amountDisplay: "2,000만 원",
    note: "이자·배당을 합한 연간 금융소득이 이 금액을 넘으면 초과분이 종합과세 대상이 될 수 있습니다.",
    asOf: TAX_REVIEWED_AT,
    sources: [TAX_SOURCES.nts],
} as const;

/* ============================================================
   기준 데이터 레지스트리와 변경 감지
   ------------------------------------------------------------
   인컴랩 아키텍처 §3 Reference Foundation:
     Reference 는 SSOT 이고, Knowledge 문서는 Reference 가 바뀌면
     "검토 트리거"를 받는다. Reference 변경이 곧 문서 자동 수정은 아니다.

   그래서 이 파일은 값을 제공하는 동시에, 값이 바뀌었는지 판별할 수 있는
   지문(fingerprint)을 제공한다. 가이드는 자신이 참조한 기준과 그때의 지문을
   기록해 두고, 지문이 달라지면 자동으로 재검토 대상(Pending Review)이 된다.

   지문이 바뀌어도 검수 상태가 자동으로 Verified 로 올라가는 일은 없다.
   내려가는 방향(Verified → Pending Review)으로만 동작한다.
   ============================================================ */

/** 가이드가 참조할 수 있는 기준 데이터 목록. */
export const TAX_BASIS = {
    overseasStockTax: OVERSEAS_STOCK_TAX,
    domesticDividendTax: DOMESTIC_DIVIDEND_TAX,
    usDividendWithholding: US_DIVIDEND_WITHHOLDING,
    financialIncomeThreshold: FINANCIAL_INCOME_THRESHOLD,
} as const;

export type TaxBasisKey = keyof typeof TAX_BASIS;

/**
 * 지문에 포함할 필드.
 * 숫자·표기·적용시점처럼 "내용이 달라지면 문서를 다시 봐야 하는" 값만 넣는다.
 * sources 배열이나 설명 문구(note) 변경은 재검토 트리거로 보지 않는다.
 */
const BASIS_FINGERPRINT_FIELDS = [
    "rate",
    "ratePercent",
    "rateDisplay",
    "rateBreakdown",
    "basicDeduction",
    "basicDeductionDisplay",
    "filingPeriod",
    "amount",
    "amountDisplay",
    "asOf",
] as const;

/** FNV-1a 32bit. 암호용이 아니라 변경 감지용이다. */
function fnv1a(input: string): string {
    let hash = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
}

/** 기준 데이터의 현재 지문. 값이 하나라도 바뀌면 달라진다. */
export function taxBasisFingerprint(key: TaxBasisKey): string {
    const basis = TAX_BASIS[key] as Record<string, unknown>;
    const payload = BASIS_FINGERPRINT_FIELDS.filter((f) => f in basis)
        .map((f) => `${f}=${String(basis[f])}`)
        .join("|");
    return fnv1a(`${key}:${payload}`);
}

/** 전 기준의 현재 지문. 디버깅·검사 출력용. */
export function allTaxBasisFingerprints(): Record<TaxBasisKey, string> {
    const out = {} as Record<TaxBasisKey, string>;
    for (const key of Object.keys(TAX_BASIS) as TaxBasisKey[]) {
        out[key] = taxBasisFingerprint(key);
    }
    return out;
}
