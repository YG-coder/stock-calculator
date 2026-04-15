// src/app/terms/page.tsx
import { buildMetadata } from "@/lib/metadata";
import { PageHeader, SectionCard, Article } from "@/components/ui/Shared";

export const metadata = buildMetadata({
  title: "이용약관",
  description: "주식계산기.kr 서비스 이용약관입니다.",
  path: "/terms",
});

export default function TermsPage() {
  return (
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
        <PageHeader
            badge="정책 정보"
            title="이용약관"
            description="주식계산기.kr의 책임 한계와 서비스 이용 기준을 안내합니다."
        />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
          <SectionCard>
            <Article title="1. 서비스 목적">
              <p className="mt-2">
                주식계산기.kr은 투자 및 재무 활동에서 자주 사용되는 기초적인 계산을
                쉽고 빠르게 확인할 수 있도록 돕는 참고용 계산기 서비스입니다.
              </p>
            </Article>

            <Article title="2. 계산 결과의 성격">
              <p className="mt-2">
                본 사이트에서 제공하는 수익률, 평균단가, 손절가, 손익비, 배당수익,
                복리 결과 등은 사용자가 입력한 값에 따라 산출되는 참고용 계산
                결과입니다. 실제 거래 수수료, 세금, 슬리피지, 환율, 배당 정책,
                시장 상황 등에 따라 실제 결과와 차이가 발생할 수 있습니다.
              </p>
            </Article>

            <Article title="3. 투자 책임의 부인">
              <p className="mt-2">
                본 사이트의 정보와 계산 결과는 투자 권유 또는 재무 자문이 아니며,
                투자 수익을 보장하지 않습니다. 최종적인 투자 판단과 그 결과에 대한
                책임은 전적으로 사용자 본인에게 있습니다.
              </p>
            </Article>

            <Article title="4. 서비스 변경 및 중단">
              <p className="mt-2">
                운영 정책 또는 기술적 사정에 따라 서비스가 일시적으로 중단되거나
                계산 공식, 페이지 구성, 콘텐츠가 변경될 수 있습니다.
              </p>
            </Article>

            <Article title="5. 지적재산권">
              <p className="mt-2">
                본 사이트에 포함된 텍스트, 디자인, 코드, 계산 구조 및 기타 콘텐츠의
                권리는 운영자에게 있으며, 사전 허가 없이 무단 복제, 재배포, 상업적
                이용을 할 수 없습니다.
              </p>
            </Article>

            <Article title="6. 문의">
              <p className="mt-2">
                서비스 이용과 관련한 문의 사항은 아래 이메일로 접수하실 수
                있습니다.
              </p>
              <p className="mt-4">
                이메일:{" "}
                <a
                    href="mailto:help@주식계산기.kr"
                    className="font-semibold text-slate-800 underline-offset-2 hover:underline"
                >
                  help@주식계산기.kr
                </a>
              </p>
            </Article>
          </SectionCard>
        </div>
      </main>
  );
}