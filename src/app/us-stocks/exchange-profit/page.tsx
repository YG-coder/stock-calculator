import type { Metadata } from "next";
import USExchangeProfitCalculator from "@/components/calculator/USExchangeProfitCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["us-exchange-profit-calculator"];

export const metadata: Metadata = config.metadata;

export default function USExchangeProfitPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <USExchangeProfitCalculator />
        </CalculatorPageTemplate>
    );
}