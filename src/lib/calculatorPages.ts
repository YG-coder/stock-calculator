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
    "overseas-stock-tax-calculator": {
        slug: "overseas-stock-tax-calculator",
        metadata: {
            title: "해외주식 세금 계산기 | 양도소득세 및 세후 수익 계산",
            description:
                "해외주식 매매 수익에 대한 양도소득세와 세후 수익을 계산하는 해외주식 세금 계산기입니다. 기본공제 250만원과 세율 22%를 반영해 예상 세금을 확인할 수 있습니다.",
            keywords: [
                "해외주식 세금 계산기",
                "해외주식 양도세 계산기",
                "양도소득세 계산기",
                "세후 수익 계산",
                "미국주식 세금",
            ],
            openGraph: {
                title: "해외주식 세금 계산기 | 양도소득세 및 세후 수익 계산",
                description:
                    "해외주식 투자 수익에서 실제로 얼마가 남는지 계산해보세요. 기본공제와 세율을 반영해 예상 양도세와 세후 수익을 확인할 수 있습니다.",
                type: "website",
            },
        },
        badge: "세금 분석",
        title: "해외주식 세금 계산기",
        headerDescription:
            "해외주식 세금 계산기는 매수 금액, 매도 금액, 환차익과 기본공제를 기준으로 예상 양도소득세와 세후 수익을 계산하는 도구입니다.",
        articleTitle: "해외주식 세금 계산기란?",
        articleIntro:
            "해외주식 매매 시 발생하는 양도차익에 대해 예상 세금과 실제 세후 수익을 계산하는 도구입니다.",
        articleBody:
            "해외주식은 국내주식과 달리 양도소득세 계산이 중요합니다. 기본공제 250만원을 반영한 뒤 과세 대상 수익에 22% 세율을 적용하면 실제로 얼마가 남는지 확인할 수 있습니다.",
        formulaTitle: "해외주식 세금 계산 기본 개념",
        formula: "과세 대상 수익 = 총 수익 - 기본공제 / 세금 = 과세 대상 수익 × 22%",
        formulaDescription:
            "해외주식은 연간 기본공제 250만원을 초과한 수익에 대해 일반적으로 22% 세율을 적용해 예상 세금을 계산합니다.",
        faqs: [
            {
                question: "해외주식 양도소득세는 얼마인가요?",
                answer:
                    "일반적으로 기본공제 250만원을 초과한 양도차익에 대해 22% 세율을 적용해 계산합니다.",
            },
            {
                question: "환차익도 과세 대상인가요?",
                answer:
                    "네, 해외주식 매매 시 발생한 환차익과 환차손도 실제 손익 계산에 영향을 줄 수 있습니다.",
            },
            {
                question: "국내주식도 같은 방식으로 계산하나요?",
                answer:
                    "아니요. 일반 개인투자자의 국내주식 매매차익은 보통 과세되지 않으며, 해외주식과 세금 구조가 다릅니다.",
            },
        ],
        related: [
            {
                href: "/profit-calculator",
                title: "주식 수익률 계산기",
                desc: "세금 반영 전 수익률과 손익 확인",
            },
            {
                href: "/dividend-calculator",
                title: "배당 수익 계산기",
                desc: "배당금과 세후 배당수익률 계산",
            },
            {
                href: "/compound-interest-calculator",
                title: "복리 계산기",
                desc: "장기 투자 시 예상 최종 금액 계산",
            },
        ],
    },
    "crypto-liquidation-calculator": {
        slug: "crypto-liquidation-calculator",
        metadata: {
            title: "코인 청산가 계산기 | 레버리지 롱·숏 청산 가격 계산",
            description:
                "비트코인, 이더리움 등 암호화폐 선물 거래에서 레버리지와 진입가를 기준으로 예상 청산 가격을 계산하는 코인 청산가 계산기입니다.",
            keywords: [
                "코인 청산가 계산기",
                "비트코인 청산가",
                "레버리지 계산기",
                "선물 청산가 계산",
                "crypto liquidation calculator",
            ],
            openGraph: {
                title: "코인 청산가 계산기 | 레버리지 롱·숏 청산 가격 계산",
                description:
                    "암호화폐 선물 거래에서 레버리지와 포지션 방향에 따라 예상 청산 가격을 빠르게 계산하세요.",
                type: "website",
            },
        },
        badge: "레버리지 관리",
        title: "코인 청산가 계산기",
        headerDescription:
            "코인 청산가 계산기는 암호화폐 선물 거래에서 진입 가격, 레버리지, 포지션 방향을 기준으로 예상 청산 가격을 계산하는 도구입니다.",
        articleTitle: "코인 청산가 계산기란?",
        articleIntro:
            "비트코인, 이더리움 같은 암호화폐 선물 거래에서 청산 위험 구간을 미리 계산하는 도구입니다.",
        articleBody:
            "레버리지가 높을수록 작은 가격 변동에도 청산될 수 있기 때문에, 진입 전에 청산 가격을 확인하는 것이 중요합니다. 특히 고배율 거래에서는 손절 전략과 함께 청산가 계산이 필수입니다.",
        formulaTitle: "청산가 계산 기본 개념",
        formula:
            "롱: 진입가 × (1 - 1/레버리지 + 유지증거금률) / 숏: 진입가 × (1 + 1/레버리지 - 유지증거금률)",
        formulaDescription:
            "실제 거래소별 청산가는 수수료, 유지증거금률, 계약 방식에 따라 달라질 수 있으며, 본 계산기는 대표적인 예측값을 제공합니다.",
        faqs: [
            {
                question: "청산가는 거래소마다 다른가요?",
                answer:
                    "네. 거래소마다 유지증거금률, 수수료, 계약 방식이 달라 실제 청산가는 약간 다를 수 있습니다.",
            },
            {
                question: "롱과 숏의 청산가 계산 방식은 다른가요?",
                answer:
                    "네. 롱은 가격이 하락할 때 청산 위험이 커지고, 숏은 가격이 상승할 때 청산 위험이 커집니다.",
            },
            {
                question: "고배율일수록 왜 위험한가요?",
                answer:
                    "레버리지가 높을수록 진입가 대비 청산 가격 간격이 좁아져 작은 변동에도 청산될 수 있기 때문입니다.",
            },
        ],
        related: [
            {
                href: "/crypto",
                title: "코인 계산기 모음",
                desc: "청산가, 수익률, 물타기 계산기 한 곳에서 확인",
            },
            {
                href: "/compound-interest-calculator",
                title: "복리 계산기",
                desc: "장기 투자 시 예상 최종 금액 계산",
            },
            {
                href: "/profit-calculator",
                title: "주식 수익률 계산기",
                desc: "기본 수익률 계산 구조 참고",
            },
        ],
    },
};