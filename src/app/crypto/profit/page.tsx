import type { Metadata } from "next";
import CryptoProfitCalculator from "@/components/calculator/CryptoProfitCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["crypto-profit-calculator"];

export const metadata: Metadata = config.metadata;

export default function CryptoProfitPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CryptoProfitCalculator />
        </CalculatorPageTemplate>
    );
}