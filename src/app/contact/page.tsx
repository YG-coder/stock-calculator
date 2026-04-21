// src/app/contact/page.tsx
import { buildMetadata } from "@/lib/metadata";
import { PageHeader, SectionCard, Article } from "@/components/ui/Shared";

export const metadata = buildMetadata({
  title: "문의하기",
  description: "주식계산기.kr 고객지원 및 문의 페이지입니다.",
  path: "/contact",
});

export default function ContactPage() {
  return (
      <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
        <PageHeader
            badge="고객지원"
            title="문의하기"
            description="서비스 이용 중 궁금하신 점이나 추가를 원하시는 기능이 있다면 언제든 문의해 주세요."
        />

        <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
          <SectionCard>
            <Article title="이메일 문의">
              <p>
                사이트 이용과 관련한 문의 사항(오류 제보, 기능 추가 제안, 제휴 문의
                등)은 아래 이메일로 보내주시기 바랍니다.
              </p>

              <div className="my-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <a
                    href="mailto:support@주식계산기.kr"
                    className="font-mono text-xl font-bold tracking-tight text-slate-800 underline-offset-2 hover:underline"
                >
                  support@주식계산기.kr
                </a>
              </div>

              <p>
                보내주신 의견은 확인 후 답변드리겠습니다. 주말 및 공휴일을 제외하고
                일반적으로 1~2영업일 정도 소요될 수 있습니다.
              </p>
            </Article>
          </SectionCard>
        </div>
      </main>
  );
}