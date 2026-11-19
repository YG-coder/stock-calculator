import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CALCULATORS } from "@/lib/constants";

// 목록 카드의 제목이 목적지 화면의 제목과 같은지 검사한다.
// 카드 제목은 해당 href 를 가진 카드(<a>) 안에서만 읽는다.
// 페이지의 다른 본문·설명에 같은 낱말이 있다는 이유로 통과하지 않는다(맨 아래 ‘검사 범위’ 참고).
const env = vi.hoisted(() => ({ path: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => env.path }));

type PageModule = { default: () => unknown };
const decode = (s: string) => s.replace(/&amp;/g, "&").trim();
/** href 가 정확히 일치하는 카드(<a>…</a>)들의 안쪽 HTML */
const cardsFor = (html: string, href: string): string[] =>
  [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].filter((m) => m[1] === href).map((m) => m[2]);
/** 카드가 정확히 하나일 때 그 안의 제목 요소(titleTag) 글자만 돌려준다. 없거나 여러 개면 실패한다. */
function cardTitle(html: string, href: string, titleTag: "h2" | "p"): string {
  const cards = cardsFor(html, href);
  if (cards.length !== 1) throw new Error(`${href} 카드 수가 1이 아닙니다: ${cards.length}`);
  const match = cards[0].match(new RegExp(`<${titleTag}\\b[^>]*>([^<]*)</${titleTag}>`));
  if (!match) throw new Error(`${href} 카드에 <${titleTag}> 제목이 없습니다.`);
  return decode(match[1]);
}
async function render(path: string, importer: () => Promise<PageModule>): Promise<string> {
  env.path = path;
  const mod = await importer();
  return renderToStaticMarkup(createElement(mod.default as () => null));
}
/** 목적지 화면을 렌더링해 <h1> 제목을 읽는다. */
async function destinationTitle(path: string, importer: () => Promise<PageModule>): Promise<string> {
  const html = await render(path, importer);
  const h1 = [...html.matchAll(/<h1\b[^>]*>([^<]*)<\/h1>/g)];
  expect(h1).toHaveLength(1);
  return decode(h1[0][1]);
}

// 각 목록에서 카드 제목을 담는 첫 요소: /calculators 는 <p>, 자산별 모음(/crypto, /us-stocks)은 <h2>
type List = { path: string; titleTag: "h2" | "p"; importer: () => Promise<PageModule> };
const ALL: List = { path: "/calculators", titleTag: "p", importer: () => import("@/app/calculators/page") };
const CRYPTO: List = { path: "/crypto", titleTag: "h2", importer: () => import("@/app/crypto/page") };
const US_STOCKS: List = { path: "/us-stocks", titleTag: "h2", importer: () => import("@/app/us-stocks/page") };

const TARGETS: { href: string; title: string; label: string; page: () => Promise<PageModule>; lists: List[] }[] = [
  { href: "/crypto/average", title: "코인 물타기·불타기 계산기", label: "코인 물타기", page: () => import("@/app/crypto/average/page"), lists: [ALL, CRYPTO] },
  { href: "/us-stocks/exchange-profit", title: "미국주식 환율 반영 수익 계산기", label: "환율 수익", page: () => import("@/app/us-stocks/exchange-profit/page"), lists: [ALL, US_STOCKS] },
];

for (const target of TARGETS) {
  describe(`${target.title} — 목록 카드 제목`, () => {
    it(`목적지 화면(${target.href})의 <h1>은 ‘${target.title}’다`, async () => {
      expect(await destinationTitle(target.href, target.page)).toBe(target.title);
    });
    for (const list of target.lists) {
      it(`${list.path}: ${target.href} 카드는 정확히 하나이고 제목이 목적지 화면 제목과 같다`, async () => {
        const html = await render(list.path, list.importer);
        expect(cardsFor(html, target.href)).toHaveLength(1);
        const title = cardTitle(html, target.href, list.titleTag);
        expect(title).toBe(target.title);
        expect(title).toBe(await destinationTitle(target.href, target.page));
      });
    }
    it("짧은 탐색 라벨은 그대로다", () => {
      expect(CALCULATORS.find((c) => c.href === target.href)?.label).toBe(target.label);
    });
  });
}

describe("검사 범위 — 카드 밖의 같은 낱말로는 통과하지 않는다", () => {
  const TARGET = "/crypto/average";
  const body = "<p>물타기·불타기 계산기까지 한 곳에서 확인하세요. 코인 물타기·불타기 계산기</p>";
  const card = (title: string, href = TARGET) => `<a class="card" href="${href}"><span>평균 단가</span><h2 class="t">${title}</h2><p>설명</p></a>`;
  it("본문에만 ‘불타기’가 있고 카드 제목이 예전 이름이면 예전 이름을 읽는다", () => {
    const html = body + card("코인 물타기 계산기");
    expect(html).toContain("코인 물타기·불타기 계산기");
    expect(cardTitle(html, TARGET, "h2")).toBe("코인 물타기 계산기");
  });
  it("다른 링크의 카드 제목은 읽지 않는다", () => {
    const html = card("코인 물타기·불타기 계산기", "/crypto/average-other") + card("코인 물타기 계산기");
    expect(cardTitle(html, TARGET, "h2")).toBe("코인 물타기 계산기");
  });
  it("대상 카드가 없거나 둘 이상이면 실패한다", () => {
    expect(() => cardTitle(body + card("코인 물타기·불타기 계산기", "/crypto/profit"), TARGET, "h2")).toThrow("카드 수가 1이 아닙니다: 0");
    expect(() => cardTitle(card("코인 물타기·불타기 계산기") + card("코인 물타기·불타기 계산기"), TARGET, "h2")).toThrow("카드 수가 1이 아닙니다: 2");
  });
});
