// src/app/privacy/page.tsx
import { buildMetadata } from "@/lib/metadata";
import { PageHeader, SectionCard, Article } from "@/components/ui/Shared";

export const metadata = buildMetadata({
  title: "개인정보처리방침",
  description: "주식계산기.kr 개인정보처리방침입니다.",
  path: "/privacy",
});

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
                본 사이트는 계산 기능을 제공하는 과정에서 별도의 회원가입을 요구하지
                않으며, 개인을 직접 식별할 수 있는 민감한 개인정보를 수집하지
                않습니다.
              </p>
            </Article>

            <Article title="2. 입력 데이터 처리 방식">
              <p className="mt-2">
                사용자가 입력하는 매수가, 매도가, 수량, 배당금, 손절 기준 등의 계산
                값은 브라우저 내에서 처리되며, 별도의 회원 데이터로 저장되지
                않습니다.
              </p>
            </Article>

            <Article title="3. 쿠키 및 브라우저 저장소 사용">
              <p className="mt-2">
                더 나은 사용자 경험을 위해 로컬 스토리지 기능을 사용하여 마지막 입력
                값 일부를 사용자 기기에만 저장할 수 있습니다. 이 정보는 서버로
                전송되거나 제3자에게 제공되지 않습니다.
              </p>
            </Article>

            <Article title="4. 광고 서비스 이용">
              <p className="mt-2">
                본 사이트는 Google AdSense와 같은 제3자 광고 서비스를 사용할 수
                있으며, 광고 제공 과정에서 쿠키가 사용될 수 있습니다. 사용자는
                브라우저 설정 또는 Google 광고 설정을 통해 맞춤 광고를 제한할 수
                있습니다.
              </p>
            </Article>

            <Article title="5. 외부 링크">
              <p className="mt-2">
                본 사이트는 참고용 정보 제공을 위해 외부 사이트 링크를 포함할 수
                있습니다. 외부 사이트의 개인정보처리방침과 운영 방식은 본 사이트와
                무관하므로, 해당 사이트의 정책을 별도로 확인하시기 바랍니다.
              </p>
            </Article>

            <Article title="6. 문의">
              <p className="mt-2">
                개인정보 처리와 관련한 문의는 아래 이메일로 접수하실 수 있습니다.
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