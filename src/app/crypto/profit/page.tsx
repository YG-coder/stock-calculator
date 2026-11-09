import type { Metadata } from "next";
import CryptoProfitCalculator from "@/components/calculator/CryptoProfitCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import { calculatorPages } from "@/lib/calculatorPages";

import { withPageMetadata } from "@/lib/metadata";
const config = calculatorPages["crypto-profit-calculator"];

export const metadata: Metadata = withPageMetadata(config.metadata, "/crypto/profit");

export default function CryptoProfitPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CalculatorJsonLd config={config} path="/crypto/profit" />
            <CryptoProfitCalculator />
        </CalculatorPageTemplate>
    );
}