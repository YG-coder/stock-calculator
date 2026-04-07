import type { Metadata } from "next";
import { PageHeader, SectionCard, Article } from "@/components/ui/Shared";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "주식계산기.kr 개인정보처리방침입니다.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <PageHeader 
        badge="정책 정보" 
        title="개인정보처리방침" 
        description="주식계산기.kr은 이용자의 개인정보를 안전하게 보호하기 위해 최선을 다하고 있습니다." 
      />

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <SectionCard>
          <Article title="1. 수집하는 개인정보 항목">
            <p className="mt-2">
              본 사이트는 계산 기능을 제공하는 데 있어 별도의 회원가입 절차를 요구하지 않으며,
              개인 식별이 가능한 어떠한 형태의 민감한 개인정보도 수집하지 않습니다.
            </p>
          </Article>
          
          <Article title="2. 쿠키(Cookie) 및 브라우저 저장소 사용">
            <p className="mt-2">
              보다 나은 사용자 경험을 위해 로컬 스토리지(Local Storage) 기능을 사용하여 
              사용자가 마지막으로 입력한 계산 수치 일부를 사용자 기기에만 기록할 수 있으나, 
              이는 서버로 전송되거나 제3자에게 제공되지 않습니다.
            </p>
          </Article>
          
          <Article title="3. 타사 광고 파트너(Google AdSense)">
            <p className="mt-2">
              본 사이트는 타사 광고 공급업체(예: Google)가 쿠키를 사용해 귀하가 본 웹사이트 및 
              웹상의 다른 사이트를 과거에 방문한 내역을 기반으로 광고를 게재할 수 있습니다. 
              사용자는 Google 광고 설정에서 맞춤 광고를 선택 해제할 수 있습니다.
            </p>
          </Article>
        </SectionCard>
      </div>
    </main>
  );
}