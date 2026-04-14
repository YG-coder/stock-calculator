import React from "react";
import StopLossCalculator from "@/components/calculator/StopLossCalculator";

export const metadata = {
  title: "주식 손절가 계산기 | 손절 가격과 손실 비율 계산",
  description:
      "주식 손절가를 계산해 손실 관리 기준을 미리 정하세요. 매수가와 손절 비율을 기준으로 손절 가격을 쉽게 확인할 수 있습니다.",
};

export default function StopLossCalculatorPage() {
  return (
      <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h1>주식 손절가 계산기</h1>

        <section style={{ marginBottom: "40px" }}>
          <StopLossCalculator />
        </section>

        <section>
          <h2>주식 손절가 계산이 왜 중요한가요?</h2>
          <p>
            손절가는 예상과 다른 흐름이 나왔을 때 손실을 일정 범위 안에서 제한하기 위한 기준입니다.
            많은 개인 투자자가 손실이 커지는 이유는 매수는 계획적으로 하지만, 손절은 감정적으로 하기 때문입니다.
            주식 손절가 계산기를 활용하면 매수 전에 미리 손절 가격을 정할 수 있어 불필요한 버티기를 줄이고
            자금 관리 원칙을 지키는 데 도움이 됩니다.
          </p>
          <p>
            일반적으로 손절가는 매수가에서 일정 비율을 낮춘 가격으로 계산합니다.
            예를 들어 50,000원에 매수했고 손절 기준을 10%로 잡았다면 손절가는 45,000원이 됩니다.
            이렇게 미리 기준을 정해두면 시장이 급하게 흔들릴 때도 즉흥적으로 대응하지 않고,
            자신의 투자 원칙에 따라 움직일 수 있습니다.
          </p>

          <h2>손절가 계산 방법</h2>
          <p>
            손절가 계산의 기본 개념은 단순합니다. 현재 매수한 가격에서 내가 감당할 수 있는 손실 비율만큼
            낮춘 가격을 구하면 됩니다.
          </p>
          <p>
            <b>손절가 = 매수가 × (1 - 손절 비율)</b>
          </p>
          <p>
            예를 들어 매수가가 100,000원이고 손절 비율이 8%라면 손절가는 92,000원입니다.
            투자 스타일에 따라 3%, 5%, 8%, 10% 등 기준은 달라질 수 있지만, 중요한 것은 숫자를 미리 정하는 것입니다.
          </p>

          <h3>활용 팁</h3>
          <ul>
            <li>매수 전에 손절가를 먼저 정하고 진입하세요.</li>
            <li>종목마다 변동성이 다르므로 손절 비율도 동일하게 쓰지 않는 것이 좋습니다.</li>
            <li>손절 기준은 계좌 전체 리스크 관리와 함께 보아야 합니다.</li>
            <li>감정이 아니라 원칙으로 대응하기 위해 계산기를 활용하세요.</li>
          </ul>
        </section>

        <section style={{ marginTop: "40px" }}>
          <h2>자주 묻는 질문 (FAQ)</h2>

          <h3>Q. 손절가는 몇 퍼센트로 잡는 게 좋나요?</h3>
          <p>
            정답은 없지만 단기 매매는 보통 더 짧게, 중장기 투자나 변동성이 큰 종목은 조금 더 넓게 잡기도 합니다.
            중요한 것은 자신의 투자 원칙에 맞는 기준을 일관되게 적용하는 것입니다.
          </p>

          <h3>Q. 손절을 꼭 해야 하나요?</h3>
          <p>
            모든 상황에서 기계적으로 해야 한다고 볼 수는 없지만, 손절 기준이 없으면 손실이 커질 가능성이 높습니다.
            특히 단기 매매에서는 손절 원칙이 매우 중요합니다.
          </p>

          <h3>Q. 손절가 계산기와 수익률 계산기는 어떻게 다르나요?</h3>
          <p>
            수익률 계산기는 현재 수익 또는 손실 상태를 확인하는 용도이고, 손절가 계산기는 앞으로 어디서 손실을 제한할지
            기준 가격을 정하는 용도입니다.
          </p>
        </section>

        <section style={{ marginTop: "40px" }}>
          <h3>다른 계산기도 함께 사용해보세요</h3>
          <ul>
            <li><a href="/profit-calculator">주식 수익률 계산기</a></li>
            <li><a href="/average-price-calculator">주식 평단가 계산기</a></li>
            <li><a href="/target-price-calculator">주식 목표가 계산기</a></li>
          </ul>
        </section>

        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "주식 손절가 계산기",
                applicationCategory: "FinanceApplication",
                operatingSystem: "All",
              }),
            }}
        />

        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "손절가는 몇 퍼센트로 잡는 게 좋나요?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "정답은 없지만 투자 스타일과 종목 변동성에 따라 기준이 달라집니다. 중요한 것은 일관된 원칙을 세우는 것입니다.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "손절을 꼭 해야 하나요?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "손절 기준이 없으면 손실이 커질 가능성이 높습니다. 특히 단기 매매에서는 손절 원칙이 중요합니다.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "손절가 계산기와 수익률 계산기는 어떻게 다르나요?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "수익률 계산기는 현재 손익 상태를 확인하는 용도이고, 손절가 계산기는 앞으로 손실 제한 기준 가격을 정하는 용도입니다.",
                    },
                  },
                ],
              }),
            }}
        />
      </main>
  );
}