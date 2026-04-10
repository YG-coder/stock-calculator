import {
    PageHeader,
    SectionCard,
    Article,
    FaqSection,
    FaqItem,
    RelatedCalculators,
    Disclaimer,
} from "@/components/ui/Shared";
import type { CalculatorPageConfig } from "@/lib/calculatorPages";

type Props = {
    config: CalculatorPageConfig;
    children: React.ReactNode;
};

export default function CalculatorPageTemplate({ config, children }: Props) {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200 selection:text-slate-900 pb-20">
            <PageHeader
                badge={config.badge}
                title={config.title}
                description={config.headerDescription}
            />

            <div className="mx-auto max-w-5xl px-6 py-12 md:px-8 md:py-16">
                {children}

                <SectionCard>
                    <Article title={config.articleTitle}>
                        <p>
                            <strong>{config.title}</strong>는 {config.articleIntro}
                        </p>
                        {config.articleBody ? <p>{config.articleBody}</p> : null}
                    </Article>

                    {config.formulaTitle ? (
                        <Article title={config.formulaTitle}>
                            {config.formula ? (
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center my-6">
                                    <p className="font-mono text-xl text-slate-800 font-bold tracking-tight">
                                        {config.formula}
                                    </p>
                                </div>
                            ) : null}
                            {config.formulaDescription ? <p>{config.formulaDescription}</p> : null}
                        </Article>
                    ) : null}
                </SectionCard>

                {config.faqs?.length ? (
                    <FaqSection title="자주 묻는 질문 (FAQ)">
                        {config.faqs.map((faq) => (
                            <FaqItem
                                key={faq.question}
                                question={faq.question}
                                answer={faq.answer}
                            />
                        ))}
                    </FaqSection>
                ) : null}

                {config.related?.length ? (
                    <RelatedCalculators links={config.related} />
                ) : null}

                <Disclaimer />
            </div>
        </main>
    );
}