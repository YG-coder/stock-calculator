import type { Metadata } from "next";
import CryptoFundingFeeCalculator from "@/components/calculator/CryptoFundingFeeCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import { calculatorPages } from "@/lib/calculatorPages";

import { withPageMetadata } from "@/lib/metadata";
const config = calculatorPages["crypto-funding-fee-calculator"];

export const metadata: Metadata = withPageMetadata(config.metadata, "/crypto/funding-fee");

export default function CryptoFundingFeePage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CalculatorJsonLd config={config} path="/crypto/funding-fee" />
            <CryptoFundingFeeCalculator />
        </CalculatorPageTemplate>
    );
}
