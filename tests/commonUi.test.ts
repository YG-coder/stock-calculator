import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, readdirSync } from "node:fs";
import { withParticle } from "@/lib/korean";
import { requiredNumber } from "@/lib/uiInput";
import { uiHarness, visibleCopy, identifiers } from "./uiHarness";
import CurrencyToggle from "@/components/calculator/CurrencyToggle";
import Average from "@/components/calculator/AveragePriceCalculator";
import CryptoAverage from "@/components/calculator/CryptoAverageCalculator";
import Rebalance from "@/components/calculator/NoSellRebalancingCalculator";
import Portfolio from "@/components/calculator/PortfolioCalculator";
const simulation = vi.hoisted(() => ({ run: vi.fn(), reset: vi.fn(), status: "idle", result: null, progress: null, error: null, mode: "worker", cancel: vi.fn() }));
vi.mock("@/hooks/useMonteCarlo", () => ({ useMonteCarlo: () => simulation }));
vi.mock("next/navigation", () => ({ usePathname: () => "/test" }));

it("Korean particles follow final consonants", () => {
 expect(withParticle("항생제", "을/를")).toBe("항생제를");
 expect(withParticle("희귀의약품", "을/를")).toBe("희귀의약품을");
 expect(withParticle("금액", "이/가")).toBe("금액이");
 expect(withParticle("수수료", "은/는")).toBe("수수료는");
 expect(withParticle("보험", "과/와")).toBe("보험과");
 expect(withParticle("주사", "과/와")).toBe("주사와");
});
it("currency toggles expose exactly the selected option", () => {
 for (const value of ["KRW", "USD"]) {
  const html=renderToStaticMarkup(createElement(CurrencyToggle, { value, options:["KRW","USD"] as const, onChange:()=>{} }));
  expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
  expect(html).toMatch(new RegExp(`aria-pressed="true"[^>]*>${value}<`));
 }
});
describe.each([[Average,"price-","qty-"],[CryptoAverage,"c-price-","c-qty-"]] as const)("complete purchase rows", (Component,price,quantity) => {
 it("ignores an entirely blank spare row but holds a partially entered row", () => {
  const view=uiHarness(Component); view.change(price+"1","1000"); view.change(quantity+"1","2");
  expect(view.props("ResultCard")?.isValid).toBe(true);
  expect(view.html()).toContain("2,000"); // 1,000 × 2, independently calculated
  view.change(price+"2","2000"); expect(view.props("ResultCard")?.isValid).toBe(false);
  view.change(quantity+"2","1"); expect(view.props("ResultCard")?.isValid).toBe(true);
  expect(view.html()).toContain("4,000"); // 1,000 × 2 + 2,000 × 1
 });
});
it("rebalancing requires an explicit contribution including zero", () => {
 const view=uiHarness(Rebalance);
 [50,30,20].forEach((v,i)=>view.change(`asset-value-${i}`,String(v)));
 [40,40,20].forEach((v,i)=>view.change(`asset-weight-${i}`,String(v)));
 expect(view.html()).not.toContain("추천 매수</th>");
 view.change("rebalancing-contribution","0"); expect(view.html()).toContain("추천 매수</th>");
 view.change("rebalancing-contribution",""); expect(view.html()).not.toContain("추천 매수</th>");
});
it("portfolio holds unknown assumptions, permits explicit zero and ignores zero-weight assets", () => {
 const view=uiHarness(Portfolio);
 [100,0,0].forEach((v,i)=>view.change(`portfolio-weight-${i}`,String(v)));
 expect(view.html()).not.toContain("연 기대수익률</p>");
 view.change("portfolio-return-0","0"); view.change("portfolio-volatility-0","0");
 expect(view.html()).toContain("0.00"); expect(view.props("ResultCard")).toBeUndefined();
 view.change("portfolio-return-0",""); expect(view.props("ResultCard")?.isValid).toBe(false);
});
it("simulation form edits clear the previous result and warning", async () => {
 const { default: Dca }=await import("@/components/calculator/DcaCalculator");
 const view=uiHarness(Dca); simulation.reset.mockClear(); view.change("dca-initial","0");
 expect(simulation.reset).toHaveBeenCalledOnce();
 expect(requiredNumber("")).toBeNaN(); expect(requiredNumber("0")).toBe(0);
});
it("calculator render text has no internal identifiers", async () => {
 const files=readdirSync("src/components/calculator").filter(f=>f.endsWith("Calculator.tsx"));
 for(const file of files) {
  const {default:Component}=await import(`../src/components/calculator/${file.replace(/\.tsx$/, "")}.tsx`);
  const text=visibleCopy(uiHarness(Component).html()); expect(identifiers(text),file).toEqual([]);
 }
});
it("dynamic particles cannot bypass the shared helper", () => {
 function scan(dir:string) { for(const entry of readdirSync(dir,{withFileTypes:true})) {
  const path=`${dir}/${entry.name}`; if(entry.isDirectory())scan(path);
  else if(/\.tsx?$/.test(path)) expect(readFileSync(path,"utf8").match(/\}(?:을|를)(?=[\s<.,!?])/g),path).toBeNull();
 }} scan("src");
});
