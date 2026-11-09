import type { Metadata } from "next";
import SourceNote from "@/components/ui/SourceNote";
import { US_DIVIDEND_WITHHOLDING, FINANCIAL_INCOME_THRESHOLD, TAX_BASIS_YEAR, TAX_REVIEWED_AT } from "@/lib/taxRates";
import USDividendCalculator from "@/components/calculator/USDividendCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import { calculatorPages } from "@/lib/calculatorPages";

import { withPageMetadata } from "@/lib/metadata";
const config = calculatorPages["us-dividend-calculator"];

export const metadata: Metadata = withPageMetadata(config.metadata, "/us-stocks/dividend");

export default function USDividendPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CalculatorJsonLd config={config} path="/us-stocks/dividend" />
            <USDividendCalculator />

            <SourceNote
                basisYear={TAX_BASIS_YEAR}
                reviewedAt={TAX_REVIEWED_AT}
                applied={[
                    { label: "미국 현지 원천징수", value: `${US_DIVIDEND_WITHHOLDING.rateDisplay} (${US_DIVIDEND_WITHHOLDING.rateBreakdown})` },
                    { label: "금융소득종합과세 기준", value: `연 ${FINANCIAL_INCOME_THRESHOLD.amountDisplay}` },
                ]}
                conditions={[
                    US_DIVIDEND_WITHHOLDING.note,
                    "계산 결과의 '세후'는 미국 현지 원천징수 후 금액입니다. 국내 최종 세부담과 같은 개념이 아닙니다.",
                    "연간 배당 전체에 하나의 환율을 적용합니다. 실제 분기 배당은 지급 시점마다 환율이 다릅니다.",
                    "월 배당은 연 배당을 12로 나눈 평균값입니다. 분기 지급 종목은 해당 월에 그 금액이 들어오지 않습니다.",
                ]}
                sources={US_DIVIDEND_WITHHOLDING.sources}
            />
        </CalculatorPageTemplate>
    );
}