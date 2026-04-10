import type { Metadata } from "next";
import CompoundInterestCalculator from "@/components/calculator/CompoundInterestCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["compound-interest-calculator"];

export const metadata: Metadata = config.metadata;

export default function CompoundInterestCalculatorPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CompoundInterestCalculator />
        </CalculatorPageTemplate>
    );
}