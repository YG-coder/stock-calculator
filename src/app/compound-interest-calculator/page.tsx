/**
 * src/app/compound-interest-calculator/page.tsx
 */

import type { Metadata } from "next";
import CompoundInterestCalculator from "@/components/calculator/CompoundInterestCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

import SeoContent from "@/components/seo/SeoContent";
import InternalLinks from "@/components/seo/InternalLinks";

const config = calculatorPages["compound-interest-calculator"];

export const metadata: Metadata = config.metadata;

export default function CompoundInterestCalculatorPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CompoundInterestCalculator />

            {/* 🔥 SEO 블록 */}
            <SeoContent
                title="복리 계산기"
                description="복리 효과를 적용하여 투자 자산이 시간이 지남에 따라 어떻게 증가하는지 계산하는 도구입니다."
                formula="원금 × (1 + 이자율)^기간"
            />

            {/* 🔥 내부 링크 */}
            <InternalLinks />
        </CalculatorPageTemplate>
    );
}