import type { Metadata } from "next";

export const SITE_NAME = "주식계산기.kr";
export const BASE_URL = "https://주식계산기.kr";
export const OG_IMAGE = "/og-image.png";

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
            images: [
                {
                    url: OG_IMAGE,
                    width: 1200,
                    height: 630,
                    alt: `${title} | ${SITE_NAME}`,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title: `${title} | ${SITE_NAME}`,
            description,
            images: [OG_IMAGE],
        },

        robots: {
            index: true,
            follow: true,
        },
    };
}