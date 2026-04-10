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

export const calculatorPages: Record<string, CalculatorPageConfig> = {};