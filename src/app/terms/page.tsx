import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  description: "주식계산기.kr 이용약관입니다.",
};

export default function TermsPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: "34px", fontWeight: 800, marginBottom: "20px" }}>
        이용약관
      </h1>

      <div style={{ color: "#374151", lineHeight: 1.9, fontSize: "16px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, marginTop: "12px" }}>
          1. 목적
        </h2>
        <p>
          이 약관은 주식계산기.kr이 제공하는 계산 도구 및 관련 서비스의 이용 조건과
          책임 사항을 규정합니다.
        </p>

        <h2 style={{ fontSize: "22px", fontWeight: 700, marginTop: "28px" }}>
          2. 서비스 내용
        </h2>
        <p>
          본 사이트는 주식 투자와 관련된 계산 기능을 제공합니다. 제공되는 정보와
          계산 결과는 참고용이며, 투자 권유를 의미하지 않습니다.
        </p>

        <h2 style={{ fontSize: "22px", fontWeight: 700, marginTop: "28px" }}>
          3. 책임 제한
        </h2>
        <p>
          이용자는 본 사이트의 계산 결과를 참고 자료로만 활용해야 하며, 실제 투자에
          대한 최종 판단과 책임은 이용자 본인에게 있습니다.
        </p>

        <h2 style={{ fontSize: "22px", fontWeight: 700, marginTop: "28px" }}>
          4. 서비스 변경
        </h2>
        <p>
          사이트 운영자는 필요에 따라 서비스 내용을 수정, 추가, 중단할 수 있습니다.
        </p>

        <h2 style={{ fontSize: "22px", fontWeight: 700, marginTop: "28px" }}>
          5. 문의
        </h2>
        <p>서비스 관련 문의는 아래 이메일로 연락해 주세요.</p>
        <p style={{ fontWeight: 700 }}>이메일: hygcorp@gmail.com</p>

        <p style={{ marginTop: "28px", color: "#6b7280" }}>
          시행일: 2026-04-07
        </p>
      </div>
    </div>
  );
}