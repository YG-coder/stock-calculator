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
    exampleTitle?: string;
    exampleBody?: string;
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

        exampleTitle: "코인 청산가 계산 예시",
        exampleBody:
            "예를 들어 비트코인을 70,000 USDT에 10배 레버리지로 롱 포지션에 진입했다고 가정해보겠습니다. 이 경우 가격이 약 10% 하락하면 이론적으로 자본이 모두 소진될 수 있으며, 실제 청산 가격은 유지증거금률을 반영해 그보다 조금 높은 구간에서 발생합니다. 반대로 숏 포지션에서는 가격이 상승할 때 청산 위험이 커지므로, 진입 전 반드시 청산가를 계산해 리스크를 관리해야 합니다.",

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
            {
                question: "청산가와 손절가는 같은 개념인가요?",
                answer:
                    "아니요. 청산가는 강제 종료되는 가격이고, 손절가는 투자자가 직접 설정하는 리스크 관리 기준입니다. 일반적으로 청산가보다 훨씬 여유 있게 손절가를 설정하는 것이 안전합니다.",
            },
        ],

        related: [
            {
                href: "/crypto",
                title: "코인 계산기 모음",
                desc: "청산가, 수익률, 물타기 계산기 한 곳에서 확인",
            },
            {
                href: "/crypto/leverage-profit",
                title: "코인 레버리지 수익 계산기",
                desc: "롱·숏 포지션의 실제 수익과 ROE 계산",
            },
            {
                href: "/crypto/profit",
                title: "코인 수익 계산기",
                desc: "현물 거래 기준 실제 순수익 계산",
            },
        ],
    },
    "crypto-profit-calculator": {
        slug: "crypto-profit-calculator",
        metadata: {
            title: "코인 수익 계산기 | 비트코인·이더리움 수익률 및 순수익 계산",
            description:
                "매수 가격, 매도 가격, 보유 수량, 거래 수수료를 기준으로 코인 실제 수익과 수익률을 계산하는 코인 수익 계산기입니다.",
            keywords: [
                "코인 수익 계산기",
                "비트코인 수익 계산기",
                "암호화폐 수익률 계산기",
                "코인 수수료 계산",
                "crypto profit calculator",
            ],
            openGraph: {
                title: "코인 수익 계산기 | 비트코인·이더리움 수익률 및 순수익 계산",
                description:
                    "암호화폐 매수·매도 가격과 수수료를 반영해 실제 순수익과 수익률을 계산하세요.",
                type: "website",
            },
        },
        badge: "수익 계산",
        title: "코인 수익 계산기",
        headerDescription:
            "코인 수익 계산기는 암호화폐 매수 가격, 매도 가격, 수량, 거래 수수료를 기준으로 실제 순수익과 수익률을 계산하는 도구입니다.",
        articleTitle: "코인 수익 계산기란?",
        articleIntro:
            "비트코인, 이더리움 같은 암호화폐 거래에서 매수·매도 가격과 수수료를 반영해 실제 수익을 계산하는 도구입니다.",
        articleBody:
            "코인 거래는 가격 변동뿐 아니라 거래 수수료도 실제 수익에 영향을 줍니다. 따라서 단순 가격 차이만 보는 것이 아니라 매수 수수료와 매도 수수료까지 함께 반영해 순수익을 확인하는 것이 중요합니다.",
        formulaTitle: "코인 수익 계산 기본 개념",
        formula:
            "순수익 = (매도금액 - 매도수수료) - (매수금액 + 매수수수료)",
        formulaDescription:
            "실제 수익률은 매수·매도 수수료를 모두 반영한 순수익을 기준으로 계산하는 것이 가장 정확합니다.",

        exampleTitle: "코인 수익 계산 예시",
        exampleBody:
            "예를 들어 비트코인을 50,000 USDT에 매수하고 60,000 USDT에 매도했다고 가정해보겠습니다. 단순 계산으로는 약 20% 수익이 발생한 것처럼 보이지만, 실제로는 매수와 매도 시 각각 수수료가 발생합니다. 수수료를 포함하면 순수익은 다소 줄어들게 되며, 거래 횟수가 많을수록 누적 수수료의 영향이 커집니다.",

        faqs: [
            {
                question: "코인 수익 계산 시 수수료를 꼭 넣어야 하나요?",
                answer:
                    "네. 수수료를 빼고 계산하면 실제 수익보다 높게 보일 수 있어 정확한 판단이 어렵습니다.",
            },
            {
                question: "업비트, 바이낸스, 비트겟 수수료가 다른데 적용 가능한가요?",
                answer:
                    "네. 거래소마다 수수료율이 다르므로 매수·매도 수수료를 직접 입력해 반영할 수 있습니다.",
            },
            {
                question: "수익률과 순수익은 어떻게 다른가요?",
                answer:
                    "수익률은 투자금 대비 비율이고, 순수익은 실제 벌거나 잃은 금액입니다. 두 지표를 함께 보는 것이 중요합니다.",
            },
            {
                question: "레버리지 거래도 같은 방식으로 계산하나요?",
                answer:
                    "아니요. 레버리지 거래는 증거금과 배율이 반영되므로 별도의 레버리지 수익 계산기를 사용하는 것이 더 정확합니다.",
            },
        ],

        related: [
            {
                href: "/crypto",
                title: "코인 계산기 모음",
                desc: "청산가, 수익률, 물타기 계산기 한 곳에서 확인",
            },
            {
                href: "/crypto/leverage-profit",
                title: "코인 레버리지 수익 계산기",
                desc: "롱·숏 포지션의 실제 수익과 ROE 계산",
            },
            {
                href: "/crypto/liquidation",
                title: "코인 청산가 계산기",
                desc: "레버리지 거래 시 예상 청산 가격 계산",
            },
        ],
    },
    "crypto-average-calculator": {
        slug: "crypto-average-calculator",
        metadata: {
            title: "코인 물타기 계산기 | 비트코인·이더리움 평균 단가 계산",
            description:
                "암호화폐 추가 매수 시 평균 매입 단가가 어떻게 달라지는지 계산하는 코인 물타기 계산기입니다. 비트코인, 이더리움 등 코인의 평균 단가를 쉽게 확인할 수 있습니다.",
            keywords: [
                "코인 물타기 계산기",
                "코인 평단가 계산기",
                "비트코인 평균단가",
                "암호화폐 물타기",
                "crypto average calculator",
            ],
            openGraph: {
                title: "코인 물타기 계산기 | 비트코인·이더리움 평균 단가 계산",
                description:
                    "추가 매수 후 코인 평균 단가가 어떻게 바뀌는지 계산해보세요. 물타기 전략 판단에 도움이 됩니다.",
                type: "website",
            },
        },
        badge: "평균 단가",
        title: "코인 물타기 계산기",
        headerDescription:
            "코인 물타기 계산기는 기존 매수 가격과 추가 매수 가격, 보유 수량을 기준으로 새로운 평균 매입 단가를 계산하는 도구입니다.",
        articleTitle: "코인 물타기 계산기란?",
        articleIntro:
            "비트코인, 이더리움 같은 암호화폐를 추가 매수할 때 평균 단가가 어떻게 변하는지 계산하는 도구입니다.",
        articleBody:
            "코인 시장은 변동성이 크기 때문에 단순 감으로 물타기를 하면 위험할 수 있습니다. 추가 매수 후 평균 단가를 미리 계산해두면 손익분기점과 이후 대응 전략을 더 명확하게 판단할 수 있습니다.",
        formulaTitle: "코인 평균 단가 계산 기본 개념",
        formula:
            "평균 단가 = (기존 매수금액 + 추가 매수금액) ÷ 총 보유 수량",
        formulaDescription:
            "단순 평균이 아니라 실제 매수 금액 비중과 수량을 함께 반영해야 정확한 평균 단가를 구할 수 있습니다.",

        exampleTitle: "코인 물타기 계산 예시",
        exampleBody:
            "예를 들어 비트코인을 70,000 USDT에 0.2개 매수한 뒤, 가격이 60,000 USDT로 하락했을 때 0.1개를 추가 매수했다고 가정해보겠습니다. 이 경우 평균 단가는 단순히 두 가격의 평균이 아니라, 각 매수 금액과 수량 비중을 함께 반영해 계산해야 합니다. 물타기 계산기를 사용하면 추가 매수 후 새로운 평균 단가와 손익분기점을 더 정확하게 확인할 수 있습니다.",

        faqs: [
            {
                question: "코인도 물타기 계산이 필요한가요?",
                answer:
                    "네. 암호화폐는 가격 변동이 크기 때문에 추가 매수 후 평균 단가가 어떻게 변하는지 확인하는 것이 중요합니다.",
            },
            {
                question: "소수점 수량도 계산 가능한가요?",
                answer:
                    "네. 비트코인, 이더리움처럼 소수점 단위로 거래하는 코인도 계산할 수 있습니다.",
            },
            {
                question: "물타기를 하면 항상 유리한가요?",
                answer:
                    "아니요. 평균 단가는 낮아질 수 있지만 추가 자금이 들어가므로 손절가와 목표가를 함께 고려해야 합니다.",
            },
            {
                question: "평균 단가만 낮아지면 바로 안전한가요?",
                answer:
                    "아니요. 평균 단가가 낮아져도 시장이 추가로 하락하면 손실이 더 커질 수 있습니다. 물타기 전략은 손절 기준과 함께 사용해야 합니다.",
            },
        ],

        related: [
            {
                href: "/crypto",
                title: "코인 계산기 모음",
                desc: "청산가, 수익률, 물타기 계산기 한 곳에서 확인",
            },
            {
                href: "/crypto/profit",
                title: "코인 수익 계산기",
                desc: "매수·매도 가격과 수수료 기준 순수익 계산",
            },
            {
                href: "/average-price-calculator",
                title: "주식 평단가 계산기",
                desc: "주식 물타기 평균 단가 계산",
            },
        ],
    },
    "crypto-leverage-profit-calculator": {
        slug: "crypto-leverage-profit-calculator",
        metadata: {
            title: "코인 레버리지 수익 계산기 | 롱·숏 선물 수익률 및 ROE 계산",
            description:
                "암호화폐 선물 거래에서 진입가, 종료가, 증거금, 레버리지를 기준으로 실제 수익과 ROE를 계산하는 코인 레버리지 수익 계산기입니다.",
            keywords: [
                "코인 레버리지 수익 계산기",
                "비트코인 선물 수익 계산기",
                "롱 숏 수익 계산기",
                "ROE 계산기",
                "crypto leverage profit calculator",
            ],
            openGraph: {
                title: "코인 레버리지 수익 계산기 | 롱·숏 선물 수익률 및 ROE 계산",
                description:
                    "암호화폐 선물 거래에서 레버리지와 포지션 방향을 반영한 실제 수익과 ROE를 계산해보세요.",
                type: "website",
            },
        },
        badge: "선물 수익",
        title: "코인 레버리지 수익 계산기",
        headerDescription:
            "코인 레버리지 수익 계산기는 암호화폐 선물 거래에서 진입가, 종료가, 증거금, 레버리지를 기준으로 실제 수익과 증거금 대비 수익률을 계산하는 도구입니다.",
        articleTitle: "코인 레버리지 수익 계산기란?",
        articleIntro:
            "비트코인, 이더리움 같은 암호화폐 선물 거래에서 롱·숏 포지션의 실제 수익과 ROE를 계산하는 도구입니다.",
        articleBody:
            "현물 수익 계산과 달리 레버리지 거래는 증거금 대비 수익률이 크게 달라지고, 거래 수수료도 실제 순수익에 큰 영향을 줍니다. 따라서 진입 전과 청산 전에 실제 수익 구조를 정확히 계산하는 것이 중요합니다.",
        formulaTitle: "레버리지 수익 계산 기본 개념",
        formula:
            "순수익 = (포지션 규모 × 가격 변동률) - 진입 수수료 - 종료 수수료",
        formulaDescription:
            "포지션 규모는 증거금 × 레버리지로 계산하며, 실제 수익률은 총 수수료까지 반영해 계산하는 것이 정확합니다.",
        exampleTitle: "레버리지 수익 계산 예시",
        exampleBody:
            "예를 들어 비트코인을 70,000 USDT에 진입하고 10배 레버리지를 사용했다고 가정해보겠습니다. 가격이 73,500 USDT로 약 5% 상승하면, 단순 가격 상승률은 5% 수준이지만 증거금 기준 수익률은 훨씬 크게 확대될 수 있습니다. 반대로 가격이 하락하면 손실도 같은 방식으로 빠르게 커지므로, 레버리지 수익 계산기는 청산가 계산기와 함께 사용하는 것이 가장 안전합니다.",
        faqs: [
            {
                question: "ROE는 무엇인가요?",
                answer:
                    "ROE는 증거금 대비 수익률입니다. 같은 가격 변동이라도 레버리지가 높을수록 ROE가 크게 변합니다.",
            },
            {
                question: "롱과 숏 수익 계산 방식은 다른가요?",
                answer:
                    "네. 롱은 가격 상승 시 수익이 나고, 숏은 가격 하락 시 수익이 납니다.",
            },
            {
                question: "수수료를 꼭 넣어야 하나요?",
                answer:
                    "네. 선물 거래는 진입과 종료 모두 수수료가 발생하므로 실제 순수익을 보려면 반드시 반영하는 것이 좋습니다.",
            },
            {
                question: "레버리지가 높을수록 수익이 무조건 좋은가요?",
                answer:
                    "아니요. 레버리지가 높을수록 수익뿐 아니라 손실과 청산 위험도 함께 커집니다. 높은 배율일수록 수익 계산기와 청산가 계산기를 함께 확인하는 것이 중요합니다.",
            },
        ],
        related: [
            {
                href: "/crypto",
                title: "코인 계산기 모음",
                desc: "청산가, 수익률, 물타기 계산기 한 곳에서 확인",
            },
            {
                href: "/crypto/liquidation",
                title: "코인 청산가 계산기",
                desc: "레버리지 거래 시 예상 청산 가격 계산",
            },
            {
                href: "/crypto/profit",
                title: "코인 수익 계산기",
                desc: "현물 거래 기준 실제 순수익 계산",
            },
        ],
    },
    "crypto-funding-fee-calculator": {
        slug: "crypto-funding-fee-calculator",
        metadata: {
            title: "펀딩비 계산기 | 코인 선물 Funding Fee 예상 금액 계산",
            description:
                "암호화폐 선물 거래에서 포지션 규모, 펀딩비율, 적용 횟수를 기준으로 예상 펀딩비를 계산하는 펀딩비 계산기입니다.",
            keywords: [
                "펀딩비 계산기",
                "funding fee calculator",
                "코인 펀딩비",
                "비트코인 펀딩비",
                "선물 펀딩비 계산",
            ],
            openGraph: {
                title: "펀딩비 계산기 | 코인 선물 Funding Fee 예상 금액 계산",
                description:
                    "암호화폐 선물 거래에서 예상 펀딩비를 계산하고 롱·숏 포지션별 지급/수령 구조를 확인하세요.",
                type: "website",
            },
        },
        badge: "펀딩비 분석",
        title: "펀딩비 계산기",
        headerDescription:
            "펀딩비 계산기는 암호화폐 선물 거래에서 포지션 규모, 펀딩비율, 적용 횟수를 기준으로 예상 펀딩비를 계산하는 도구입니다.",
        articleTitle: "펀딩비 계산기란?",
        articleIntro:
            "비트코인, 이더리움 등 암호화폐 선물 거래에서 펀딩비 지급 또는 수령 금액을 계산하는 도구입니다.",
        articleBody:
            "펀딩비는 선물 가격과 현물 가격의 괴리를 조정하기 위해 정해지는 비용입니다. 포지션 규모가 클수록, 펀딩비율이 높을수록 실제 손익에 미치는 영향이 커지므로 거래 전에 꼭 확인하는 것이 좋습니다.",
        formulaTitle: "펀딩비 계산 기본 개념",
        formula: "펀딩비 = 포지션 규모 × 펀딩비율 × 적용 횟수",
        formulaDescription:
            "펀딩비율이 양수인지 음수인지에 따라 롱 또는 숏 포지션이 지급하거나 수령하게 됩니다.",

        exampleTitle: "펀딩비 계산 예시",
        exampleBody:
            "예를 들어 10,000 USDT 규모의 포지션을 보유하고 있고, 펀딩비율이 0.01%이며 하루 동안 3번 펀딩비가 적용된다고 가정해보겠습니다. 이 경우 1회당 펀딩비는 1 USDT이고, 총 3 USDT가 누적됩니다. 포지션 규모가 크거나 장시간 포지션을 유지할수록 누적 펀딩비 부담이 커질 수 있으므로, 단기 수익뿐 아니라 펀딩비까지 함께 계산하는 것이 중요합니다.",

        faqs: [
            {
                question: "펀딩비는 항상 지급만 하나요?",
                answer:
                    "아니요. 펀딩비율이 양수인지 음수인지, 그리고 롱·숏 포지션인지에 따라 지급 또는 수령할 수 있습니다.",
            },
            {
                question: "펀딩비는 수익에 큰 영향을 주나요?",
                answer:
                    "네. 포지션 규모가 크거나 장시간 포지션을 유지할수록 누적 펀딩비가 실제 수익에 큰 영향을 줄 수 있습니다.",
            },
            {
                question: "거래소마다 펀딩비가 다른가요?",
                answer:
                    "네. 거래소마다 펀딩비율과 적용 주기가 다를 수 있으므로 실제 거래소 기준과 함께 확인하는 것이 좋습니다.",
            },
            {
                question: "펀딩비는 수익 계산기와 별도로 봐야 하나요?",
                answer:
                    "네. 레버리지 거래에서는 가격 변동으로 인한 손익과 펀딩비가 별도로 누적되기 때문에, 실제 순수익을 보려면 두 요소를 함께 확인하는 것이 좋습니다.",
            },
        ],

        related: [
            {
                href: "/crypto",
                title: "코인 계산기 모음",
                desc: "청산가, 수익, 물타기 계산기 한 곳에서 확인",
            },
            {
                href: "/crypto/leverage-profit",
                title: "코인 레버리지 수익 계산기",
                desc: "롱·숏 포지션의 실제 수익과 ROE 계산",
            },
            {
                href: "/crypto/liquidation",
                title: "코인 청산가 계산기",
                desc: "레버리지 거래 시 예상 청산 가격 계산",
            },
        ],
    },
    "crypto-entry-calculator": {
        slug: "crypto-entry-calculator",
        metadata: {
            title: "코인 100배 진입 계산기 | 손절폭 기준 배율·주문금액 계산",
            description:
                "진입가, 손절가, 시드, 리스크 비율을 기준으로 손절폭, 권장 배율, 주문 명목가치, 익절가를 계산하는 코인 100배 진입 계산기입니다.",
            keywords: [
                "100배 진입 계산기",
                "코인 진입 계산기",
                "레버리지 진입 계산기",
                "비트코인 진입 계산기",
                "주문 명목가치 계산기",
            ],
            openGraph: {
                title: "코인 100배 진입 계산기 | 손절폭 기준 배율·주문금액 계산",
                description:
                    "손절폭을 기준으로 권장 배율, 주문 명목가치, 익절가를 빠르게 계산하세요.",
                type: "website",
            },
        },
        badge: "진입 타점",
        title: "코인 100배 진입 계산기",
        headerDescription:
            "코인 100배 진입 계산기는 진입가와 손절가 사이의 손절폭을 기준으로 권장 배율, 리스크 금액, 주문 명목가치, 익절가를 계산하는 도구입니다.",
        articleTitle: "코인 100배 진입 계산기란?",
        articleIntro:
            "손절폭을 기준으로 몇 배 진입이 가능한지, 그리고 거래소 주문창에 얼마를 넣어야 하는지 계산하는 실전용 도구입니다.",
        articleBody:
            "이 계산기는 단순 수익률 계산기가 아니라 손절폭과 시드의 일정 비율을 바탕으로 주문 명목가치를 계산하는 구조입니다. 즉, 손절가를 어디에 둘지 먼저 정한 뒤 그에 맞는 배율과 진입 금액을 역산하는 방식입니다.",
        formulaTitle: "100배 진입 계산 기본 개념",
        formula:
            "손절폭(%) = (진입가 - 손절가) ÷ 진입가 × 100 / 배율 = 100 ÷ 손절폭 / 주문 명목가치 = 배율 × (시드 × 리스크비율)",
        formulaDescription:
            "이 엑셀 기반 구조에서는 손절폭이 1%면 권장 배율이 100배가 되며, 시드의 일정 비율을 리스크 금액으로 잡아 주문 명목가치를 계산합니다.",
        exampleTitle: "100배 진입 계산 예시",
        exampleBody:
            "예를 들어 진입가가 10,000 USDT이고 손절가가 9,900 USDT라면 손절폭은 1%입니다. 이 경우 권장 배율은 100배가 되며, 시드가 100 USDT이고 리스크 비율을 5%로 잡으면 리스크 금액은 5 USDT입니다. 최종 주문 명목가치는 100배 × 5 USDT로 계산되어 500 USDT가 됩니다.",
        faqs: [
            {
                question: "왜 손절폭이 1%면 100배가 되나요?",
                answer:
                    "이 계산기는 손절폭이 1%일 때 100배 레버리지 기준으로 자본이 모두 소진되는 구조를 기준으로 배율을 역산합니다.",
            },
            {
                question: "주문 명목가치는 실제 거래소에 넣는 금액인가요?",
                answer:
                    "네. 엑셀 원본 기준으로는 계산된 주문 명목가치를 거래소 주문창 USDT 금액으로 사용하는 구조입니다.",
            },
            {
                question: "리스크 비율은 무엇인가요?",
                answer:
                    "전체 시드 중 몇 퍼센트를 한 번의 진입에서 리스크로 감수할지 정하는 값입니다. 기본값 5%는 시드의 5%만 위험 구간으로 두는 의미입니다.",
            },
            {
                question: "이 계산기는 청산가 계산기와 다른가요?",
                answer:
                    "네. 청산가 계산기는 강제 종료 가격을 계산하고, 이 계산기는 손절폭 기준으로 권장 배율과 주문 명목가치를 계산하는 도구입니다.",
            },
        ],
        related: [
            {
                href: "/crypto",
                title: "코인 계산기 모음",
                desc: "청산가, 레버리지 수익, 펀딩비, 물타기 계산기 한 곳에서 확인",
            },
            {
                href: "/crypto/liquidation",
                title: "코인 청산가 계산기",
                desc: "레버리지 거래 시 예상 청산 가격 계산",
            },
            {
                href: "/crypto/leverage-profit",
                title: "코인 레버리지 수익 계산기",
                desc: "롱·숏 포지션의 실제 수익과 ROE 계산",
            },
        ],
    },
};