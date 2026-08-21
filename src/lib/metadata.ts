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

/**
 * 페이지가 자체 metadata 객체를 쓰는 경우, canonical / OG 이미지 / twitter 카드를 붙인다.
 * 제목·설명·키워드는 전달받은 값을 그대로 유지한다.
 *
 * 이 래퍼가 없으면 Next.js 가 정의되지 않은 필드를 루트 레이아웃에서 상속하므로
 * canonical 이 홈(/)으로, twitter 카드가 홈 문구로 지정된다.
 */
export function withPageMetadata(meta: Metadata, path: string): Metadata {
    const normalizedPath =
        !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
    const url = `${BASE_URL}${normalizedPath}`;

    const og = meta.openGraph as
        | { title?: string; description?: string }
        | undefined;

    const baseTitle = typeof meta.title === "string" ? meta.title : undefined;
    const ogTitle = og?.title ?? baseTitle;
    const ogDescription = og?.description ?? meta.description ?? undefined;

    return {
        ...meta,
        metadataBase: new URL(BASE_URL),
        alternates: {
            ...meta.alternates,
            canonical: url,
        },
        openGraph: {
            type: "website",
            locale: "ko_KR",
            siteName: SITE_NAME,
            title: ogTitle,
            description: ogDescription,
            url,
            images: [
                {
                    url: OG_IMAGE,
                    width: 1200,
                    height: 630,
                    alt: `${ogTitle ?? SITE_NAME}`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: ogTitle,
            description: ogDescription,
            images: [OG_IMAGE],
        },
    };
}
