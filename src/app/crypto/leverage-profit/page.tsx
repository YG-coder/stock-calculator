import type { Metadata } from "next";
import CryptoLeverageProfitCalculator from "@/components/calculator/CryptoLeverageProfitCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["crypto-leverage-profit-calculator"];

export const metadata: Metadata = config.metadata;

export default function CryptoLeverageProfitPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CryptoLeverageProfitCalculator />
        </CalculatorPageTemplate>
    );
}