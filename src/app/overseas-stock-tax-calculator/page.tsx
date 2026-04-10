import type { Metadata } from "next";
import OverseasStockTaxCalculator from "@/components/calculator/OverseasStockTaxCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["overseas-stock-tax-calculator"];

export const metadata: Metadata = config.metadata;

export default function OverseasStockTaxCalculatorPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <OverseasStockTaxCalculator />
        </CalculatorPageTemplate>
    );
}