import type { Metadata } from "next";

export type RelatedLink = {
    href: string;
    title: string;
    desc: string;
};

export type CalculatorPageConfig = {
    slug: string;
    metadata: Metadata;
    badge: string;
    title: string;
    headerDescription: string;
    articleTitle: string;
    articleIntro: string;
    articleBody?: string;
    formulaTitle?: string;
    formula?: string;
    formulaDescription?: string;
    faqs?: {
        question: string;
        answer: string;
    }[];
    related?: RelatedLink[];
};

export const calculatorPages: Record<string, CalculatorPageConfig> = {
    "compound-interest-calculator": {
        slug: "compound-interest-calculator",
        metadata: {
            title: "복리 계산기 | 복리 투자 수익 및 최종 금액 계산",
            description:
                "초기 투자금, 매월 추가 투자금, 예상 수익률, 투자 기간을 기준으로 최종 금액과 복리 수익을 계산하는 복리 계산기입니다.",
            keywords: [
                "복리 계산기",
                "복리 투자 계산기",
                "월복리 계산기",
                "복리 수익 계산",
                "compound interest calculator",
            ],
            openGraph: {
                title: "복리 계산기 | 복리 투자 수익 및 최종 금액 계산",
                description:
                    "초기 투자금과 추가 투자금을 기준으로 복리 수익과 예상 최종 금액을 계산해보세요.",
                type: "website",
            },
        },
        badge: "장기 투자",
        title: "복리 계산기",
        headerDescription:
            "복리 계산기는 초기 투자금, 매월 추가 투자금, 예상 수익률, 투자 기간을 기준으로 예상 최종 금액과 복리 수익을 계산하는 도구입니다.",
        articleTitle: "복리 계산기란?",
        articleIntro:
            "원금과 수익이 함께 불어나는 복리 구조를 기준으로 장기 투자 결과를 계산하는 도구입니다.",
        articleBody:
            "복리는 시간이 길어질수록 효과가 커지기 때문에, 장기 투자 전략을 세울 때 단리보다 훨씬 중요한 기준이 됩니다. 초기 투자금뿐 아니라 매월 추가 투자금까지 함께 반영하면 보다 현실적인 투자 시뮬레이션이 가능합니다.",
        formulaTitle: "복리 계산 기본 개념",
        formula: "최종 금액 = 초기 투자금의 복리 성장 + 매월 추가 투자금의 누적 복리 성장",
        formulaDescription:
            "복리 계산기는 원금, 추가 납입금, 수익률, 기간을 함께 반영하여 예상 최종 금액과 총 수익을 계산합니다.",
        faqs: [
            {
                question: "복리와 단리의 차이는 무엇인가요?",
                answer:
                    "단리는 원금에만 이자가 붙지만, 복리는 원금과 누적 수익에 다시 수익이 붙습니다. 투자 기간이 길어질수록 복리 효과가 더 크게 나타납니다.",
            },
            {
                question: "매월 추가 투자금도 반영되나요?",
                answer:
                    "네, 매월 일정 금액을 추가로 투자하는 조건까지 반영해 예상 최종 금액을 계산합니다.",
            },
            {
                question: "예상 수익률은 실제 수익을 보장하나요?",
                answer:
                    "아니요. 계산 결과는 입력한 가정에 따른 시뮬레이션이며, 실제 투자 성과는 시장 상황에 따라 달라질 수 있습니다.",
            },
        ],
        related: [
            {
                href: "/profit-calculator",
                title: "주식 수익률 계산기",
                desc: "현재 수익률과 손익을 빠르게 확인",
            },
            {
                href: "/dividend-calculator",
                title: "배당 수익 계산기",
                desc: "배당금과 배당수익률 계산",
            },
            {
                href: "/position-size-calculator",
                title: "포지션 사이즈 계산기",
                desc: "허용 손실 기준 투자 금액 계산",
            },
        ],
    },
};