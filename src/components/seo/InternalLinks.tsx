import Link from "next/link"

export default function InternalLinks() {
    return (
        <div className="mt-10 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-3">함께 보면 좋은 계산기</h3>

            <ul className="space-y-2 text-sm">
                <li><Link href="/average-price-calculator">평단가 계산기</Link></li>
                <li><Link href="/profit-calculator">수익률 계산기</Link></li>
                <li><Link href="/target-price-calculator">목표가 계산기</Link></li>
                <li><Link href="/break-even-calculator">손익분기 계산기</Link></li>
            </ul>
        </div>
    )
}