import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "사이트 소개",
  description: "주식계산기.kr 사이트 소개 페이지입니다.",
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: "34px", fontWeight: 800, marginBottom: "20px" }}>
        사이트 소개
      </h1>

      <div style={{ color: "#374151", lineHeight: 1.9, fontSize: "16px" }}>
        <p>
          주식계산기.kr은 투자자가 반복적으로 사용하는 계산을 더 빠르고 쉽게 할 수
          있도록 만든 계산기 사이트입니다.
        </p>
        <p>
          손절가 계산기, 평단가 계산기 등 투자 판단 전에 필요한 기본 계산 기능을
          제공하며, 누구나 간단하게 사용할 수 있도록 직관적인 화면을 목표로
          개발했습니다.
        </p>
        <p>
          본 사이트는 투자 권유나 금융상품 판매를 목적으로 하지 않으며, 계산 결과는
          참고용 정보입니다.
        </p>
      </div>
    </div>
  );
}