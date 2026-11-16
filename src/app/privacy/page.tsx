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
          <p className="mb-6 text-sm text-slate-500">
            시행일: 2026년 8월 23일 · 최종 개정일: 2026년 11월 16일
          </p>

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
                값은 <strong>이용자의 브라우저 안에서만 처리</strong>됩니다. 계산을 위해
                입력한 값이 서버로 전송되거나 저장되지 않으며, 페이지를 벗어나면
                사라집니다.
              </p>
            </Article>

            <Article title="3. 쿠키 및 브라우저 저장소 사용">
              <p className="mt-2">
                본 사이트는 계산 기능을 위해 자체적으로 쿠키를 설정하지 않으며,
                작성 시점 기준으로 이용자의 입력값을 브라우저 저장소에 보관하지
                않습니다. 향후 마지막 입력값을 기억하는 편의 기능을 추가하는 경우,
                해당 정보는 이용자 기기에만 저장되며 서버로 전송되지 않습니다.
              </p>
            </Article>

            <Article title="4. 광고 서비스 이용">
              <p className="mt-2">
                본 사이트에서 <strong>Google AdSense</strong>를 통해 광고를 게재하는 경우,
                Google과 제3자 광고 사업자는 이용자의 브라우저에 쿠키를 설정하거나 읽고,
                웹 비콘과 같은 기술을 사용할 수 있습니다. 방문 페이지의 주소나 IP 주소 등은
                광고 제공과 효과 측정에 쓰일 수 있으며, 쿠키를 통해 본 사이트나 다른
                사이트의 이전 방문 기록을 바탕으로 맞춤 광고가 표시될 수 있습니다.
              </p>
              <p className="mt-2">
                이용자는{" "}
                <a
                    href="https://adssettings.google.com/"
                    className="font-semibold text-slate-800 underline-offset-2 hover:underline"
                >
                  Google 광고 설정
                </a>
                에서 개인 맞춤 광고를 끌 수 있습니다. 참여 광고 사업자의 맞춤 광고는{" "}
                <a
                    href="https://optout.aboutads.info/"
                    className="font-semibold text-slate-800 underline-offset-2 hover:underline"
                >
                  WebChoices
                </a>
                에서 제한할 수 있습니다. 자세한 내용은{" "}
                <a
                    href="https://policies.google.com/technologies/partner-sites?hl=ko"
                    className="font-semibold text-slate-800 underline-offset-2 hover:underline"
                >
                  Google의 파트너 사이트 데이터 사용 안내
                </a>
                에서 확인할 수 있습니다.
              </p>
            </Article>

            <Article title="5. 분석 도구">
              <p className="mt-2">
                작성 시점 기준으로 본 사이트는 <strong>별도의 웹 분석 도구를 사용하지
                않습니다.</strong> 검색엔진 소유 확인을 위한 Google 및 Naver의 확인용
                메타 태그를 포함하고 있으나, 이 태그는 방문자 정보를 수집하지 않습니다.
                향후 분석 도구를 도입하는 경우 본 방침에 그 사실과 서비스명을
                반영하겠습니다.
              </p>
            </Article>

            <Article title="6. 외부 링크">
              <p className="mt-2">
                본 사이트는 참고용 정보 제공을 위해 외부 사이트 링크를 포함할 수
                있습니다. 외부 사이트의 개인정보처리방침과 운영 방식은 본 사이트와
                무관하므로, 해당 사이트의 정책을 별도로 확인하시기 바랍니다.
              </p>
            </Article>

            <Article title="7. 문의">
              <p className="mt-2">
                개인정보 처리와 관련한 문의는 아래 이메일로 접수하실 수 있습니다.
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
      </main>
  );
}
