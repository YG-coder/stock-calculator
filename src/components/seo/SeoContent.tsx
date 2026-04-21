/**
 * SEO + 애드센스 승인용 콘텐츠 컴포넌트 (최종 버전)
 */

type Props = {
    title: string
    description: string
    formula?: string
}

export default function SeoContent({ title, description, formula }: Props) {
    return (
        <section className="mt-12 space-y-6 text-sm text-gray-700 leading-relaxed">

            <h2 className="text-xl font-bold">{title}란?</h2>
            <p>
                {description}
            </p>

            <p>
                이 계산기는 복잡한 금융 계산을 간단하게 처리할 수 있도록 설계된 도구입니다.
                투자자 및 일반 사용자 누구나 쉽게 사용할 수 있으며,
                빠른 의사결정을 돕는 것을 목표로 합니다.
            </p>

            {formula && (
                <>
                    <h3 className="text-lg font-semibold">계산 공식</h3>
                    <p className="bg-gray-100 p-3 rounded">{formula}</p>
                </>
            )}

            <h3 className="text-lg font-semibold">언제 사용하면 좋을까?</h3>
            <p>
                투자 수익률을 확인하거나, 추가 매수 여부를 판단할 때,
                또는 손절 및 목표가 설정과 같은 전략을 세울 때 유용하게 사용할 수 있습니다.
            </p>

            <h3 className="text-lg font-semibold">사용 방법</h3>
            <ul className="list-disc pl-5 space-y-1">
                <li>필요한 값을 입력합니다.</li>
                <li>입력 즉시 결과가 자동으로 계산됩니다.</li>
                <li>결과를 기반으로 투자 전략을 판단할 수 있습니다.</li>
            </ul>

            <h3 className="text-lg font-semibold">사용 예시</h3>
            <p>
                예를 들어 특정 가격에 주식을 매수한 후 현재 가격을 입력하면,
                현재 수익률을 즉시 확인할 수 있습니다.
                이를 통해 매도 시점이나 추가 매수 전략을 결정할 수 있습니다.
            </p>

            <h3 className="text-lg font-semibold">주의사항</h3>
            <p>
                본 계산기는 참고용이며 실제 투자 결과를 보장하지 않습니다.
                수수료, 세금, 시장 상황 등을 반드시 고려해야 합니다.
            </p>

            <h3 className="text-lg font-semibold">자주 묻는 질문 (FAQ)</h3>
            <ul className="list-disc pl-5 space-y-1">
                <li>Q. 결과가 실제와 다른 이유는?</li>
                <li>A. 세금, 수수료, 환율 등이 포함되지 않을 수 있습니다.</li>
                <li>Q. 무료로 사용 가능한가요?</li>
                <li>A. 모든 계산기는 무료로 제공됩니다.</li>
            </ul>

            {/* 🔥 핵심: 내부 링크 */}
            <div className="pt-4 border-t">
                <p className="font-semibold">관련 계산기</p>
                <ul className="list-disc ml-5">
                    <li><a href="/average-price" className="text-blue-600">평단가 계산기</a></li>
                    <li><a href="/loss-cut" className="text-blue-600">손절가 계산기</a></li>
                    <li><a href="/target-price" className="text-blue-600">목표가 계산기</a></li>
                </ul>
            </div>

        </section>
    )
}