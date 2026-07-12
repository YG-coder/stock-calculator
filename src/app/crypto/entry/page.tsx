import type { Metadata } from "next";
import CryptoEntryCalculator from "@/components/calculator/CryptoEntryCalculator";
import CalculatorPageTemplate from "@/components/calculator/CalculatorPageTemplate";
import CalculatorJsonLd from "@/components/seo/CalculatorJsonLd";
import { calculatorPages } from "@/lib/calculatorPages";

const config = calculatorPages["crypto-entry-calculator"];

export const metadata: Metadata = config.metadata;

export default function CryptoEntryPage() {
    return (
        <CalculatorPageTemplate config={config}>
            <CalculatorJsonLd config={config} path="/crypto/entry" />
            <CryptoEntryCalculator />

            {/* 고위험 경고 박스 */}
            <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
                <p className="font-semibold mb-2">⚠ 고위험 거래 주의</p>
                <p>
                    레버리지 거래는 원금 손실 가능성이 매우 높은 고위험 투자입니다.
                    작은 가격 변동만으로도 단시간에 청산되어 원금 전액을 잃을 수 있으며,
                    본 계산기에서 제시되는 권장 배율은 이론적 최대치이므로 실제로는
                    더 보수적인 배율과 리스크 비율을 사용하는 것을 권장합니다.
                </p>
            </section>

            {/* SEO 콘텐츠 */}
            <section className="mt-14 space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-10">
                <h2 className="text-xl font-bold text-slate-800">코인 레버리지 진입 계산기에 대해 더 알아보기</h2>
                <p>
                    코인 레버리지 진입 계산기는 진입가와 손절가의 차이(손절폭)를 기준으로 권장 레버리지 배율과
                    포지션 진입 금액을 계산하는 도구입니다. 단순한 수익률 계산이 아니라, 손실 한도를 먼저 정하고
                    그에 맞는 진입 금액을 역산하는 방식이라 리스크 관리에 유용합니다.
                </p>

                <h3 className="text-base font-semibold text-slate-800">이 계산기가 필요한 이유</h3>
                <p>
                    레버리지 거래에서 가장 흔한 실수는 감정적으로 배율을 정하는 것입니다.
                    그러나 진짜 중요한 기준은 &quot;얼마까지 잃어도 괜찮은가&quot;입니다.
                    손절폭과 시드 대비 리스크 비율을 먼저 정한 뒤 진입 금액을 역산하면,
                    감정이 아니라 규칙으로 거래 사이즈를 결정할 수 있습니다.
                </p>

                <h3 className="text-base font-semibold text-slate-800">언제 사용하면 좋을까요?</h3>
                <p>
                    선물 포지션에 진입하기 직전, 손절가가 정해졌고 시드와 감수 가능한 리스크 비율을
                    알고 있을 때 가장 유용합니다. 권장 배율은 이론적 최대치이므로 실제 진입은
                    이보다 낮은 배율을 사용하는 것이 일반적입니다.
                </p>

                <h3 className="text-base font-semibold text-slate-800">사용 예시</h3>
                <p>
                    예시: 시드 100 USDT, 진입가 10,000 USDT, 손절가 9,800 USDT (손절폭 2%),
                    리스크 비율 3%인 경우 → 권장 배율 50배, 리스크 금액 3 USDT,
                    주문 명목가치 150 USDT로 계산됩니다.
                </p>

                <h3 className="text-base font-semibold text-slate-800">주의사항</h3>
                <p>
                    본 계산기 결과는 참고용 수치이며 실제 투자 결과를 보장하지 않습니다.
                    거래소 수수료, 펀딩비, 슬리피지 등이 반영되지 않으므로 실제 청산 가격은
                    더 가까울 수 있습니다. 레버리지 거래는 고위험 투자이며, 본인의 손실 감내
                    범위를 넘는 진입은 권장되지 않습니다.
                </p>
            </section>
        </CalculatorPageTemplate>
    );
}
