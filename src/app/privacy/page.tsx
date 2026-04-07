import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "주식계산기.kr 개인정보처리방침입니다.",
};

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: "34px", fontWeight: 800, marginBottom: "20px" }}>
        개인정보처리방침
      </h1>

      <div style={{ color: "#374151", lineHeight: 1.9, fontSize: "16px" }}>
        <p>
          주식계산기.kr은 이용자의 개인정보를 중요하게 생각하며, 관련 법령을
          준수합니다.
        </p>

        <h2 style={{ fontSize: "22px", fontWeight: 700, marginTop: "28px" }}>
          1. 수집하는 정보
        </h2>
        <p>
          본 사이트는 별도의 회원가입 기능을 제공하지 않으며, 기본적으로 사용자의
          이름이나 연락처와 같은 개인정보를 직접 수집하지 않습니다.
        </p>

        <h2 style={{ fontSize: "22px", fontWeight: 700, marginTop: "28px" }}>
          2. 자동 수집 정보
        </h2>
        <p>
          사이트 이용 과정에서 브라우저 정보, 접속 시간, IP 주소, 쿠키 등의 정보가
          자동으로 수집될 수 있습니다. 이는 서비스 운영, 통계 분석, 광고 제공을 위한
          목적으로 활용될 수 있습니다.
        </p>

        <h2 style={{ fontSize: "22px", fontWeight: 700, marginTop: "28px" }}>
          3. 광고 및 쿠키 사용
        </h2>
        <p>
          본 사이트는 Google AdSense와 같은 제3자 광고 서비스를 사용할 수 있으며,
          광고 제공 과정에서 쿠키가 사용될 수 있습니다.
        </p>

        <h2 style={{ fontSize: "22px", fontWeight: 700, marginTop: "28px" }}>
          4. 문의
        </h2>
        <p>개인정보 관련 문의는 아래 이메일로 연락해 주세요.</p>
        <p style={{ fontWeight: 700 }}>이메일: hygcorp@gmail.com</p>

        <p style={{ marginTop: "28px", color: "#6b7280" }}>
          시행일: 2026-04-07
        </p>
      </div>
    </div>
  );
}