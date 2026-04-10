import type { Metadata } from "next";
import CryptoAverageCalculator from "@/components/calculator/CryptoAverageCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["crypto-average-calculator"];

export const metadata: Metadata = config.metadata;

export default function CryptoAveragePage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CryptoAverageCalculator />
        </CalculatorPageTemplate>
    );
}