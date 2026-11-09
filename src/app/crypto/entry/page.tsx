import type { Metadata } from "next";
import CryptoEntryCalculator from "@/components/calculator/CryptoEntryCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import { calculatorPages } from "@/lib/calculatorPages";

import { withPageMetadata } from "@/lib/metadata";
const config = calculatorPages["crypto-entry-calculator"];

export const metadata: Metadata = withPageMetadata(config.metadata, "/crypto/entry");

export default function CryptoEntryPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CalculatorJsonLd config={config} path="/crypto/entry" />
            <CryptoEntryCalculator />

            {/* 고위험 경고 박스 */}
            <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
                <p className="font-semibold mb-2">⚠ 고위험 거래 주의</p>
                <p>
                    레버리지 거래는 원금 손실 가능성이 매우 높은 고위험 투자입니다.
                    작은 가격 변동만으로도 단시간에 청산되어 원금 전액을 잃을 수 있으며,
                    본 계산기의 이론 배율은 손절폭만으로 역산한 최대치라 거래소가 지원하는 최대 배율을 넘는 값이 나올 수도 있습니다. 실제로는
                    더 보수적인 배율과 리스크 비율을 사용하는 것을 권장합니다.
                </p>
            </section>
        </CalculatorPageTemplate>
    );
}
