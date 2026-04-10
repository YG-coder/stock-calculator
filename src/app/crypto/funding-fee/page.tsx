import type { Metadata } from "next";
import CryptoFundingFeeCalculator from "@/components/calculator/CryptoFundingFeeCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["crypto-funding-fee-calculator"];

export const metadata: Metadata = config.metadata;

export default function CryptoFundingFeePage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CryptoFundingFeeCalculator />
        </CalculatorPageTemplate>
    );
}