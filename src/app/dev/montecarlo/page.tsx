import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MonteCarloLab from "@/components/dev/MonteCarloLab";

/**
 * 개발 전용 엔진 검증 화면.
 *
 * 프로덕션 빌드에서는 notFound() 로 라우트 자체가 404 가 된다.
 *  - 공개 메뉴(constants.ts CALCULATORS)에 등록하지 않았으므로 sitemap 에도 들어가지 않는다
 *  - 미완성 도구가 색인되거나 애드센스 심사 대상에 포함되지 않아야 한다
 */
// 프로덕션에서는 404 로 응답하지만, 혹시 모를 노출에 대비해 noindex 를 함께 건다.
// 제목은 일부러 두지 않는다 — 404 응답 본문에 미완성 도구 이름이 실리지 않도록.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DevMonteCarloPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MonteCarloLab />;
}
