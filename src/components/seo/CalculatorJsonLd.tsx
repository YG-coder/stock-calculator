/**
 * src/components/seo/CalculatorJsonLd.tsx
 *
 * 각 계산기 페이지에 한 줄로 주입할 수 있는 구조화 데이터 컴포넌트.
 *
 * 다음 3가지 schema.org 타입을 @graph로 한 번에 주입합니다:
 *  1. WebApplication       → 구글이 "도구"로 인식
 *  2. FAQPage (faqs 있을 때) → 검색 결과 FAQ 리치 스니펫
 *  3. BreadcrumbList       → 사이트 구조 가독성 향상
 *
 * 사용 패턴 3가지 모두 지원:
 *
 *  (A) calculatorPages 설정 객체로 한 번에:
 *      <CalculatorJsonLd config={config} path="/crypto/entry" />
 *
 *  (B) 직접 props로:
 *      <CalculatorJsonLd
 *          title="주식 수익률 계산기"
 *          description="..."
 *          path="/profit-calculator"
 *          faqs={FAQ_ITEMS}
 *      />
 *
 *  (C) config + faqs 별도 (config의 faqs를 override):
 *      <CalculatorJsonLd config={config} path="/..." faqs={EXTRA_FAQS} />
 */

import type { CalculatorPageConfig } from "@/lib/calculatorPages";
import { BASE_URL, SITE_NAME } from "@/lib/metadata";

export type FaqEntry = {
    question: string;
    answer: string;
};

type Props = {
    path: string;
    config?: CalculatorPageConfig;
    title?: string;
    description?: string;
    faqs?: FaqEntry[];
    breadcrumbLabel?: string;
};

export default function CalculatorJsonLd({
    path,
    config,
    title,
    description,
    faqs,
    breadcrumbLabel,
}: Props) {
    // 우선순위: 명시적으로 넘긴 props > config 값
    const finalTitle = title ?? config?.title ?? "";
    const finalDescription =
        description ??
        config?.headerDescription ??
        config?.articleIntro ??
        "";
    const finalFaqs: FaqEntry[] = faqs ?? config?.faqs ?? [];

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${BASE_URL}${normalizedPath}`;
    const finalBreadcrumb = breadcrumbLabel ?? finalTitle;

    const graph: Record<string, unknown>[] = [
        // 1) WebApplication — 구글이 "이 페이지는 무료 계산 도구다"로 인식
        {
            "@type": "WebApplication",
            "@id": `${url}#webapp`,
            name: finalTitle,
            url,
            description: finalDescription,
            applicationCategory: "FinanceApplication",
            operatingSystem: "All",
            inLanguage: "ko-KR",
            isAccessibleForFree: true,
            offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "KRW",
            },
            publisher: {
                "@type": "Organization",
                name: SITE_NAME,
                url: BASE_URL,
            },
        },

        // 2) BreadcrumbList — 사이트 구조 인식
        {
            "@type": "BreadcrumbList",
            "@id": `${url}#breadcrumb`,
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: SITE_NAME,
                    item: BASE_URL,
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: finalBreadcrumb,
                    item: url,
                },
            ],
        },
    ];

    // 3) FAQPage — FAQ가 있을 때만 추가
    if (finalFaqs.length > 0) {
        graph.push({
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            mainEntity: finalFaqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                },
            })),
        });
    }

    const data = {
        "@context": "https://schema.org",
        "@graph": graph,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
