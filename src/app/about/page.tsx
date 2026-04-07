import type { Metadata } from "next";
import { PageHeader, SectionCard, Article } from "@/components/ui/Shared";

export const metadata: Metadata = {
  title: "사이트 소개",
  description: "주식계산기.kr 사이트 소개 페이지입니다.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <PageHeader 
        badge="주식계산기.kr" 
        title="사이트 소개" 
        description="투자자가 반복적으로 사용하는 필수 계산을 빠르고 정확하게 도와주는 금융 계산 도구 서비스입니다." 
      />

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">
        <SectionCard>
          <Article title="더 나은 투자를 위한 직관적 도구">
            <p>
              주식계산기.kr은 투자자가 반복적으로 사용하는 계산을 더 빠르고 쉽게 할 수
              있도록 기획된 툴 모음입니다. 손절가 계산기, 평단가 계산기 등 투자 판단 전에 
              가급적 활용해야 할 계산 기능을 제공하며, 누구나 간단하게 사용할 수 있도록 
              군더더기 없는 직관적인 화면을 개발 목표로 삼고 있습니다.
            </p>
            <p>
              본 사이트는 투자 권유나 금융상품 판매를 목적으로 하지 않으며, 사이트 내의 
              모든 계산 결과는 참조용으로만 활용해 주시길 당부드립니다.
            </p>
          </Article>
        </SectionCard>
      </div>
    </main>
  );
}