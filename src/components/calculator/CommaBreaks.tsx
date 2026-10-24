import { Children, Fragment, cloneElement, isValidElement, type ReactNode } from "react";

/**
 * 긴 숫자의 쉼표 뒤에 줄바꿈 기회(<wbr>)만 넣는다. 글자·쉼표·자릿수는 그대로라 화면 텍스트는 같다.
 */
function withCommaBreaks(text: string): ReactNode {
  const parts = text.split(",");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 ? (
        <>
          ,<wbr />
        </>
      ) : null}
    </Fragment>
  ));
}

/**
 * 결과 항목(ResultHighlight·ResultDetail)의 값은 형식화된 문자열 그대로 넘기고, 화면에 그릴 때만
 * 쉼표 뒤 줄바꿈 기회를 넣고 `wrap-anywhere`(쉼표로도 안 들어가는 긴 덩어리의 마지막 대비책)를 붙인다.
 * 좁은 화면에서 큰 금액이 카드 밖으로 넘치지 않게 하며, 글자 크기·숫자·단위는 바꾸지 않는다.
 * 사용처: 배당·미국주식 배당·미국주식 환율 수익·증권거래세 결과 카드(포지션 규모는 같은 방식의 자체 구현).
 */
export default function CommaBreaks({ children }: { children: ReactNode }) {
  return (
    <>
      {Children.map(children, (child) =>
        isValidElement<{ value?: ReactNode; className?: string }>(child) && typeof child.props.value === "string"
          ? cloneElement(child, {
              value: withCommaBreaks(child.props.value),
              className: [child.props.className, "wrap-anywhere"].filter(Boolean).join(" "),
            })
          : child,
      )}
    </>
  );
}
