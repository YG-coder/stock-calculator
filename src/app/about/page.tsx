// src/app/about/page.tsx
import { buildMetadata } from "@/lib/metadata";
import { PageHeader, SectionCard, Article } from "@/components/ui/Shared";

export const metadata = buildMetadata({
  title: "사이트 소개",
  description:
      "주식계산기.kr은 투자에 필요한 핵심 계산을 빠르게 확인할 수 있도록 돕는 무료 계산기 사이트입니다.",
  path: "/about",
});

export default function AboutPage() {
  return (
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
        <PageHeader
            badge="사이트 안내"
            title="주식계산기.kr 소개"
            description="투자 판단에 필요한 기초 계산을 쉽고 빠르게 확인할 수 있도록 만든 무료 주식 계산기 서비스입니다."
        />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
          <div className="space-y-8">
            <SectionCard>
              <Article title="주식계산기.kr이 하는 일">
                <p className="mt-2">
                  주식계산기.kr은 수익률, 평단가, 손절가, 목표가, 손익비, 배당수익,
                  복리 계산 등 투자자가 자주 사용하는 계산을 빠르게 확인할 수 있도록
                  만든 웹 기반 계산기 서비스입니다. 복잡한 엑셀 파일을 따로 만들지
                  않아도 브라우저에서 바로 계산할 수 있도록 구성했습니다.
                </p>
                <p className="mt-3">
                  투자에서는 숫자를 정확하게 보는 습관이 매우 중요합니다. 단순히
                  감으로 매매하기보다, 현재 수익률이 얼마인지, 물타기 후 평균단가가
                  어떻게 변하는지, 몇 퍼센트 손실이 나면 본전 회복에 얼마가 필요한지
                  계산해 보는 것만으로도 의사결정의 질이 달라질 수 있습니다.
                </p>
              </Article>
            </SectionCard>

            <SectionCard>
              <Article title="이 사이트가 필요한 이유">
                <p className="mt-2">
                  많은 개인 투자자는 수익률, 평단가, 손절 기준을 머릿속으로 대충
                  계산하거나, 매번 계산기를 따로 열어 복잡한 식을 입력합니다. 하지만
                  실제 투자에서는 빠르고 정확한 계산이 중요합니다. 주식계산기.kr은
                  이런 불편을 줄이기 위해 자주 쓰는 계산을 한 곳에 모았습니다.
                </p>
                <p className="mt-3">
                  특히 단기 매매나 분할 매수, 배당 투자, 리스크 관리에서는 계산
                  실수가 곧 손실로 이어질 수 있습니다. 이 사이트는 투자자가 핵심 숫자를
                  빠르게 확인하고, 보다 일관된 기준으로 판단할 수 있도록 돕는 보조
                  도구를 목표로 합니다.
                </p>
              </Article>
            </SectionCard>

            <SectionCard>
              <Article title="안내 및 면책">
                <p className="mt-2">
                  본 사이트에서 제공하는 계산 결과는 사용자가 입력한 값에 기반한
                  참고용 정보입니다. 실제 투자 결과는 거래 수수료, 세금, 슬리피지,
                  환율, 배당 정책, 시장 상황 등 여러 요소에 따라 달라질 수 있습니다.
                  따라서 본 사이트의 계산 결과는 투자 권유나 재무 자문으로 해석되지
                  않으며, 최종적인 투자 판단과 책임은 사용자 본인에게 있습니다.
                </p>
              </Article>
            </SectionCard>

            <SectionCard>
              <Article title="문의">
                <p className="mt-2">
                  사이트 이용 중 오류 제보, 개선 의견, 기능 제안, 제휴 문의가 있다면
                  아래 이메일로 연락해 주세요.
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