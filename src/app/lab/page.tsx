import type { Metadata } from "next";
import BacktestLab from "@/components/calculator/BacktestLab";
import { PageHeader } from "@/components/ui/Shared";
import { buildMetadata } from "@/lib/metadata";

const title = "사용자 자료 백테스트 실험실";
const description = "직접 입력한 월별 수익률 자료로 적립식 투자 시작 구간을 비교하는 실험 도구입니다.";
export const metadata: Metadata = { ...buildMetadata({ title, description, path: "/lab" }), robots: { index: false, follow: false } };
export default function Page() { return <main className="min-h-screen bg-slate-50 pb-20"><PageHeader badge="LAB · 실험 기능" title="사용자 자료 백테스트" description="직접 붙여넣은 월별 수익률로 가능한 모든 연속 투자 구간을 비교합니다. 입력 자료는 브라우저 밖으로 전송하지 않습니다." /><div className="mx-auto max-w-5xl px-6 py-12 md:px-8"><BacktestLab /></div></main>; }
