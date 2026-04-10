import type { Metadata } from "next";
import CryptoLiquidationCalculator from "@/components/calculator/CryptoLiquidationCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["crypto-liquidation-calculator"];

export const metadata: Metadata = config.metadata;

export default function CryptoLiquidationPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CryptoLiquidationCalculator />
        </CalculatorPageTemplate>
    );
}