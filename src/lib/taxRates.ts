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
