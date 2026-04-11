import type { Metadata } from "next";
import USDividendCalculator from "@/components/calculator/USDividendCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["us-dividend-calculator"];

export const metadata: Metadata = config.metadata;

export default function USDividendPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <USDividendCalculator />
        </CalculatorPageTemplate>
    );
}