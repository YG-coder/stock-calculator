/**
 * SEO용 공통 콘텐츠 컴포넌트
 * - 애드센스 승인 필수
 * - 모든 계산기 페이지 하단에 삽입
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
            <p>{description}</p>

            {formula && (
                <>
                    <h3 className="text-lg font-semibold">계산 공식</h3>
                    <p className="bg-gray-100 p-3 rounded">{formula}</p>
                </>
            )}

            <h3 className="text-lg font-semibold">사용 방법</h3>
            <ul className="list-disc pl-5 space-y-1">
                <li>값을 입력하면 자동으로 결과가 계산됩니다.</li>
                <li>결과를 참고하여 투자 또는 재무 판단에 활용하세요.</li>
            </ul>

            <h3 className="text-lg font-semibold">주의사항</h3>
            <p>
                본 계산기는 참고용이며 실제 수익은 수수료, 세금, 시장 상황에 따라 달라질 수 있습니다.
            </p>

            <h3 className="text-lg font-semibold">자주 묻는 질문 (FAQ)</h3>
            <ul className="list-disc pl-5 space-y-1">
                <li>Q. 결과가 실제와 다른 이유는?</li>
                <li>A. 세금, 수수료, 환율 등이 포함되지 않을 수 있습니다.</li>
                <li>Q. 무료로 사용 가능한가요?</li>
                <li>A. 모든 계산기는 무료로 제공됩니다.</li>
            </ul>
        </section>
    )
}