import type { Metadata } from "next";

export const SITE_NAME = "주식계산기.kr";
export const BASE_URL = "https://주식계산기.kr";

type BuildMetadataParams = {
    title: string;
    description: string;
    path?: string;
    keywords?: string[];
};

export function buildMetadata({
                                  title,
                                  description,
                                  path = "",
                                  keywords = [],
                              }: BuildMetadataParams): Metadata {
    const normalizedPath = path
        ? path.startsWith("/")
            ? path
            : `/${path}`
        : "";

    const url = normalizedPath ? `${BASE_URL}${normalizedPath}` : BASE_URL;

    return {
        metadataBase: new URL(BASE_URL),

        title,
        description,
        keywords,

        alternates: {
            canonical: url,
        },

        openGraph: {
            title: `${title} | ${SITE_NAME}`,
            description,
            url,
            siteName: SITE_NAME,
            locale: "ko_KR",
            type: "website",
        },

        twitter: {
            card: "summary_large_image",
            title: `${title} | ${SITE_NAME}`,
            description,
        },

        robots: {
            index: true,
            follow: true,
        },
    };
}