import { readFileSync } from "node:fs";
import type { Metadata } from "next";
import { describe, expect, it } from "vitest";
import { CALCULATORS } from "@/lib/constants";
import { buildMetadata, SITE_NAME, withPageMetadata, withSiteNameSuffix } from "@/lib/metadata";
import { calculatorDetailPaths, inspectShareTitles } from "../scripts/site-url-checks.mjs";

// 계산기 상세 페이지의 공유 제목(og:title·twitter:title)은 끝에 " | 사이트명" 접미사가 정확히 한 번 붙는다.
// 규칙은 ‘끝의 접미사’만 본다: 접미사를 한 번 떼어 낸 본문이 비어 있거나 같은 접미사로 또 끝나면 안 된다.
// 본문 중간의 사이트명과 " | " 구분자는 허용하고, 공유 제목 문구는 검색 제목과 달라도 된다.
// 검색용 <title>, 공유 이미지 대체 텍스트, canonical 은 이 규칙의 대상이 아니다.
const SUFFIX = ` | ${SITE_NAME}`;
type Share = { title?: unknown; images?: { alt?: string }[] };
const og = (meta: Metadata) => meta.openGraph as Share;
const twitter = (meta: Metadata) => meta.twitter as Share;
/** 끝의 접미사 규칙: 접미사로 끝나고, 한 번 떼어 낸 본문이 비어 있지 않으며 같은 접미사로 또 끝나지 않는다. */
function expectSuffixOnce(shareTitle: unknown, label: string) {
  const value = String(shareTitle);
  expect(value.endsWith(SUFFIX), `${label}: 접미사로 끝나야 한다 — ${value}`).toBe(true);
  const body = value.slice(0, -SUFFIX.length);
  expect(body.trim(), `${label}: 제목 본문이 비어 있다 — ${value}`).not.toBe("");
  expect(body.trimEnd().endsWith(SUFFIX), `${label}: 접미사가 연속으로 붙었다 — ${value}`).toBe(false);
}
const shareHtml = (ogTitle: string, twitterTitle = ogTitle) => `<meta property="og:title" content="${ogTitle}"/><meta name="twitter:title" content="${twitterTitle}"/>`;
/** 메타데이터 생성 결과를 공유 태그 HTML 로 옮긴다(빌드 산출물 검사에 넣기 위한 테스트용). */
const shareHtmlOf = (meta: Metadata) => shareHtml(String(og(meta).title), String(twitter(meta).title));

describe("withSiteNameSuffix — 사이트명 접미사는 한 번만", () => {
  it("접미사가 없으면 붙인다", () => {
    expect(withSiteNameSuffix("코인 수익 계산기")).toBe(`코인 수익 계산기${SUFFIX}`);
  });
  it("이미 붙어 있으면 한 번만 유지한다", () => {
    expect(withSiteNameSuffix(`코인 수익 계산기${SUFFIX}`)).toBe(`코인 수익 계산기${SUFFIX}`);
    expect(withSiteNameSuffix(`코인 수익 계산기${SUFFIX}${SUFFIX}`)).toBe(`코인 수익 계산기${SUFFIX}`);
  });
  it("제목 본문 안의 ‘ | ’는 그대로 둔다", () => {
    const body = "코인 수익 계산기 | 현물 매수·매도 순손익·수익률 계산";
    expect(withSiteNameSuffix(body)).toBe(`${body}${SUFFIX}`);
    expect(withSiteNameSuffix(`${body}${SUFFIX}`)).toBe(`${body}${SUFFIX}`);
  });
  it("사이트명만 있으면 사이트명 하나만 남긴다", () => {
    expect(withSiteNameSuffix(SITE_NAME)).toBe(SITE_NAME);
  });
});

describe("withPageMetadata — shareTitleSiteName 옵션", () => {
  const meta: Metadata = { title: "검색 제목 | 부제", description: "설명", openGraph: { title: "공유 전용 제목 | 부제", description: "공유 설명" } };
  it("페이지가 지정한 공유 제목을 우선하고 접미사를 한 번 붙인다", () => {
    const out = withPageMetadata(meta, "/example", { shareTitleSiteName: true });
    expect(og(out).title).toBe(`공유 전용 제목 | 부제${SUFFIX}`);
    expect(twitter(out).title).toBe(`공유 전용 제목 | 부제${SUFFIX}`);
  });
  it("검색 제목과 다른 공유 제목: 두 공유 태그는 공유용 문구를 쓰고 검색 제목은 그대로다", () => {
    const out = withPageMetadata({ title: "검색용 제목", description: "설명", openGraph: { title: "공유용 제목 | 부제" } }, "/example", { shareTitleSiteName: true });
    expect(og(out).title).toBe("공유용 제목 | 부제 | 주식계산기.kr");
    expect(twitter(out).title).toBe("공유용 제목 | 부제 | 주식계산기.kr");
    expect(out.title).toBe("검색용 제목");
    expectSuffixOnce(og(out).title, "og:title");
    expectSuffixOnce(twitter(out).title, "twitter:title");
    // 같은 결과가 빌드 산출물 검사도 통과한다
    expect(inspectShareTitles(shareHtmlOf(out), SITE_NAME, "/example")).toEqual({ ogTitle: "공유용 제목 | 부제 | 주식계산기.kr", twitterTitle: "공유용 제목 | 부제 | 주식계산기.kr" });
  });
  it("본문에 사이트명이나 부제가 있는 공유 제목도 접미사는 끝에 한 번만 붙고 양쪽 검사를 통과한다", () => {
    for (const [body, expected] of [
      ["주식계산기.kr 사용법", "주식계산기.kr 사용법 | 주식계산기.kr"],
      ["수익률 계산기 | 사용 예시", "수익률 계산기 | 사용 예시 | 주식계산기.kr"],
    ]) {
      const out = withPageMetadata({ title: "검색용 제목", openGraph: { title: body } }, "/example", { shareTitleSiteName: true });
      expect(og(out).title).toBe(expected);
      expect(twitter(out).title).toBe(expected);
      expectSuffixOnce(og(out).title, "og:title");
      expectSuffixOnce(twitter(out).title, "twitter:title");
      expect(inspectShareTitles(shareHtmlOf(out), SITE_NAME, "/example").ogTitle).toBe(expected);
    }
  });
  it("공유 제목을 지정하지 않았으면 페이지 제목에 접미사를 붙인다", () => {
    const out = withPageMetadata({ title: "검색 제목 | 부제", description: "설명" }, "/example", { shareTitleSiteName: true });
    expect(og(out).title).toBe(`검색 제목 | 부제${SUFFIX}`);
    expect(twitter(out).title).toBe(`검색 제목 | 부제${SUFFIX}`);
  });
  it("공유 제목에 접미사가 이미 있으면 중복하지 않는다", () => {
    const out = withPageMetadata({ ...meta, openGraph: { title: `공유 전용 제목${SUFFIX}` } }, "/example", { shareTitleSiteName: true });
    expect(og(out).title).toBe(`공유 전용 제목${SUFFIX}`);
  });
  it("검색 제목·이미지 대체 텍스트·canonical 은 옵션과 무관하게 같다", () => {
    const off = withPageMetadata(meta, "/example");
    const on = withPageMetadata(meta, "/example", { shareTitleSiteName: true });
    expect(on.title).toBe("검색 제목 | 부제");
    expect(og(on).images).toEqual(og(off).images);
    expect(og(on).images?.[0].alt).toBe("공유 전용 제목 | 부제");
    expect(on.alternates).toEqual(off.alternates);
    expect(on.metadataBase).toEqual(off.metadataBase);
    expect({ ...on, openGraph: { ...on.openGraph, title: null }, twitter: { ...on.twitter, title: null } })
      .toEqual({ ...off, openGraph: { ...off.openGraph, title: null }, twitter: { ...off.twitter, title: null } });
  });
  it("옵션을 주지 않은 호출(홈·허브)은 공유 제목이 그대로다", () => {
    const off = withPageMetadata(meta, "/example");
    expect(og(off).title).toBe("공유 전용 제목 | 부제");
    expect(twitter(off).title).toBe("공유 전용 제목 | 부제");
  });
});

describe("buildMetadata — 공유 제목", () => {
  it("접미사를 한 번 붙이고, 이미 있으면 중복하지 않는다", () => {
    expect(og(buildMetadata({ title: "주식 수익률 계산기 | 수익률·평가 손익 계산", description: "d" })).title).toBe(`주식 수익률 계산기 | 수익률·평가 손익 계산${SUFFIX}`);
    const already = buildMetadata({ title: `전체 계산기${SUFFIX}`, description: "d" });
    expect(og(already).title).toBe(`전체 계산기${SUFFIX}`);
    expect(twitter(already).title).toBe(`전체 계산기${SUFFIX}`);
  });
});

const pages = import.meta.glob<{ metadata?: Metadata }>("../src/app/**/page.tsx");
const pageMetadata = async (path: string): Promise<Metadata> => {
  const key = `../src/app${path === "/" ? "" : path}/page.tsx`;
  const load = pages[key];
  if (!load) throw new Error(`페이지 모듈 없음: ${key}`);
  const meta = (await load()).metadata;
  if (!meta) throw new Error(`metadata 없음: ${key}`);
  return meta;
};
const DETAIL_PATHS = CALCULATORS.filter((c) => c.kind === "calculator").map((c) => c.href);

describe("계산기 상세 페이지 — og:title·twitter:title", () => {
  it("대상은 공개 계산기 상세 25곳이다", () => {
    expect(DETAIL_PATHS).toHaveLength(25);
  });
  for (const path of DETAIL_PATHS) {
    // 문구 선택(검색 제목과 같은지, 본문에 사이트명이 있는지)은 여기서 묻지 않는다. 끝의 접미사 규칙만 태그별로 본다.
    it(`${path}: og:title·twitter:title 각각 끝에 접미사가 한 번만 붙는다`, async () => {
      const meta = await pageMetadata(path);
      expectSuffixOnce(og(meta).title, `${path} og:title`);
      expectSuffixOnce(twitter(meta).title, `${path} twitter:title`);
      inspectShareTitles(shareHtmlOf(meta), SITE_NAME, path);
    });
  }
  it("대표 페이지의 최종 공유 제목", async () => {
    expect(og(await pageMetadata("/profit-calculator")).title).toBe("주식 수익률 계산기 | 수익률·평가 손익 계산 | 주식계산기.kr");
    expect(og(await pageMetadata("/crypto/profit")).title).toBe("코인 수익 계산기 | 현물 매수·매도 순손익·수익률 계산 | 주식계산기.kr");
    expect(twitter(await pageMetadata("/crypto/profit")).title).toBe("코인 수익 계산기 | 현물 매수·매도 순손익·수익률 계산 | 주식계산기.kr");
  });
  it("이미지 대체 텍스트는 예전 값 그대로다", async () => {
    expect(og(await pageMetadata("/crypto/profit")).images?.[0].alt).toBe("코인 수익 계산기 | 현물 매수·매도 순손익·수익률 계산");
    expect(og(await pageMetadata("/profit-calculator")).images?.[0].alt).toBe("주식 수익률 계산기 | 수익률·평가 손익 계산 | 주식계산기.kr");
  });
  it("범위 밖인 홈·허브의 공유 제목은 바꾸지 않았다", async () => {
    expect(og(await pageMetadata("/crypto")).title).toBe("코인 계산기 모음 | 투자 필수 툴 허브");
    for (const path of ["/", "/stocks", "/us-stocks"]) {
      const meta = await pageMetadata(path);
      expect(String(og(meta).title).endsWith(SUFFIX), path).toBe(false);
    }
  });
});

describe("빌드 산출물 검사(inspectShareTitles) — 접미사가 빠지거나 중복되면 실패", () => {
  const html = shareHtml;
  const good = "코인 수익 계산기 | 현물 매수·매도 순손익·수익률 계산 | 주식계산기.kr";
  it("정상 제목은 통과한다", () => {
    expect(inspectShareTitles(html(good), SITE_NAME, "/x")).toEqual({ ogTitle: good, twitterTitle: good });
  });
  it("접미사가 빠지면 실패한다(og·twitter 각각)", () => {
    const missing = "코인 수익 계산기 | 현물 매수·매도 순손익·수익률 계산";
    expect(() => inspectShareTitles(html(missing, good), SITE_NAME, "/x")).toThrow(/og:title must end/);
    expect(() => inspectShareTitles(html(good, missing), SITE_NAME, "/x")).toThrow(/twitter:title must end/);
  });
  it("접미사가 연속으로 중복되면 실패한다(og·twitter 각각)", () => {
    const twice = "수익률 계산기 | 주식계산기.kr | 주식계산기.kr";
    expect(() => inspectShareTitles(html(twice), SITE_NAME, "/x")).toThrow(/og:title repeats the site name suffix/);
    expect(() => inspectShareTitles(html(twice, good), SITE_NAME, "/x")).toThrow(/og:title repeats the site name suffix/);
    expect(() => inspectShareTitles(html(good, twice), SITE_NAME, "/x")).toThrow(/twitter:title repeats the site name suffix/);
  });
  it("본문 중간의 사이트명과 ‘ | ’ 부제는 통과한다", () => {
    for (const title of ["주식계산기.kr 사용법 | 주식계산기.kr", "수익률 계산기 | 사용 예시 | 주식계산기.kr"]) {
      expect(inspectShareTitles(html(title), SITE_NAME, "/x")).toEqual({ ogTitle: title, twitterTitle: title });
      expectSuffixOnce(title, title);
    }
  });
  it("본문에 사이트명이 있어도 끝의 접미사가 없으면 실패한다", () => {
    expect(() => inspectShareTitles(html("주식계산기.kr 사용법"), SITE_NAME, "/x")).toThrow(/og:title must end/);
    expect(() => inspectShareTitles(html(good, "주식계산기.kr 사용법"), SITE_NAME, "/x")).toThrow(/twitter:title must end/);
  });
  it("og:title 과 twitter:title 의 문구가 서로 달라도 각각 규칙을 지키면 통과한다", () => {
    expect(inspectShareTitles(html(good, "코인 수익 계산기 | 주식계산기.kr"), SITE_NAME, "/x").twitterTitle).toBe("코인 수익 계산기 | 주식계산기.kr");
  });
  it("태그가 없거나 둘 이상이면 실패한다", () => {
    expect(() => inspectShareTitles(`<meta property="og:title" content="${good}"/>`, SITE_NAME, "/x")).toThrow(/twitter:title count/);
    expect(() => inspectShareTitles(html(good) + `<meta property="og:title" content="${good}"/>`, SITE_NAME, "/x")).toThrow(/og:title count/);
  });
  it("제목 본문이 비어 있으면 실패한다(og·twitter 각각)", () => {
    expect(() => inspectShareTitles(html(" | 주식계산기.kr"), SITE_NAME, "/x")).toThrow(/og:title has no page title/);
    expect(() => inspectShareTitles(html(good, "  | 주식계산기.kr"), SITE_NAME, "/x")).toThrow(/twitter:title has no page title/);
  });
  it("빌드 검사가 읽는 계산기 경로는 CALCULATORS 의 계산기 항목과 같다", () => {
    expect(calculatorDetailPaths(readFileSync("src/lib/constants.ts", "utf8"))).toEqual(DETAIL_PATHS);
  });
});
