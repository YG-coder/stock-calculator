import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의하기",
  description: "주식계산기.kr 문의 페이지입니다.",
};

export default function ContactPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: "34px", fontWeight: 800, marginBottom: "20px" }}>
        문의하기
      </h1>

      <div style={{ color: "#374151", lineHeight: 1.9, fontSize: "16px" }}>
        <p>
          사이트 이용 중 오류, 제안, 문의사항이 있으시면 아래 이메일로 연락해 주세요.
        </p>
        <p style={{ marginTop: "16px", fontWeight: 700 }}>
          이메일: hygcorp@gmail.com
        </p>
        <p style={{ marginTop: "16px" }}>
          가능한 범위 내에서 빠르게 확인 후 답변드리겠습니다.
        </p>
      </div>
    </div>
  );
}