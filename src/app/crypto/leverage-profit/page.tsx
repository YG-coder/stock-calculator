import type { Metadata } from "next";
import CryptoLeverageProfitCalculator from "@/components/calculator/CryptoLeverageProfitCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import { calculatorPages } from "@/lib/calculatorPages";

import { withPageMetadata } from "@/lib/metadata";
const config = calculatorPages["crypto-leverage-profit-calculator"];

export const metadata: Metadata = withPageMetadata(config.metadata, "/crypto/leverage-profit");

export default function CryptoLeverageProfitPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CalculatorJsonLd config={config} path="/crypto/leverage-profit" />
            <CryptoLeverageProfitCalculator />
        </CalculatorPageTemplate>
    );
}