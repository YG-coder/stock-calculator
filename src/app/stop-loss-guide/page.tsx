import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "손절가 계산 기준",
  description:
    "손절가 계산 기준과 손실 비율에 따른 손절 가격 설정 방법을 쉽게 설명합니다.",
  keywords: ["손절가 계산", "손절가 계산기", "주식 손절 기준", "손실 비율 계산"],
};

export default function StopLossGuidePage() {
  return (
    <main style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto", color: "#111827" }}>
      <h1 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "20px" }}>
        손절가 계산 기준
      </h1>

      <p style={{ fontSize: "17px", lineHeight: 1.9, color: "#374151", marginBottom: "18px" }}>
        주식 투자에서 손절가는 손실을 제한하기 위해 미리 정해두는 기준 가격입니다.
        손절 기준이 없으면 작은 손실이 큰 손실로 번질 수 있기 때문에,
        매수 전에 손절 가격을 계산해 두는 습관이 중요합니다.
      </p>

      <h2 style={{ fontSize: "26px", fontWeight: 800, marginTop: "32px", marginBottom: "14px" }}>
        손절가란 무엇인가?
      </h2>
      <p style={{ fontSize: "16px", lineHeight: 1.9, color: "#4b5563" }}>
        손절가는 내가 감당할 수 있는 최대 손실 범위를 넘기기 전에 매도할 가격입니다.
        예를 들어 매수가가 10,000원이고 손절 기준을 5%로 잡았다면,
        9,500원 부근이 손절가가 됩니다.
      </p>

      <h2 style={{ fontSize: "26px", fontWeight: 800, marginTop: "32px", marginBottom: "14px" }}>
        손절가 계산 공식
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
        손절가 = 매수가 × (1 - 손절 비율)
      </div>

      <h2 style={{ fontSize: "26px", fontWeight: 800, marginTop: "32px", marginBottom: "14px" }}>
        계산 예시
      </h2>
      <div style={{ color: "#374151", lineHeight: 1.9, fontSize: "16px" }}>
        <p>• 매수가: 10,000원</p>
        <p>• 손절 비율: 5%</p>
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
        손절가 = 10,000 × (1 - 0.05) = 9,500원
      </div>

      <h2 style={{ fontSize: "26px", fontWeight: 800, marginTop: "32px", marginBottom: "14px" }}>
        손절 기준을 미리 정해야 하는 이유
      </h2>
      <div style={{ color: "#4b5563", lineHeight: 1.9, fontSize: "16px" }}>
        <p>• 감정적인 버티기 매매를 줄일 수 있습니다.</p>
        <p>• 손실 규모를 일정 범위 안에서 관리할 수 있습니다.</p>
        <p>• 계좌 전체 리스크를 통제하는 데 도움이 됩니다.</p>
        <p>• 다음 매매 기회를 위한 현금 보존이 가능합니다.</p>
      </div>

      <h2 style={{ fontSize: "26px", fontWeight: 800, marginTop: "32px", marginBottom: "14px" }}>
        손절 비율은 어떻게 정할까?
      </h2>
      <p style={{ fontSize: "16px", lineHeight: 1.9, color: "#4b5563" }}>
        손절 비율은 종목의 변동성, 자신의 투자 성향, 매매 기간에 따라 달라질 수 있습니다.
        단타 매매는 더 짧게, 중장기 투자는 차트 지지선과 기업 상황을 함께 고려해
        손절 기준을 설정하는 경우가 많습니다.
      </p>

      <h2 style={{ fontSize: "26px", fontWeight: 800, marginTop: "32px", marginBottom: "14px" }}>
        손절가 계산 시 주의할 점
      </h2>
      <p style={{ fontSize: "16px", lineHeight: 1.9, color: "#4b5563" }}>
        실제 매매에서는 수수료, 세금, 급격한 변동성, 호가 공백 등으로 인해
        계산한 손절가와 실제 체결가가 다를 수 있습니다.
        따라서 참고용 기준으로 활용하되, 시장 상황도 함께 확인해야 합니다.
      </p>

      <div style={{ marginTop: "40px" }}>
        <Link
          href="/stop-loss-calculator"
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
          손절가 계산기 바로가기
        </Link>
      </div>
    </main>
  );
}