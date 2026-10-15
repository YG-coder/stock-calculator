import { SITE } from "@/lib/site";
export default function JsonLd() {
    const data = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "주식계산기",
        url: SITE.url,
        description: "주식, 투자, 금융 계산기를 무료로 제공하는 사이트",
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    )
}