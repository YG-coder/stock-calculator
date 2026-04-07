import type { Metadata } from "next";
import { PageHeader, SectionCard, Article } from "@/components/ui/Shared";

export const metadata: Metadata = {
  title: "이용약관",
  description: "주식계산기.kr 서비스 이용약관입니다.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <PageHeader 
        badge="정책 정보" 
        title="이용약관" 
        description="주식계산기.kr의 책임 한계와 서비스 이용 동의 규정입니다." 
      />

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <SectionCard>
          <Article title="1. 서비스 목적">
            <p className="mt-2">
              주식계산기.kr은 투자 및 재무 활동에서 자주 사용되는 기초적인 수학 계산 결과를 
              편리하게 조회할 수 있도록 돕는 단순 보조 도구 모음입니다.
            </p>
          </Article>
          
          <Article title="2. 투자 책임의 부인">
            <p className="mt-2">
              본 사이트에서 산출되는 모든 수익률, 단가, 권장 사이즈 등의 결괏값은 참조용이며, 
              투자 수익을 어떠한 경우에도 보장하지 않습니다. 
              실제 증권 거래 시 발생하는 수수료, 세금, 슬리피지 등으로 인해 시장 결과와 오차가 발생할 수 있습니다. <br/>
              <b>최종적인 매매의 결정과 그 결과에 따른 모든 책임은 전적으로 거래를 수행한 투자자 본인에게 있습니다.</b>
            </p>
          </Article>
          
          <Article title="3. 서비스 중단 및 변경">
            <p className="mt-2">
              본 웹사이트의 운영 정책 내지는 관리 측의 사정에 따라 통보 없이 일시적으로 서비스가 중단되거나 
              수식(공식) 업데이트로 인해 결괏값이 변경될 수 있습니다.
            </p>
          </Article>
        </SectionCard>
      </div>
    </main>
  );
}