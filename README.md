# 주식계산기.kr (stock-calculator)

국내주식·미국주식·코인 투자 계산기와 몬테카를로 기반 장기 투자 시뮬레이션을 제공하는 Next.js 웹 서비스입니다.

- 운영 사이트: <https://주식계산기.kr>
- 이 문서 기준일: 2026-09-16 (main 브랜치 `3f3f4c5` 기준)

## 목차

- [공개 페이지](#공개-페이지)
- [몬테카를로 시뮬레이션 엔진](#몬테카를로-시뮬레이션-엔진)
- [콘텐츠 검수와 색인](#콘텐츠-검수와-색인)
- [기술 스택](#기술-스택)
- [실행 방법](#실행-방법)
- [검사와 테스트](#검사와-테스트)
- [배포](#배포)
- [디렉터리 구조](#디렉터리-구조)
- [문서](#문서)

---

## 공개 페이지

계산기 목록의 단일 소스는 `src/lib/constants.ts` 의 `CALCULATORS` 입니다. 여기에 등록하면
허브 페이지·전체 목록(`/calculators`)·사이트맵(`src/app/sitemap.ts`)에 자동으로 반영됩니다.
현재 등록된 항목은 **계산기 25종 + 허브 3종**입니다.

### 국내 주식 (16종)

| 경로 | 계산기 |
|---|---|
| `/profit-calculator` | 주식 수익률 계산기 |
| `/average-price-calculator` | 물타기 평단가 계산기 |
| `/target-price-calculator` | 주식 목표가 계산기 |
| `/stop-loss-calculator` | 주식 손절가 계산기 |
| `/break-even-calculator` | 본전 회복 계산기 |
| `/risk-reward-calculator` | 손익비 계산기 |
| `/position-size-calculator` | 포지션 사이즈 계산기 |
| `/dividend-calculator` | 배당 수익 계산기 |
| `/compound-interest-calculator` | 복리 계산기 |
| `/stock-transaction-tax-calculator` | 증권거래세 계산기 |
| `/dca-calculator` | 적립식 투자 시뮬레이션 (몬테카를로) |
| `/goal-probability-calculator` | 투자 목표달성확률 계산기 (몬테카를로) |
| `/fire-calculator` | FIRE 은퇴 시뮬레이션 (몬테카를로) |
| `/sequence-risk-calculator` | 수익률 순서 위험 계산기 (몬테카를로 + 정순·역순 비교) |
| `/no-sell-rebalancing-calculator` | 무매도 리밸런싱 계산기 |
| `/portfolio-calculator` | 포트폴리오 기대수익률·변동성 계산기 |

### 미국 주식 (3종)

| 경로 | 계산기 |
|---|---|
| `/overseas-stock-tax-calculator` | 해외주식 세금 계산기 |
| `/us-stocks/exchange-profit` | 환율 반영 수익 계산기 |
| `/us-stocks/dividend` | 미국주식 배당 계산기 |

### 코인 (6종)

| 경로 | 계산기 |
|---|---|
| `/crypto/entry` | 코인 레버리지 진입 계산기 |
| `/crypto/liquidation` | 코인 청산가 계산기 |
| `/crypto/leverage-profit` | 코인 레버리지 수익 계산기 |
| `/crypto/profit` | 코인 수익 계산기 |
| `/crypto/funding-fee` | 펀딩비 계산기 |
| `/crypto/average` | 코인 물타기 계산기 |

### 허브와 그 밖의 페이지

| 경로 | 설명 |
|---|---|
| `/` | 홈 |
| `/stocks`, `/crypto`, `/us-stocks` | 카테고리 허브 3종 |
| `/calculators` | 전체 계산기 목록 |
| `/guides`, `/guides/[slug]` | 투자 가이드 (현재 발행 7편, `src/data/guidePages.ts`) |
| `/lab` | 사용자 자료 백테스트 실험 도구. `robots: noindex` |
| `/dev/montecarlo` | 엔진 검증용 개발 화면. **프로덕션 빌드에서는 404** |
| `/about`, `/contact`, `/privacy`, `/terms` | 정책·소개 페이지 |

---

## 몬테카를로 시뮬레이션 엔진

- 엔진 버전 **1.0.1** — `ENGINE_VERSION` (`src/lib/montecarlo/types.ts`)
- 브라우저 Web Worker 에서 실행하며, 입력값은 서버로 전송하지 않습니다.
- 현재 이 엔진을 쓰는 공개 계산기: 적립식 시뮬레이션, 목표달성확률, FIRE, 수익률 순서 위험.

모형 가정·연→월 변환·목표 역산·검증 범위는 **[docs/montecarlo-engine.md](docs/montecarlo-engine.md)** 를 보세요.
타입 계약의 단일 소스는 문서가 아니라 `src/lib/montecarlo/types.ts` 입니다.

---

## 콘텐츠 검수와 색인

가이드(`/guides/*`)는 인컴랩 공통 기준(`Incomelab-Architecture.md` §10 · §13)을 따릅니다.
공통 기준 문서는 이 저장소에 복사하지 않고 원본을 참조합니다.

### 발행과 검수는 다른 축입니다

| 필드 | 뜻 |
|---|---|
| `published` | 글이 완성되어 라우트로 존재하는가 |
| `review.status` | 내용의 근거가 어디까지 확인됐는가 |

`review.status` 는 세 단계입니다. 이 위에 다른 계층을 두지 않습니다.

| 상태 | 뜻 | 색인 |
|---|---|---|
| `Verified` | 공식 출처로 확인됨 | 색인 |
| `Pending Review` | 재검토 트리거를 받은 상태 | 색인 유지 |
| `Provisional` | 근거가 확정되지 않음 | **색인 금지** |

### 날짜는 세 가지를 구분합니다

| 필드 | 뜻 |
|---|---|
| `review.updatedAt` | 문서 수정일. 문구·구조를 고친 날이며 사실 검토를 뜻하지 않습니다 |
| `review.sourceChecks[].checkedAt` · `.scope` | 출처별 확인일과 **확인한 범위** |
| `review.fullReviewAt` | 문서 전체 검토일. 전체를 검토했을 때만 기록하며, 출처 하나의 확인일에서 유도하지 않습니다 |

확인하지 못한 항목은 `review.unverifiedScope` 에 남기고 화면에도 그대로 노출합니다.

### 미검토와 근거 미확정을 구분합니다

| 상황 | 처리 |
|---|---|
| 이미 반영된 기준을 이번에 **다시 확인하지 못함** | 문서는 공개 유지. `unverifiedScope` 에 "재확인하지 못함"으로 기록 |
| 주장의 **근거 자체가 확정되지 않음** | 해당 절·FAQ 에 `provisional: { reason }` 을 달아 **공개에서 보류**. 렌더링·FAQ 구조화 데이터·링크 검사에서 모두 빠지고, 보류 사유가 검토 블록에 표시됨 |

근거가 확정되지 않은 내용을 "확인 전 정보"라는 문구만 붙여 그대로 공개하지 않습니다.
반대로, 문서에 확인 못 한 부분이 하나 있다고 문서 전체를 색인에서 빼지도 않습니다.
남는 본문이 근거가 기록된 주장만 담고 있으면 문서는 공개를 유지합니다.
보류한 부분이 남아 있는 동안에는 `Verified` 로 올릴 수 없습니다(빌드 실패).

### 색인 금지는 빌드에서 강제합니다

`Provisional` 문서는 사이트맵 제외 하나로 끝내지 않고 아래가 함께 적용됩니다.

- `src/app/sitemap.ts` — 사이트맵에서 제외
- `src/app/guides/[slug]/page.tsx` — `robots: noindex, nofollow` 메타데이터, Article·FAQ 구조화 데이터 미부착, 본문 상단 안내
- `src/app/guides/page.tsx` — 허브 목록에서 제외
- 색인되는 문서가 `Provisional` 문서를 링크하면 **빌드 실패**

`src/lib/contentGate.ts` 의 `assertContentGate()` 가 사이트맵과 가이드 라우트 생성에서 호출되므로,
구조적 결함(빈 본문, 출처 기록 누락, 깨진 내부 링크·앵커, 검수 상태와 기록의 모순)이 있으면
`npm run build` 가 실패합니다.

> 자동 검사는 구조적 결함만 봅니다. **검사 통과는 편집 검토 완료도, Verified 판정도 아닙니다.**
> 상태를 올리는 일은 사람이 문서 전체를 검토한 뒤 데이터에 직접 기록할 때만 일어납니다.
> 최소 글자 수 기준은 두지 않으며, 자동차 플랫폼 전용 Safety Review 계층도 이 저장소에 두지 않습니다.

### 기준값과 재검토 트리거

세율·공제액·기준금액의 단일 소스는 `src/lib/taxRates.ts` 입니다. 계산기·화면 문구·FAQ·검색 설명은
모두 이 값을 참조하므로, 같은 숫자를 여러 곳에 적어 두지 않습니다.

가이드는 자신이 참조한 기준과 그때의 지문(`taxBasisFingerprint`)을 `review.basis` 에 기록합니다.
`taxRates.ts` 값이 바뀌면 지문이 달라지고, `Verified` 문서는 자동으로 **재검토 대상(Pending Review)** 이
됩니다. 내려가는 방향으로만 동작합니다 — 기준값 변경으로 `Provisional` 이 `Pending Review` 나
`Verified` 가 되는 일은 없고, `Provisional` 의 색인 차단도 그대로 유지됩니다.

### 현재 검토 상태

2026-09-16 기준으로 **Verified 문서는 없습니다.** 7편 모두 `Pending Review` 입니다.

- **해외주식 양도세 가이드**: 해외주식 과세 여부·국세 세율(중소기업 10% / 그 밖 20%)·확정신고 기한(다음 해 5월 1일~31일)을
  법제처 자료의 해외주식 문답으로 확인했습니다. 지방소득세 가산분, 기본공제의 국외자산 적용 근거,
  환율 기준은 재확인하지 못해 `unverifiedScope` 에 기록했습니다. 보류한 본문은 없습니다.
- **배당소득세 가이드**: 국내 배당 원천징수 국세 세율 14% 와 고배당기업 과세특례의 근거 조문·시행일
  (조세특례제한법 제104조의27, 2026-01-01 시행 / 금융위원회 자료)을 확인했습니다.
  특례의 **세율 구간·배당성향 요건·한시 종료 연도·적용 자산 범위는 근거를 확인하지 못해 본문 1개 절과 FAQ 1개를 공개에서 보류**했습니다.
  문서 자체는 공개·색인을 유지합니다.
- 나머지 5편: 이번 적용 범위 밖이라 근거를 재검토하지 않았습니다. 기존 공개 상태는 유지했습니다.

---

## 기술 스택

| 영역 | 사용 |
|---|---|
| 프레임워크 | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| 언어 | TypeScript 5 |
| 테스트 | Vitest 4 (`environment: node`) |
| 배포 | Cloudflare Workers (`@opennextjs/cloudflare` + `wrangler`) |

정확한 버전은 `package.json` 을 기준으로 합니다.

---

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버는 기본적으로 <http://localhost:3000> 에서 열립니다.

---

## 검사와 테스트

| 명령 | 하는 일 |
|---|---|
| `npm run lint` | ESLint (`eslint.config.mjs`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest 1회 실행 (`tests/**/*.test.ts`) |
| `npm run test:watch` | Vitest 감시 모드 |
| `npm run build` | Next.js 프로덕션 빌드 |
| `npm run check` | lint → typecheck → test → build 순차 실행 |

빌드는 콘텐츠 검사를 함께 수행합니다 — [콘텐츠 검수와 색인](#콘텐츠-검수와-색인) 참고.

테스트는 `tests/` 아래에 있고 `@` 별칭이 `src/` 를 가리킵니다(`vitest.config.mts`).
계산 모듈만 대상으로 하므로 React·Worker 없이 Node 환경에서 돌아갑니다.

변동성 캘리브레이션 테이블(`src/lib/montecarlo/sigma-table.ts`)은 자동 생성 파일입니다.
직접 편집하지 말고 `node scripts/gen-sigma-table.mjs` 로 다시 만드세요.

---

## 배포

Cloudflare Workers 에 OpenNext 어댑터로 배포합니다. 설정은 `wrangler.jsonc`,
`open-next.config.ts` 에 있습니다.

| 명령 | 하는 일 |
|---|---|
| `npm run preview` | OpenNext 빌드 후 로컬에서 Workers 런타임으로 미리보기 |
| `npm run deploy` | OpenNext 빌드 후 배포 |
| `npm run upload` | OpenNext 빌드 후 업로드(즉시 전환 없이 버전 업로드) |
| `npm run cf-typegen` | `wrangler types` 로 `CloudflareEnv` 타입 생성 |

`next.config.ts` 에는 `www.주식계산기.kr` → `주식계산기.kr` 영구 리다이렉트가 정의돼 있습니다.

> 이 문서를 갱신하면서 배포 명령을 실행하거나 운영 배포 상태를 확인하지는 않았습니다.
> 위 표는 `package.json` 의 스크립트 정의를 옮긴 것입니다.

---

## 디렉터리 구조

```
src/
  app/                  App Router 페이지·라우트 (sitemap.ts, robots.ts 포함)
  components/
    calculator/         계산기 UI 컴포넌트
    dev/                개발 전용 화면(MonteCarloLab)
    layout/ seo/ ui/    공통 레이아웃·구조화 데이터·UI 조각
  data/guidePages.ts    가이드 콘텐츠 정의
  hooks/useMonteCarlo.ts  Worker 수명주기·디바운스·진행률
  lib/                  계산 로직 (순수 함수)
    montecarlo/         시뮬레이션 엔진
  workers/              Web Worker 진입점
tests/                  Vitest 테스트
scripts/                gen-sigma-table.mjs (캘리브레이션 테이블 생성)
docs/                   설계·감사·구현 문서 (docs/README.md 참고)
```

---

## 문서

문서 색인은 **[docs/README.md](docs/README.md)** 에 있습니다. 요약하면:

| 문서 | 성격 |
|---|---|
| [docs/montecarlo-engine.md](docs/montecarlo-engine.md) | **현재 기준** — 시뮬레이션 엔진 모형·구현 설명 |
| `docs/2026-*.md` | **과거 기록** — 당시의 설계안·감사·작업 보고서. 내용은 그대로 두고 상단에 기록 시점을 표시했습니다 |
| `docs/pdf-exports/` | 같은 이름 Markdown 을 조판한 PDF 사본. **로컬 전용 — `.gitignore` 로 커밋에서 제외** |

문서 규칙:

- 날짜가 붙은 문서는 **그 시점의 기록**입니다. 현재 상태와 다를 수 있으며, 사실관계를 고쳐 쓰지 않고 상단 안내와 정정 노트로만 차이를 표시합니다.
- 날짜가 없는 문서가 **현재 기준 문서**입니다.
- 타입·상수·계산식의 단일 소스는 코드입니다. 문서는 위치와 규칙을 설명하고, 전체 정의를 복사해 두지 않습니다.
