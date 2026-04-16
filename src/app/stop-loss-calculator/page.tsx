import { buildMetadata } from "@/lib/metadata";
import StopLossCalculator from "@/components/calculator/StopLossCalculator";

export const metadata = buildMetadata({
  title: "손절가 계산기",
  description:
      "매수가, 보유 수량, 손절 비율을 입력하면 손절가와 예상 손실 금액을 빠르게 계산할 수 있는 손절가 계산기입니다.",
  path: "/stop-loss-calculator",
  keywords: [
    "손절가 계산기",
    "주식 손절가 계산",
    "손절 계산기",
    "손실 금액 계산",
    "stop loss calculator",
  ],
});

export default function StopLossCalculatorPage() {
  return <StopLossCalculator />;
}