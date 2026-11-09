import type { Metadata } from "next";
import CryptoAverageCalculator from "@/components/calculator/CryptoAverageCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import { calculatorPages } from "@/lib/calculatorPages";

import { withPageMetadata } from "@/lib/metadata";
const config = calculatorPages["crypto-average-calculator"];

export const metadata: Metadata = withPageMetadata(config.metadata, "/crypto/average");

export default function CryptoAveragePage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CalculatorJsonLd config={config} path="/crypto/average" />
            <CryptoAverageCalculator />
        </CalculatorPageTemplate>
    );
}