import type { Metadata } from "next";
import USExchangeProfitCalculator from "@/components/calculator/USExchangeProfitCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import { calculatorPages } from "@/lib/calculatorPages";

import { withPageMetadata } from "@/lib/metadata";
const config = calculatorPages["us-exchange-profit-calculator"];

export const metadata: Metadata = withPageMetadata(config.metadata, "/us-stocks/exchange-profit");

export default function USExchangeProfitPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CalculatorJsonLd config={config} path="/us-stocks/exchange-profit" />
            <USExchangeProfitCalculator />
        </CalculatorPageTemplate>
    );
}