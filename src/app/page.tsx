import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "40px 20px",
        color: "#111827",
      }}
    >
      <section style={{ marginBottom: "48px" }}>
        <h1
          style={{
            fontSize: "40px",
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: "16px",
          }}
        >
          주식 계산기 모음
        </h1>
        <p
          style={{
            fontSize: "18px",
            lineHeight: 1.7,
            color: "#4b5563",
            maxWidth: "800px",
          }}
        >
          주식 투자에 필요한 핵심 계산을 빠르게 할 수 있도록 만든 계산기 사이트입니다.
          손절가 계산, 평단가 계산, 수익률 계산 등 반복적으로 필요한 계산을 간편하게
          확인할 수 있습니다.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          marginBottom: "48px",
        }}
      >
        <Link
          href="/average-price-calculator"
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
            textDecoration: "none",
            color: "#111827",
            backgroundColor: "#fff",
          }}
        >
          <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "12px" }}>
            평단가 계산기
          </h2>
          <p style={{ color: "#4b5563", lineHeight: 1.7 }}>
            추가 매수 후 평균 매입단가가 어떻게 바뀌는지 계산할 수 있습니다.
          </p>
        </Link>

        <Link
          href="/stop-loss-calculator"
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "24px",
            textDecoration: "none",
            color: "#111827",
            backgroundColor: "#fff",
          }}
        >
          <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "12px" }}>
            손절가 계산기
          </h2>
          <p style={{ color: "#4b5563", lineHeight: 1.7 }}>
            손실 비율 기준으로 손절 가격을 계산해 리스크 관리에 활용할 수 있습니다.
          </p>
        </Link>
      </section>

      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "16px" }}>
          이 사이트에서 할 수 있는 것
        </h2>
        <div style={{ color: "#374151", lineHeight: 1.9, fontSize: "16px" }}>
          <p>• 평균 매입단가를 빠르게 계산</p>
          <p>• 손절 기준 가격을 간단하게 확인</p>
          <p>• 투자 판단 전에 필요한 수치를 반복 계산</p>
          <p>• 모바일과 PC에서 모두 간편하게 사용</p>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "16px" }}>
          안내 사항
        </h2>
        <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: "16px" }}>
          본 사이트의 계산 결과는 참고용입니다. 실제 매매 수수료, 세금, 슬리피지,
          시장 상황 등에 따라 결과가 달라질 수 있으므로 투자 전 최종 판단은 본인이
          직접 해야 합니다.
        </p>
      </section>
    </div>
  );
}