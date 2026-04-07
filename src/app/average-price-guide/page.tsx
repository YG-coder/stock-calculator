import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "주식 평단가 계산 방법",
  description:
    "주식 평단가 계산 방법과 물타기 후 평균 매입단가 계산 공식을 예시와 함께 쉽게 설명합니다.",
  keywords: ["주식 평단가 계산", "평단가 계산기", "물타기 계산", "주식 평균단가"],
};

export default function AveragePriceGuidePage() {
  return (
    <main style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto", color: "#111827" }}>
      <h1 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "20px" }}>
        주식 평단가 계산 방법
      </h1>

      <p style={{ fontSize: "17px", lineHeight: 1.9, color: "#374151", marginBottom: "18px" }}>
        주식 투자에서 평단가(평균 매입 단가)는 매우 중요한 개념입니다.
        추가 매수 또는 물타기를 했을 때 현재 보유 주식의 평균 단가가 얼마인지 정확히 알아야
        손익분기점과 향후 대응 전략을 세울 수 있습니다.
      </p>

      <h2 style={{ fontSize: "26px", fontWeight: 800, marginTop: "32px", marginBottom: "14px" }}>
        평단가란 무엇인가?
      </h2>
      <p style={{ fontSize: "16px", lineHeight: 1.9, color: "#4b5563" }}>
        평단가는 여러 번 나눠서 매수한 주식의 평균 매입 가격을 뜻합니다.
        예를 들어 같은 종목을 처음에는 10,000원에 사고, 나중에는 8,000원에 추가로 샀다면
        단순히 마지막 가격만 보는 것이 아니라 전체 평균 단가를 계산해야 합니다.
      </p>

      <h2 style={{ fontSize: "26px", fontWeight: 800, marginTop: "32px", marginBottom: "14px" }}>
        평단가 계산 공식
      </h2>
      <div
        style={{
          backgroundColor: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "20px",
          fontSize: "18px",
          fontWeight: 700,
          marginBottom: "16px",
        }}
      >
        평단가 = 총 매수 금액 ÷ 총 보유 주식 수
      </div>

      <p style={{ fontSize: "16px", lineHeight: 1.9, color: "#4b5563" }}>
        총 매수 금액은 각 매수 금액의 합계이고, 총 보유 주식 수는 현재 보유 중인 전체 수량입니다.
      </p>

      <h2 style={{ fontSize: "26px", fontWeight: 800, marginTop: "32px", marginBottom: "14px" }}>
        계산 예시
      </h2>
      <div style={{ color: "#374151", lineHeight: 1.9, fontSize: "16px" }}>
        <p>• 1차 매수: 100주 × 10,000원 = 1,000,000원</p>
        <p>• 2차 매수: 100주 × 8,000원 = 800,000원</p>
        <p>• 총 매수 금액: 1,800,000원</p>
        <p>• 총 보유 주식 수: 200주</p>
      </div>

      <div
        style={{
          marginTop: "16px",
          backgroundColor: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: "12px",
          padding: "20px",
          fontSize: "18px",
          fontWeight: 700,
        }}
      >
        평단가 = 1,800,000원 ÷ 200주 = 9,000원
      </div>

      <h2 style={{ fontSize: "26px", fontWeight: 800, marginTop: "32px", marginBottom: "14px" }}>
        평단가를 꼭 알아야 하는 이유
      </h2>
      <div style={{ color: "#4b5563", lineHeight: 1.9, fontSize: "16px" }}>
        <p>• 현재 수익 중인지 손실 중인지 정확하게 판단할 수 있습니다.</p>
        <p>• 추가 매수의 효과를 수치로 확인할 수 있습니다.</p>
        <p>• 목표가와 손절가를 설정할 때 기준 가격이 됩니다.</p>
        <p>• 감정적인 매매 대신 계산에 기반한 판단을 할 수 있습니다.</p>
      </div>

      <h2 style={{ fontSize: "26px", fontWeight: 800, marginTop: "32px", marginBottom: "14px" }}>
        물타기할 때 주의할 점
      </h2>
      <p style={{ fontSize: "16px", lineHeight: 1.9, color: "#4b5563" }}>
        평단가가 낮아진다고 해서 무조건 좋은 것은 아닙니다.
        기업의 펀더멘털, 시장 흐름, 거래량, 손절 기준 등을 함께 고려해야 하며,
        단순히 평단가를 낮추기 위해 무리하게 추가 매수하는 것은 위험할 수 있습니다.
      </p>

      <div style={{ marginTop: "40px" }}>
        <Link
          href="/average-price-calculator"
          style={{
            display: "inline-block",
            backgroundColor: "#111827",
            color: "#fff",
            textDecoration: "none",
            padding: "14px 20px",
            borderRadius: "12px",
            fontWeight: 700,
          }}
        >
          평단가 계산기 바로가기
        </Link>
      </div>
    </main>
  );
}