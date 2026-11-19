import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CALCULATORS } from "@/lib/constants";
import { calculatorPages } from "@/lib/calculatorPages";

// 목록 카드의 제목이 목적지 화면의 제목과 같은지 검사한다.
// 카드 제목은 해당 href 를 가진 카드(<a>) 안에서만 읽는다.
// 페이지의 다른 본문·설명에 같은 낱말이 있다는 이유로 통과하지 않는다(맨 아래 ‘검사 범위’ 참고).
vi.mock("next/navigation", () => ({ usePathname: () => "/crypto/average" }));

const TARGET = "/crypto/average";
const decode = (s: string) => s.replace(/&amp;/g, "&").trim();
/** href 가 정확히 일치하는 카드(<a>…</a>)의 안쪽 HTML. 카드가 없거나 여러 개면 실패한다. */
function cardFor(html: string, href: string): string {
  const cards = [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].filter((m) => m[1] === href);
  if (cards.length !== 1) throw new Error(`${href} 카드 수가 1이 아닙니다: ${cards.length}`);
  return cards[0][2];
}
/** 카드 안의 제목 요소(titleTag) 글자만 돌려준다. */
function cardTitle(html: string, href: string, titleTag: "h2" | "p"): string {
  const match = cardFor(html, href).match(new RegExp(`<${titleTag}\\b[^>]*>([^<]*)</${titleTag}>`));
  if (!match) throw new Error(`${href} 카드에 <${titleTag}> 제목이 없습니다.`);
  return decode(match[1]);
}
async function render(importer: () => Promise<{ default: () => unknown }>): Promise<string> {
  const mod = await importer();
  return renderToStaticMarkup(createElement(mod.default as () => null));
}
/** 목적지 화면을 렌더링해 <h1> 제목을 읽는다. */
async function destinationTitle(): Promise<string> {
  const html = await render(() => import("@/app/crypto/average/page"));
  const h1 = [...html.matchAll(/<h1\b[^>]*>([^<]*)<\/h1>/g)];
  expect(h1).toHaveLength(1);
  return decode(h1[0][1]);
}

// 각 목록에서 카드 제목을 담는 첫 요소: /calculators 는 <p>, /crypto 는 <h2>
const LISTS = [
  { path: "/calculators", titleTag: "p" as const, importer: () => import("@/app/calculators/page") },
  { path: "/crypto", titleTag: "h2" as const, importer: () => import("@/app/crypto/page") },
];

describe("코인 물타기·불타기 계산기 — 목록 카드 제목", () => {
  it("목적지 화면의 제목은 ‘코인 물타기·불타기 계산기’다", async () => {
    expect(await destinationTitle()).toBe("코인 물타기·불타기 계산기");
    expect(calculatorPages["crypto-average-calculator"].title).toBe("코인 물타기·불타기 계산기");
  });
  for (const list of LISTS) {
    it(`${list.path}: ${TARGET} 카드의 제목이 목적지 화면 제목과 같다`, async () => {
      const html = await render(list.importer);
      expect(cardTitle(html, TARGET, list.titleTag)).toBe(await destinationTitle());
    });
  }
  it("짧은 탐색 라벨은 그대로다", () => {
    expect(CALCULATORS.find((c) => c.href === TARGET)?.label).toBe("코인 물타기");
  });
});

describe("검사 범위 — 카드 밖의 같은 낱말로는 통과하지 않는다", () => {
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
  it("대상 카드가 없으면 실패한다", () => {
    expect(() => cardTitle(body + card("코인 물타기·불타기 계산기", "/crypto/profit"), TARGET, "h2")).toThrow("카드 수가 1이 아닙니다");
  });
});
