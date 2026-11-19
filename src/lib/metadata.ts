import { SITE } from "@/lib/site";
import type { Metadata } from "next";

export const SITE_NAME = SITE.name;
export const BASE_URL = SITE.url;
export const OG_IMAGE = "/og-image.png";

const SITE_NAME_SUFFIX = ` | ${SITE_NAME}`;

/**
 * 공유 제목(og:title·twitter:title) 끝에 사이트명을 정확히 한 번 붙인다.
 * 이미 붙어 있으면(여러 번 붙어 있어도) 한 번만 남기고, 제목 본문 안의 " | " 는 건드리지 않는다.
 */
export function withSiteNameSuffix(title: string): string {
    let body = title.trim();
    while (body.endsWith(SITE_NAME_SUFFIX)) {
        body = body.slice(0, -SITE_NAME_SUFFIX.length).trimEnd();
    }
    return body && body !== SITE_NAME ? `${body}${SITE_NAME_SUFFIX}` : SITE_NAME;
}

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
            title: withSiteNameSuffix(title),
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
            title: withSiteNameSuffix(title),
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
 *
 * shareTitleSiteName: true 이면 공유 제목(og:title·twitter:title) 끝에 사이트명을 한 번 붙인다.
 * 계산기 상세 페이지가 buildMetadata 를 쓰는 페이지와 같은 형식이 되도록 쓰는 옵션이며,
 * 검색용 <title>·공유 이미지 대체 텍스트·canonical 은 바꾸지 않는다. 홈·허브는 이 옵션을 쓰지 않는다.
 */
export function withPageMetadata(
    meta: Metadata,
    path: string,
    options: { imageAlt?: string; shareTitleSiteName?: boolean } = {}
): Metadata {
    const normalizedPath =
        !path || path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
    // URL 파서로 만든다. 홈은 기존 canonical 과 같은 "https://…kr/" 형태가 된다.
    const url = new URL(normalizedPath, BASE_URL).href;

    const og = meta.openGraph as
        | { title?: string; description?: string }
        | undefined;

    const baseTitle = typeof meta.title === "string" ? meta.title : undefined;
    const ogTitle = og?.title ?? baseTitle;
    const ogDescription = og?.description ?? meta.description ?? undefined;
    // 페이지가 공유 제목을 따로 지정했으면(og.title) 그 문구에 사이트명을 붙인다.
    const shareTitle =
        options.shareTitleSiteName && ogTitle ? withSiteNameSuffix(ogTitle) : ogTitle;

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
            title: shareTitle,
            description: ogDescription,
            url,
            images: [
                {
                    url: OG_IMAGE,
                    width: 1200,
                    height: 630,
                    alt: options.imageAlt ?? `${ogTitle ?? SITE_NAME}`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: shareTitle,
            description: ogDescription,
            images: [OG_IMAGE],
        },
    };
}
