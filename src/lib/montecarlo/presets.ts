/**
 * src/lib/montecarlo/presets.ts
 * 역할: 자산배분 프리셋 **데이터 계층**. 엔진은 이 파일을 알지 못한다.
 *
 * 규칙 (docs/2026-08-22-portfolio-assumptions-design.md §8)
 *   출처(source)와 기준일(asOf)이 없으면 프리셋을 만들지 않는다.
 *   감사에서 사이트 전체의 기준일·출처가 0건이었고, 새 기능에서 같은 결함을 반복하지 않기 위한 조건이다.
 *
 * 현재 상태: **프리셋 수치의 1차 출처가 확정되지 않아 목록이 비어 있다.**
 * 출처가 확보되기 전까지 화면은 "직접 입력"만 제공한다. 이 결정이 v1 착수를 막지 않는다.
 */

import type { PortfolioPreset } from "./types";

export const PORTFOLIO_PRESETS: readonly PortfolioPreset[] = [];

/**
 * 물가상승률 기본값.
 * 장기 시뮬레이션의 기본값으로 특정 시점 실측치를 박으면 그 해의 국면이 전 기간에 고정된다.
 * 그래서 **정책 목표치**를 쓰고, 사용자가 조정할 수 있게 둔다.
 */
export const DEFAULT_INFLATION = {
  value: 0.02,
  label: "연 2.0%",
  source: "한국은행 물가안정목표 (소비자물가 상승률 전년동기대비 2%)",
  asOf: "2026-08-22",
  caveat:
    "실제 소비자물가는 시기에 따라 목표를 웃돌 수 있습니다. 최근 물가가 높다고 보시면 값을 직접 올려 확인해 보세요.",
} as const;

export function findPreset(id: string): PortfolioPreset | undefined {
  return PORTFOLIO_PRESETS.find((p) => p.id === id);
}
