/**
 * src/app/about/page.tsx
 * 역할: 사이트 소개 (애드센스 승인용 SEO 강화 버전)
 */

import { buildMetadata } from "@/lib/metadata";
import { PageHeader, SectionCard, Article } from "@/components/ui/Shared";

export const metadata = buildMetadata({
  title: "사이트 소개",
  description:
      "주식계산기.kr은 수익률, 평단가, 손절가, 목표가 등을 빠르게 계산할 수 있는 무료 주식 계산기 사이트입니다.",
  path: "/about",
});

export default function AboutPage() {
  return (
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
        <PageHeader
            badge="사이트 안내"
            title="주식계산기.kr 소개"
            description="투자 판단에 필요한 핵심 계산을 쉽고 빠르게 확인할 수 있도록 만든 무료 주식 계산기 서비스입니다."
        />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
          <div className="space-y-8">

            {/* 1. 사이트 설명 */}
            <SectionCard>
              <Article title="주식계산기.kr이 하는 일">
                <p className="mt-2">
                  <strong>주식계산기.kr</strong>은 수익률 계산기, 평단가 계산기,
                  손절가 계산기, 목표가 계산기, 손익비 계산기, 배당 계산기,
                  복리 계산기 등 투자자가 자주 사용하는 금융 계산기를
                  한 곳에서 제공하는 웹 기반 서비스입니다.
                </p>

                {/* 🔥 SEO 키워드 강화 */}
                <p className="mt-3">
                  주식 계산기, 수익률 계산기, 평단가 계산기, 손절가 계산기 등
                  다양한 투자 계산 도구를 통해 빠르고 정확한 투자 판단을 돕습니다.
                </p>

                <p className="mt-3">
                  복잡한 엑셀을 따로 만들지 않아도 브라우저에서 즉시 계산이 가능하며,
                  투자 의사결정을 보다 객관적으로 할 수 있도록 지원합니다.
                </p>
              </Article>
            </SectionCard>

            {/* 2. 필요성 */}
            <SectionCard>
              <Article title="이 사이트가 필요한 이유">
                <p className="mt-2">
                  많은 개인 투자자는 수익률이나 평균 단가를 대략적으로 계산하거나,
                  매번 계산기를 따로 사용해야 하는 불편함을 겪습니다.
                </p>
                <p className="mt-3">
                  하지만 실제 투자에서는 작은 계산 실수가 큰 손실로 이어질 수 있습니다.
                  주식계산기.kr은 이런 문제를 해결하기 위해 자주 사용하는 계산을
                  빠르게 수행할 수 있도록 설계되었습니다.
                </p>
                <p className="mt-3">
                  특히 분할 매수, 손절 기준 설정, 배당 투자, 리스크 관리 등에서
                  핵심 숫자를 빠르게 확인할 수 있도록 돕습니다.
                </p>
              </Article>
            </SectionCard>

            {/* 3. 활용 방법 (체류시간 증가용) */}
            <SectionCard>
              <Article title="활용 방법">
                <p className="mt-2">
                  주식계산기 사이트는 다음과 같은 흐름으로 활용하면 효과적입니다.
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>평단가 계산기로 평균 매입 단가 계산</li>
                  <li>수익률 계산기로 현재 수익 상태 확인</li>
                  <li>목표가 계산기로 매도 전략 설정</li>
                  <li>손절가 계산기로 리스크 관리</li>
                </ul>
              </Article>
            </SectionCard>

            {/* 4. 면책 */}
            <SectionCard>
              <Article title="안내 및 면책">
                <p className="mt-2">
                  본 사이트에서 제공하는 계산 결과는 입력값을 기반으로 한 참고용
                  정보입니다. 실제 투자 결과는 수수료, 세금, 시장 상황 등에 따라
                  달라질 수 있습니다.
                </p>
                <p className="mt-3">
                  본 사이트는 투자 권유를 목적으로 하지 않으며, 최종 투자 판단과
                  책임은 사용자 본인에게 있습니다.
                </p>
              </Article>
            </SectionCard>

            {/* 5. 내부 링크 (🔥 핵심) */}
            <SectionCard>
              <Article title="주요 계산기 바로가기">
                <ul className="space-y-2 text-sm mt-3">
                  <li><a href="/profit-calculator" className="hover:underline">주식 수익률 계산기</a></li>
                  <li><a href="/average-price-calculator" className="hover:underline">평단가 계산기</a></li>
                  <li><a href="/target-price-calculator" className="hover:underline">목표가 계산기</a></li>
                  <li><a href="/dividend-calculator" className="hover:underline">배당 수익 계산기</a></li>
                </ul>
              </Article>
            </SectionCard>

            {/* 6. 문의 */}
            <SectionCard>
              <Article title="문의">
                <p className="mt-2">
                  오류 제보, 기능 요청, 제휴 문의는 아래 이메일로 연락해 주세요.
                </p>
                <p className="mt-4">
                  이메일:{" "}
                  <a
                      href="mailto:support@주식계산기.kr"
                      className="font-semibold text-slate-800 underline-offset-2 hover:underline"
                  >
                    support@주식계산기.kr
                  </a>
                </p>
              </Article>
            </SectionCard>

          </div>
        </div>
      </main>
  );
}