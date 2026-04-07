import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "물타기 계산 방법",
  description:
    "물타기 계산 방법과 추가 매수 전 반드시 확인해야 할 평균 단가, 투자 금액, 리스크를 설명합니다.",
  keywords: ["물타기 계산", "물타기 계산기", "추가매수 계산", "평단가 낮추기"],
};

export default function WaterBuyingGuidePage() {
  return (
    <main style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto", color: "#111827" }}>
      <h1 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "20px" }}>
        물타기 계산 방법
      </h1>

      <p style={{ fontSize: "17px", lineHeight: 1.9, color: "#374151", marginBottom: "18px" }}>
        물타기는 주가가 하락했을 때 추가 매수를 통해 평균 매입 단가를 낮추는 전략입니다.
        하지만 무조건 물타기를 하는 것은 위험할 수 있기 때문에,
        추가 매수 전에 반드시 계산과 기준을 먼저 확인해야 합니다.
      </p>

      <h2 style={{ fontSize: "26px", fontWeight: 800, marginTop: "32px", marginBottom: "14px" }}>
        물타기란 무엇인가?
      </h2>
      <p style={{ fontSize: "16px", lineHeight: 1.9, color: "#4b5563" }}>
        처음 산 가격보다 낮은 가격에서 추가로 매수해 평균 단가를 내리는 것을 말합니다.
        예를 들어 10,000원에 매수한 종목이 8,000원으로 떨어졌을 때
        추가 매수를 하면 평단가가 낮아집니다.
      </p>

      <h2 style={{ fontSize: "26px", fontWeight: 800, marginTop: "32px", marginBottom: "14px" }}>
        물타기 계산에서 가장 중요한 것
      </h2>
      <div style={{ color: "#4b5563", lineHeight: 1.9, fontSize: "16px" }}>
        <p>• 현재 보유 수량</p>
        <p>• 현재 평균 매입단가</p>
        <p>• 추가 매수 가격</p>
        <p>• 추가 매수 수량</p>
        <p>• 추가 자금 투입 후 새로운 평단가</p>
      </div>

      <h2 style={{ fontSize: "26px", fontWeight: 800, marginTop: "32px", marginBottom: "14px" }}>
        계산 예시
      </h2>
      <div style={{ color: "#374151", lineHeight: 1.9, fontSize: "16px" }}>
        <p>• 기존 보유: 100주, 평단가 10,000원</p>
        <p>• 추가 매수: 100주, 가격 8,000원</p>
      </div>

      <p style={{ fontSize: "16px", lineHeight: 1.9, color: "#4b5563", marginTop: "12px" }}>
        기존 매수 금액은 1,000,000원이고, 추가 매수 금액은 800,000원입니다.
        총 매수 금액은 1,800,000원, 총 보유 수량은 200주가 되어
        새로운 평단가는 9,000원이 됩니다.
      </p>

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
        새로운 평단가 = 1,800,000원 ÷ 200주 = 9,000원
      </div>

      <h2 style={{ fontSize: "26px", fontWeight: 800, marginTop: "32px", marginBottom: "14px" }}>
        물타기 전에 꼭 확인해야 할 것
      </h2>
      <div style={{ color: "#4b5563", lineHeight: 1.9, fontSize: "16px" }}>
        <p>• 단순 하락인지, 기업 자체의 문제인지</p>
        <p>• 추가 매수 후 전체 자금 비중이 과도해지지 않는지</p>
        <p>• 손절 기준이 무너진 상태는 아닌지</p>
        <p>• 반등 가능성보다 손실 확대 가능성이 더 큰 것은 아닌지</p>
      </div>

      <h2 style={{ fontSize: "26px", fontWeight: 800, marginTop: "32px", marginBottom: "14px" }}>
        물타기가 항상 좋은 전략은 아니다
      </h2>
      <p style={{ fontSize: "16px", lineHeight: 1.9, color: "#4b5563" }}>
        물타기는 평단가를 낮춰주는 효과는 있지만, 잘못하면 손실 구간에서 비중만 늘리는 결과가 될 수 있습니다.
        따라서 기업 분석, 시장 흐름, 손절 기준, 자금 관리 원칙을 함께 고려해야 합니다.
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
          평단가 계산기로 물타기 계산하기
        </Link>
      </div>
    </main>
  );
}