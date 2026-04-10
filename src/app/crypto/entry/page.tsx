import type { Metadata } from "next";
import CryptoEntryCalculator from "@/components/calculator/CryptoEntryCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["crypto-entry-calculator"];

export const metadata: Metadata = config.metadata;

export default function CryptoEntryPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CryptoEntryCalculator />
        </CalculatorPageTemplate>
    );
}